# Interview.me Backend

A production-ready backend for the **Interview.me** platform, built to manage interview sessions, real-time chat, and video calls with secure authentication and scalable architecture.

This backend integrates:

* Clerk for authentication
* Stream for chat & video
* Inngest for background event processing
* MongoDB for data persistence

---

## Tech Stack

* Node.js (v18+)
* Express.js
* MongoDB + Mongoose
* Clerk Authentication
* Stream Chat & Video
* Inngest (Event-driven jobs)
* Zod (Validation)
* Pino (Logging)
* Swagger (API Documentation)

---

## Folder Structure

```
backend/
└── src/
    ├── config/       # Swagger configuration
    ├── controllers/  # Request handlers
    ├── events/       # Inngest background jobs
    ├── lib/          # Core utilities (db, env, logger, stream)
    ├── middleware/   # Auth, validation, error handling
    ├── models/       # Mongoose schemas
    ├── routes/       # API routes
    ├── services/     # Business logic layer
    ├── utils/        # Shared utilities
    └── server.js     # App entry point
```

---

## Core Features

* User sync via Clerk webhooks (create/delete users)
* Interview session lifecycle

  * Create session
  * Join session
  * End session
* Real-time chat using Stream
* Video call integration
* Secure route protection
* Centralized error handling
* Structured logging
* Swagger API documentation

---

## Environment Variables

Create a `.env` file in the root of backend folder:

```
SERVER_PORT=5000
NODE_ENV=development
API_PREFIX=/api/v1

CLIENT_URL_DEV=http://localhost:5173
CLIENT_URL_PROD=https://yourdomain.com

DB_URL=your_mongodb_connection_string

CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable

STREAM_API_KEY=your_stream_key
STREAM_API_SECRET=your_stream_secret

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

---

## Installation

```bash
cd backend
npm install
```

---

## Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm run start:prod
```

Server will start on:

```
http://localhost:5000
```

---

## Health Check

Verify backend status:

```
GET /health
```

URL:

```
http://localhost:5000/health
```

Response:

```json
{
  "status": "Backend operational",
  "environment": "development"
}
```

---

## Swagger API Docs

Open interactive API documentation:

```
http://localhost:5000/api-docs
```

Use the "Authorize" button and paste your Clerk Bearer token to test protected APIs.

---

## API Lifecycle Flow

```
Request
 → Route
 → Middleware (Auth + Validation)
 → Controller
 → Service
 → Database / Stream
 → Response
```

---

## Main Endpoints Overview

### Sessions

* POST /api/v1/sessions – Create session
* GET /api/v1/sessions/active – Active sessions
* GET /api/v1/sessions/my-recent – User history
* POST /api/v1/sessions/:id/join – Join session
* POST /api/v1/sessions/:id/end – End session

### Chat

* GET /api/v1/chat/token – Generate Stream token

---

## Architecture Principles

* Layered Architecture
* Single Responsibility per file
* Event-driven processing
* Strong validation with Zod
* Fail-safe error handling
* Scalable session lifecycle design

---

## Recommended Development Flow

1. Start backend server
2. Open Swagger
3. Authenticate using Clerk token
4. Create session
5. Join session
6. Start call + chat frontend

---

## Logging

Centralized logging via Pino provides:

* Request tracking
* Error tracing
* Performance monitoring

---

## Deployment Notes

* Use Node 18+
* MongoDB Atlas recommended
* Secure all environment variables
* Enable HTTPS in production
* Use PM2 or Docker for process management

---

## Status

Backend is fully functional and production-ready.
Designed with scalability and maintainability in mind.

---

## Maintainer

Interview.me Backend
Author: Tanish Kumar
