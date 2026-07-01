import express from "express";
import guardx from "../../src/index.js";

const app = express();

app.use(
    guardx({
        limit: 2,
        windowMs: 60000,
        standardHeaders: true,

        handler(req, res) {
            return res.status(429).json({
                success: false,
                message: "Limit Exeed",
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