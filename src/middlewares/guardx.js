import MemoryStore from "../store/memoryStore.js";
import validateOptions from "../utils/validateOptions.js";
import getClientKey from "../utils/getClientKey.js";
import { fixedWindow } from "../algorithms/fixedWindow.js";

function guardx(options = {}) {

    const config = validateOptions(options);

    const store = config.store ?? new MemoryStore();

    return (req, res, next) => {

        const key = getClientKey(req);

        const result = fixedWindow({
            store,
            key,
            limit: config.limit,
            windowMs: config.windowMs
        });

        // Remaining time in seconds
        const retryAfter = Math.max(
            Math.ceil((result.resetAt - Date.now()) / 1000),
            0
        );

        // Send RateLimit headers
        if (config.standardHeaders) {
            res.setHeader("RateLimit-Limit", config.limit);
            res.setHeader("RateLimit-Remaining", result.remaining);
            res.setHeader("RateLimit-Reset", retryAfter);
        }

        if (result.allowed) {
            return next();
        }

        // Send Retry-After header when blocked
        if (config.standardHeaders) {
            res.setHeader("Retry-After", retryAfter);
        }

        if (config.handler) {
            return config.handler(req, res, {
                limit: config.limit,
                totalHits: result.totalHits,
                remaining: result.remaining,
                resetAt: result.resetAt,
                retryAfter
            });
        }

        return res.status(429).json({
            success: false,
            message: config.message,
        });

    };

}

export default guardx;