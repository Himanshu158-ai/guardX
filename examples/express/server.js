import express from "express";
import guardx from "../../src/middlewares/guardx.js";

const app = express();

app.use(
    guardx({
        limit: 5,
        windowMs: 10000
    })
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Hello GuardX 🚀"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});