import DEFAULT_OPTIONS from "../constants/defaultOptions.js";
import GuardXError from "../errors/GuardXError.js";

const ALLOWED_OPTIONS = new Set([
    "limit",
    "windowMs",
    "handler",
    "standardHeaders",
    "message",
    "store"
]);


function validateOptions(options = {}) {

    // Unknown keys
    for (const key of Object.keys(options)) {

        if (!ALLOWED_OPTIONS.has(key)) {

            throw new GuardXError(
                `Unknown option "${key}".`
            );

        }

    }

    const config = {
        ...DEFAULT_OPTIONS,
        ...options
    };

    validatePositiveInteger(config.limit, "limit");

    validatePositiveInteger(config.windowMs, "windowMs");

    validateBoolean(config.standardHeaders, "standardHeaders");

    validateString(config.message, "message");

    validateStore(config.store);

    validateFunction(config.handler, "handler");

    return config;

}

export default validateOptions;


function validatePositiveInteger(value, field) {

    if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {

        throw new GuardXError(
            `"${field}" must be a positive integer.`
        );

    }

}

function validateBoolean(value, field) {

    if (typeof value !== "boolean") {

        throw new GuardXError(
            `"${field}" must be a boolean.`
        );

    }

}

function validateString(value, field) {

    if (typeof value !== "string") {

        throw new GuardXError(
            `"${field}" must be a string.`
        );

    }

}


function validateStore(store) {

    if (store == null) return;

    const requiredMethods = [
        "get",
        "set",
        "has",
        "delete",
        "clear"
    ];

    for (const method of requiredMethods) {

        if (typeof store[method] !== "function") {

            throw new GuardXError(
                `Store must implement "${method}()" method.`
            );

        }

    }

}

function validateFunction(value, field) {

    if (value == null) return;

    if (typeof value !== "function") {

        throw new GuardXError(
            `"${field}" must be a function.`
        );

    }

}