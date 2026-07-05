/**
 * Chatbot API Test Pipeline
 * --------------------------------------------------------------------------
 * Skrip sederhana untuk menguji alur endpoint chatbot secara berurutan:
 *   A. Login              -> POST /api/v1/users/login
 *   B. Buat conversation  -> POST /api/v1/chatbot/conversations
 *   C. Kirim pesan        -> POST /api/v1/chatbot/conversations/:id/messages/sync (JSON)
 *                         atau POST /api/v1/chatbot/conversations/:id/messages      (SSE stream)
 *
 * Requirement: Node.js 18+ (pakai built-in fetch, tidak perlu install dependency).
 *
 * CARA PAKAI
 * --------------------------------------------------------------------------
 *   node test-chatbot-pipeline.js sync
 *   node test-chatbot-pipeline.js stream
 *
 * KONFIGURASI (lewat environment variable, semua opsional/ada default)
 * --------------------------------------------------------------------------
 *   BASE_URL   default: http://localhost:3000
 *   EMAIL      default: your-email@example.com
 *   PASSWORD   default: your-password
 *   TITLE      default: "Test Chat Dari Script"
 *   MESSAGE    default: "Halo, apakah ini berjalan?"
 *
 * Contoh:
 *   BASE_URL=http://localhost:3000 EMAIL=test@mail.com PASSWORD=123456 \
 *   node test-chatbot-pipeline.js sync
 * --------------------------------------------------------------------------
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const EMAIL = process.env.EMAIL || "your-email@example.com";
const PASSWORD = process.env.PASSWORD || "your-password";
const TITLE = process.env.TITLE || "Test Chat Dari Script";
const MESSAGE = process.env.MESSAGE || "Halo, apakah ini berjalan?";
const MODE = (process.argv[2] || "sync").toLowerCase(); // "sync" | "stream"

const log = (step, msg) => console.log(`\n[${step}] ${msg}`);

/**
 * Helper: lempar error yang jelas kalau response HTTP tidak OK.
 */
async function assertOk(res, stepLabel) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `${stepLabel} gagal — status ${res.status} ${res.statusText}\n${text}`
    );
  }
}

/**
 * A. Login -> dapatkan token
 */
async function login() {
  log("A", `Login sebagai ${EMAIL} ...`);
  const res = await fetch(`${BASE_URL}/api/v1/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  await assertOk(res, "Login");

  const data = await res.json();
  const token = data.token || data.data?.token || data.accessToken;
  if (!token) {
    throw new Error(
      `Login berhasil tapi token tidak ditemukan di response:\n${JSON.stringify(data, null, 2)}`
    );
  }
  log("A", "Login berhasil, token didapat.");
  return token;
}

/**
 * B. Buat conversation baru -> dapatkan conversation id
 */
async function createConversation(token) {
  log("B", `Membuat conversation baru: "${TITLE}" ...`);
  const res = await fetch(`${BASE_URL}/api/v1/chatbot/conversations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: TITLE }),
  });
  await assertOk(res, "Create conversation");

  const data = await res.json();
  const conversationId = data.id || data.data?.id;
  if (!conversationId) {
    throw new Error(
      `Conversation dibuat tapi id tidak ditemukan di response:\n${JSON.stringify(data, null, 2)}`
    );
  }
  log("B", `Conversation dibuat, id = ${conversationId}`);
  return conversationId;
}

/**
 * C.1 Kirim pesan lewat jalur sinkron (JSON biasa)
 */
async function sendMessageSync(token, conversationId) {
  log("C", `Mengirim pesan (sync/JSON): "${MESSAGE}" ...`);
  const res = await fetch(
    `${BASE_URL}/api/v1/chatbot/conversations/${conversationId}/messages/sync`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: MESSAGE }),
    }
  );
  await assertOk(res, "Send message (sync)");

  const data = await res.json();
  log("C", "Jawaban AI diterima:");
  console.log(JSON.stringify(data, null, 2));
}

/**
 * C.2 Kirim pesan lewat jalur streaming (SSE) — cetak chunk secara real-time
 */
async function sendMessageStream(token, conversationId) {
  log("C", `Mengirim pesan (stream/SSE): "${MESSAGE}" ...`);
  const res = await fetch(
    `${BASE_URL}/api/v1/chatbot/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: MESSAGE }),
    }
  );
  await assertOk(res, "Send message (stream)");

  log("C", "Menerima stream real-time:\n");
  const decoder = new TextDecoder();
  for await (const chunk of res.body) {
    process.stdout.write(decoder.decode(chunk, { stream: true }));
  }
  console.log("\n\n[C] Stream selesai.");
}

/**
 * Jalankan seluruh pipeline
 */
async function main() {
  console.log(`=== Chatbot API Test Pipeline (mode: ${MODE}) ===`);
  console.log(`Target: ${BASE_URL}`);

  try {
    const token = await login();
    const conversationId = await createConversation(token);

    if (MODE === "stream") {
      await sendMessageStream(token, conversationId);
    } else {
      await sendMessageSync(token, conversationId);
    }

    console.log("\n✅ Pipeline selesai tanpa error.");
  } catch (err) {
    console.error("\n❌ Pipeline gagal:", err.message);
    process.exit(1);
  }
}

main();