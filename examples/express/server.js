import express from "express";
import { createClient } from "redis";
// import guardx, { RedisStore } from "guardx-rate-limit";
import guardx, { RedisStore } from "../../src/index.js";

const app = express();

const client = createClient({
    url: "redis://localhost:6379"
});

client.on("error", (err) => {
    console.log("Redis Error:", err);
});

await client.connect();

console.log("✅ Redis Connected");

app.use(
    guardx({
        limit: 5,
        windowMs: 10000,
        standardHeaders: true,
        handler(req, res, info) {
            return res.status(429).json({
                success: false,
                message: "Rate limit exceeded",
                retryAfter: info.retryAfter,
                remaining: info.remaining,
                limit: info.limit
            });
        },
        store: new RedisStore(client)
    })
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Hello GuardX"
    });
});

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});