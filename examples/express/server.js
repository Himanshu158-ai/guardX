import express from "express";
import guardx from "../../src/index.js";

const app = express();

app.use(
    guardx({
        limit: 2,
        windowMs: 60000,
        standardHeaders: true,

        handler(req, res, info) {
            return res.status(429).json({
                success: false,
                message: "Too many requests",
                retryAfter: info.retryAfter,
                remaining: info.remaining,
                limit: info.limit
            });
        }
    })
);

app.get("/", (req, res) => {
    res.json({
        message: "Hello GuardX 🚀"
    });
});

app.listen(3000, () => {
    console.log("Running...");
});