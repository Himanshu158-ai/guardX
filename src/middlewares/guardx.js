import MemoryStore from "../store/memoryStore.js";
import validateOptions from "../utils/validateOptions.js";
import getClientKey from "../utils/getClientKey.js";
import { fixedWindow } from "../algorithms/fixedWindow.js";

function guardx(options = {}) {

    const config = validateOptions(options);

    const store = config.store ?? new MemoryStore();

    // const algorithm = fixedWindow;

    return (req, res, next) => {

        const key = getClientKey(req);

        const result = fixedWindow({
            store,
            key,
            limit: config.limit,
            windowMs: config.windowMs
        });

        if (result.allowed) {
            return next();
        }

        return res.status(429).json({
            success: false,
            message: config.message,
            // tryAgain: result.resetTime //shakkk

        });

    };

}

export default guardx;