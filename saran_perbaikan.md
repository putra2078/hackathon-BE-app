# Root Cause Final: Kenapa Test #1 & #2 Hang

## Ringkasan

Ada **dua masalah independen** yang sama-sama berkontribusi:

1. **Mismatch kontrak endpoint** — test memanggil `POST /messages` (streaming/SSE) tapi berharap JSON biasa.
2. **Tidak ada timeout pada panggilan ke AI service eksternal** — kalau AI provider lambat/tidak terjangkau, `await aiService.generateResponse(...)` / `generateStreamingResponse(...)` menggantung tanpa batas waktu.

Masalah #2 adalah yang membuat request benar-benar **hang** (bukan sekadar gagal assert dengan cepat). Masalah #1 tetap harus diperbaiki karena walau #2 sudah dibereskan, test tetap akan gagal (response bukan JSON `{success:true}`, melainkan event-stream).

---

## Perbaikan yang Direkomendasikan

### A. Perbaiki test agar menembak endpoint yang benar

Jika tujuan test #1 & #2 adalah menguji jalur **JSON/non-streaming**, arahkan ke `/messages/sync`:

```js
const res = await request(server)
  .post(`/api/v1/chatbot/conversations/${testConversationId}/messages/sync`)
  .set('Authorization', `Bearer ${VALID_TOKEN}`)
  .send({ content: 'Hello AI' })
  .timeout({ deadline: 8000 });
```

Kalau justru endpoint `/messages` (streaming) yang memang ingin diuji, assertion-nya harus disesuaikan untuk memeriksa isi event-stream, bukan `res.body.success`. Tapi untuk kebutuhan test API sederhana, `/sync` adalah pilihan yang lebih masuk akal.

### B. Tambahkan timeout pengaman di sekitar panggilan AI service (paling penting)

Ini krusial bukan cuma untuk testing, tapi juga untuk **produksi** — kalau AI provider down/lambat, user asli juga akan mengalami request yang menggantung selamanya tanpa perbaikan ini.

```js
/**
 * Membungkus sebuah promise dengan batas waktu. Jika promise tidak selesai
 * dalam waktu yang ditentukan, akan reject dengan error timeout yang jelas
 * alih-alih menggantung tanpa batas.
 */
const withTimeout = (promise, ms, label = "Operation") => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

module.exports = { withTimeout };
```

Lalu di `message.service.js`, bungkus pemanggilan AI service:

```js
const { withTimeout } = require("../../pkg/with-timeout"); // sesuaikan path

// di dalam sendNonStreaming():
const responseText = await withTimeout(
  aiService.generateResponse(prompt),
  15000,
  "AI response generation"
);

// di dalam send():
const stream = await withTimeout(
  aiService.generateStreamingResponse(prompt),
  15000,
  "AI streaming response generation"
);
```

Dengan ini, kalau AI provider bermasalah, request akan gagal dengan error yang jelas dalam 15 detik — bukan menggantung tanpa batas waktu, baik saat testing maupun di produksi.

### C. Mock `ai.service` di unit test (wajib untuk test yang cepat & stabil)

Unit test **tidak seharusnya bergantung pada API AI eksternal yang asli** — selain lambat, juga rentan gagal karena kuota/API key/jaringan, membuat test flaky. Tambahkan di bagian atas `chatbot.test.js`:

```js
jest.mock("../internal/app/domain/chatbot/ai.service", () => ({
  generateResponse: jest.fn().mockResolvedValue("Mocked AI reply"),
  generateStreamingResponse: jest.fn().mockResolvedValue(
    (async function* () {
      yield { text: "Mocked " };
      yield { text: "AI " };
      yield { text: "reply" };
    })()
  ),
}));
```

Mock ini membuat `aiService.generateResponse` / `generateStreamingResponse` langsung selesai tanpa menyentuh network sama sekali, sehingga test #1 dan #2 akan berjalan cepat dan deterministik.

### D. Pastikan `streamingService.streamToSSE` selalu menutup response, bahkan saat error

Kalau belum ada, tambahkan `try/catch/finally` di `streaming.service.js` agar jika terjadi error di tengah proses streaming, `res.end()` tetap dipanggil — supaya koneksi tidak menggantung terbuka selamanya di sisi client.

---

## Prioritas Perbaikan

| Prioritas | Perbaikan | Dampak |
|---|---|---|
| 1 (wajib) | Mock `ai.service` di test | Test jadi cepat & tidak bergantung pada API eksternal |
| 2 (wajib, termasuk untuk produksi) | Timeout pengaman di sekitar panggilan AI service | Mencegah request hang selamanya baik di test maupun produksi nyata |
| 3 | Perbaiki test agar menembak endpoint yang sesuai (`/sync` untuk JSON) | Assertion test jadi valid sesuai kontrak API |
| 4 | Pastikan `streamToSSE` selalu `res.end()` walau error | Mencegah koneksi SSE menggantung saat streaming gagal di tengah jalan |