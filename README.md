# GuardX 🚀

A lightweight, modular, and extensible Express rate limiter built with clean architecture.

GuardX focuses on simplicity, performance, and future extensibility while keeping the public API stable.

---

## Features

- ✅ Fixed Window Algorithm
- ✅ In-Memory Store
- ✅ Custom Store Support
- ✅ Standard RateLimit Headers
- ✅ Retry-After Header
- ✅ Custom Response Handler
- ✅ Configuration Validation
- ✅ Lightweight & Zero Dependencies

---

## Installation

```bash
npm install guardx-rate-limit
```

---

## Basic Usage

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

## Standard Headers

Enable HTTP RateLimit headers.

```js
guardx({
    standardHeaders: true
});
```

Example:

```
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 58
Retry-After: 58
```

---

## Custom Handler

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

## Available Options

| Option | Type | Default |
|--------|------|---------|
| limit | number | 100 |
| windowMs | number | 60000 |
| message | string | Too many requests. |
| standardHeaders | boolean | true |
| handler | function | undefined |
| store | Store | MemoryStore |

---

## Handler Info

| Property | Description |
|----------|-------------|
| limit | Configured request limit |
| totalHits | Current request count |
| remaining | Remaining requests |
| resetAt | Window reset timestamp |
| retryAfter | Seconds until reset |

---

## Roadmap

- ✅ Fixed Window
- ✅ Memory Store
- ✅ Standard Headers
- ✅ Custom Handler
- 🔜 Redis Store
- 🔜 Sliding Window
- 🔜 Token Bucket

---

## License

MIT