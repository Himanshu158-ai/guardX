import { test } from "../testRunner.js";
import guardx from "../../src/middlewares/guardx.js";
import MemoryStore from "../../src/store/memoryStore.js";

function createResponse() {

    return {
        statusCode: null,
        body: null,

        status(code) {
            this.statusCode = code;
            return this;
        },

        json(data) {
            this.body = data;
            return this;
        }
    };

}

test("Should call next() when request is allowed", (assert) => {

    const middleware = guardx({
        limit: 5,
        windowMs: 60000
    });

    const req = {
        ip: "127.0.0.1",
        headers: {}
    };

    const res = createResponse();

    let called = false;

    const next = () => {
        called = true;
    };

    middleware(req, res, next);

    assert.equal(called, true);

});

test("Should return 429 after limit", (assert) => {

    const middleware = guardx({
        limit: 2,
        windowMs: 60000
    });

    const req = {
        ip: "127.0.0.1",
        headers: {}
    };

    const next = () => {};

    middleware(req, createResponse(), next);
    middleware(req, createResponse(), next);

    const res = createResponse();

    middleware(req, res, next);

    assert.equal(res.statusCode, 429);

});

test("Should return custom message", (assert) => {

    const middleware = guardx({
        limit: 1,
        windowMs: 60000,
        message: "Custom Limit Exceeded"
    });

    const req = {
        ip: "127.0.0.1",
        headers: {}
    };

    const next = () => {};

    middleware(req, createResponse(), next);

    const res = createResponse();

    middleware(req, res, next);

    assert.equal(
        res.body.message,
        "Custom Limit Exceeded"
    );

});

test("Should use custom MemoryStore", (assert) => {

    const middleware = guardx({
        store: new MemoryStore(),
        limit: 1,
        windowMs: 60000
    });

    const req = {
        ip: "127.0.0.1",
        headers: {}
    };

    const next = () => {};

    middleware(req, createResponse(), next);

    const res = createResponse();

    middleware(req, res, next);

    assert.equal(res.statusCode, 429);

});

test("Should keep different IPs independent", (assert) => {

    const middleware = guardx({
        limit: 1,
        windowMs: 60000
    });

    const next = () => {};

    middleware({
        ip: "1.1.1.1",
        headers: {}
    }, createResponse(), next);

    const res = createResponse();

    middleware({
        ip: "2.2.2.2",
        headers: {}
    }, res, next);

    assert.equal(res.statusCode, null);

});

test("Should use x-forwarded-for header", (assert) => {

    const middleware = guardx({
        limit: 1,
        windowMs: 60000
    });

    const next = () => {};

    middleware({
        ip: "127.0.0.1",
        headers: {
            "x-forwarded-for": "10.10.10.10"
        }
    }, createResponse(), next);

    const res = createResponse();

    middleware({
        ip: "127.0.0.1",
        headers: {
            "x-forwarded-for": "10.10.10.10"
        }
    }, res, next);

    assert.equal(res.statusCode, 429);

});

test("Should not call next() when request is blocked", (assert) => {

    const middleware = guardx({
        limit: 1,
        windowMs: 60000
    });

    const req = {
        ip: "127.0.0.1",
        headers: {}
    };

    // First request (allowed)
    middleware(req, createResponse(), () => {});

    let called = false;

    const next = () => {
        called = true;
    };

    // Second request (blocked)
    middleware(req, createResponse(), next);

    assert.equal(called, false);

});

test("Should throw when client key cannot be determined", (assert) => {

    const middleware = guardx({
        limit: 1,
        windowMs: 60000
    });

    assert.throws(() => {

        middleware(
            {},
            createResponse(),
            () => {}
        );

    });

});