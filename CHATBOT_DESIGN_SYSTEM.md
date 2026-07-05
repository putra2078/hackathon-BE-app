# AI Chatbot Backend Architecture (ExpressJS)

## Folder Structure

```text
src
│
├── app.js
├── server.js
│
├── config
│   ├── database.js
│   ├── redis.js
│   ├── storage.js
│   ├── ai.js
│   └── env.js
│
├── routes
│   ├── index.js
│   ├── auth.route.js
│   ├── conversation.route.js
│   ├── message.route.js
│   ├── attachment.route.js
│   └── ai.route.js
│
├── controllers
│   ├── auth.controller.js
│   ├── conversation.controller.js
│   ├── message.controller.js
│   ├── attachment.controller.js
│   └── ai.controller.js
│
├── services
│   ├── ai
│   │   ├── ai.service.js
│   │   ├── prompt.service.js
│   │   ├── memory.service.js
│   │   ├── history.service.js
│   │   ├── summary.service.js
│   │   ├── token.service.js
│   │   ├── embedding.service.js
│   │   └── streaming.service.js
│   │
│   ├── conversation.service.js
│   ├── message.service.js
│   ├── attachment.service.js
│   └── auth.service.js
│
├── repositories
│   ├── conversation.repository.js
│   ├── message.repository.js
│   ├── summary.repository.js
│   ├── attachment.repository.js
│   └── user.repository.js
│
├── models
│   ├── user.model.js
│   ├── conversation.model.js
│   ├── message.model.js
│   ├── summary.model.js
│   └── attachment.model.js
│
├── middlewares
│   ├── auth.middleware.js
│   ├── upload.middleware.js
│   ├── error.middleware.js
│   ├── logger.middleware.js
│   └── rateLimit.middleware.js
│
├── validators
│   ├── conversation.validator.js
│   ├── message.validator.js
│   └── auth.validator.js
│
├── utils
│   ├── response.js
│   ├── logger.js
│   ├── tokenizer.js
│   └── helper.js
│
├── queues
│   ├── summary.queue.js
│   ├── embedding.queue.js
│   └── title.queue.js
│
├── sockets
│   └── chat.socket.js
│
└── docs
```

---

# Database Mapping

## users

```text
id
name
email
password
createdAt
updatedAt
```

---

## conversations

```text
id
userId
title
lastMessage
createdAt
updatedAt
```

---

## messages

```text
id
conversationId
role
content
token
attachmentId
createdAt
```

role

```text
user

assistant

system
```

---

## summaries

```text
id
conversationId
summary
lastMessageId
createdAt
```

---

## attachments

```text
id
messageId
filename
mimeType
url
createdAt
```

---

# Layer Architecture

```text
Route

↓

Controller

↓

Service

↓

Repository

↓

Database
```

Controller tidak boleh berisi business logic.

Semua business logic berada pada Service.

Repository hanya bertugas membaca dan menulis database.

---

# Chat Flow

```text
POST /messages

↓

MessageController

↓

MessageService.send()

↓

ConversationRepository

↓

MessageRepository

↓

HistoryService

↓

PromptService

↓

AIService

↓

StreamingService

↓

Save Assistant Message

↓

Response
```

---

# Prompt Builder

```text
System Prompt

+

Conversation Summary

+

Recent Messages

+

Current Message
```

Contoh

```text
You are a helpful assistant.

Summary

User sedang belajar ExpressJS.

Conversation

User:
Apa itu middleware?

Assistant:
...

User:
Apa fungsi repository?
```

---

# Context Builder

```text
Conversation

↓

Load Summary

↓

Load Last 20 Messages

↓

Merge

↓

Prompt
```

---

# AI Service

```text
generateResponse()

buildPrompt()

callModel()

stream()

countTokens()

trimContext()
```

---

# Memory Service

```text
loadSummary()

generateSummary()

updateSummary()

archiveMessages()
```

---

# History Service

```text
getRecentMessages()

getContext()

removeOldMessages()

saveMessage()
```

---

# Conversation Service

```text
create()

rename()

delete()

archive()

findById()

findAllByUser()
```

---

# Message Service

```text
send()

reply()

getMessages()

delete()

edit()

regenerate()
```

---

# Repository

ConversationRepository

```text
create()

findById()

findAll()

update()

delete()
```

MessageRepository

```text
save()

findByConversation()

findRecent()

delete()

update()
```

SummaryRepository

```text
find()

create()

update()
```

AttachmentRepository

```text
upload()

find()

delete()
```

---

# REST API

## Conversation

```http
POST   /api/conversations

GET    /api/conversations

GET    /api/conversations/:id

PATCH  /api/conversations/:id

DELETE /api/conversations/:id
```

---

## Messages

```http
GET  /api/conversations/:id/messages

POST /api/conversations/:id/messages

DELETE /api/messages/:id
```

---

## Attachment

```http
POST /api/attachments

GET /api/attachments/:id

DELETE /api/attachments/:id
```

---

# Sequence Diagram

```text
Client

│

│ POST Message

▼

Route

│

▼

Controller

│

▼

MessageService

│

├── Save User Message

├── Load Summary

├── Load History

├── Build Prompt

├── Generate AI Response

├── Save Assistant Response

└── Return Stream

▼

Client
```

---

# Streaming

```text
Client

↓

POST Message

↓

Express

↓

Open SSE

↓

AI Token

↓

Express

↓

Client Render
```

---

# Queue

Summary Queue

```text
Generate Summary
```

Embedding Queue

```text
Generate Embedding
```

Title Queue

```text
Generate Conversation Title
```

---

# Cache

Redis

```text
Conversation

Recent Messages

Summary

Session

Rate Limit
```

---

# Production Flow

```text
User

↓

Express Route

↓

Authentication

↓

Conversation Service

↓

Message Service

↓

History Service

↓

Prompt Service

↓

AI Service

↓

OpenAI / Gemini / Ollama

↓

Streaming

↓

Message Repository

↓

Redis Cache

↓

Response
```

---

# Future Scalability

```text
API Gateway

│

├── Auth Service

├── Chat Service

├── AI Service

├── Search Service

├── Notification Service

└── File Service
```

Dengan pemisahan ini, Chat Service dapat berkembang menjadi microservice tanpa mengubah struktur kode secara besar-besaran.