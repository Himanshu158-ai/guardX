# GuardX 🚀

A lightweight, modular, and production-ready Express rate limiter built with clean architecture.

GuardX focuses on simplicity, performance, extensibility, and a stable public API while supporting multiple storage backends.

---

# Features

- ✅ Fixed Window Algorithm
- ✅ In-Memory Store
- ✅ Redis Store
- ✅ Standard RateLimit Headers
- ✅ Retry-After Header
- ✅ Custom Response Handler
- ✅ Configuration Validation
- ✅ Lightweight

---

# Installation

```bash
npm install guardx-rate-limit
```

For Redis support:

```bash
npm install redis
```

---

# Basic Usage

```js
import express from "express";
import guardx from "guardx-rate-limit";

const app = express();

app.use(
    guardx({
        limit: 100,
        windowMs: 60 * 1000
    })
);

app.get("/", (req, res) => {
    res.json({
        success: true
    });
});

app.listen(3000);
```

---

# Redis Store

```js
import express from "express";
import { createClient } from "redis";
import guardx, { RedisStore } from "guardx-rate-limit";

const client = createClient();

await client.connect();

app.use(
    guardx({
        limit: 100,
        windowMs: 60 * 1000,
        store: new RedisStore(client)
    })
);
```

---

# Standard Headers

Enable HTTP RateLimit headers.

```js
guardx({
    standardHeaders: true
});
```

Example

```
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 58
Retry-After: 58
```

---

# Custom Handler

```js
guardx({
    handler(req, res, info) {

        return res.status(429).json({
            success: false,
            message: "Rate limit exceeded",
            retryAfter: info.retryAfter,
            remaining: info.remaining,
            limit: info.limit
        });

    }
});
```

---

# Available Options

| Option | Type | Default |
|---------|------|---------|
| limit | number | 100 |
| windowMs | number | 60000 |
| message | string | Too many requests. |
| standardHeaders | boolean | true |
| handler | function | undefined |
| store | Store | MemoryStore |

---

# Handler Info

| Property | Description |
|----------|-------------|
| limit | Configured request limit |
| totalHits | Current request count |
| remaining | Remaining requests |
| resetAt | Window reset timestamp |
| retryAfter | Seconds until reset |

---

# Built-in Stores

## MemoryStore

Default in-memory storage.

```js
guardx();
```

---

## RedisStore

Distributed storage for production deployments.

```js
const client = createClient();

await client.connect();

guardx({
    store: new RedisStore(client)
});
```

---

# Roadmap

- ✅ Fixed Window
- ✅ Memory Store
- ✅ Redis Store
- ✅ Standard Headers
- ✅ Retry-After Header
- ✅ Custom Handler
- 🔜 Sliding Window
- 🔜 Token Bucket
- 🔜 Additional Algorithms

---

# License

MIT