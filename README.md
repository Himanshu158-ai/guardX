# GuardX

A lightweight and customizable Express rate limiting middleware.

## Features

- 🚀 Easy to use
- ⚡ Fast in-memory storage
- 🔒 Fixed Window rate limiting
- 🛠️ Custom store support
- ✅ Zero dependencies
- 📦 ESM Support

## Installation

```bash
npm install guardx-rate-limit
```

## Basic Usage

```javascript
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
    res.send("Hello World");
});

app.listen(3000);
```

## Options

| Option | Type | Default |
|--------|------|---------|
| limit | number | 100 |
| windowMs | number | 60000 |
| headers | boolean | true |
| message | string | "Too many requests." |
| store | Custom Store | MemoryStore |

## Custom Store

```javascript
import { MemoryStore } from "guardx";

const store = new MemoryStore();

app.use(
    guardx({
        store
    })
);
```

## Response

```json
{
    "message": "Too many requests."
}
```

## License

MIT