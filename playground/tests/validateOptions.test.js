import { test } from "../testRunner.js";
import validateOptions from "../../src/utils/validateOptions.js";
import MemoryStore from "../../src/store/memoryStore.js";

test("Should return default options", (assert) => {

    const config = validateOptions();

    assert.equal(config.limit, 100);
    assert.equal(config.windowMs, 60000);
    assert.equal(config.headers, true);
    assert.equal(config.message, "Too many requests.");

});

test("Should override default options", (assert) => {

    const config = validateOptions({
        limit: 5,
        windowMs: 5000
    });

    assert.equal(config.limit, 5);
    assert.equal(config.windowMs, 5000);
    assert.equal(config.headers, true);
    assert.equal(config.message, "Too many requests.");

});

test("Should throw for invalid limit", (assert) => {

    assert.throws(() => {

        validateOptions({
            limit: -1
        });

    });

});

test("Should throw for invalid windowMs", (assert) => {

    assert.throws(() => {

        validateOptions({
            windowMs: 0
        });

    });

});

test("Should throw for invalid headers", (assert) => {

    assert.throws(() => {

        validateOptions({
            headers: "true"
        });

    });

});

test("Should throw for invalid message", (assert) => {

    assert.throws(() => {

        validateOptions({
            message: 123
        });

    });

});

test("Should throw for unknown option", (assert) => {

    assert.throws(() => {

        validateOptions({
            abc: true
        });

    });

});

test("Should accept valid custom store", (assert) => {

    const config = validateOptions({
        store: new MemoryStore()
    });

    assert.ok(config.store);

});

test("Should reject invalid custom store", (assert) => {

    assert.throws(() => {

        validateOptions({
            store: {}
        });

    });

});

test("Should reject string limit", (assert) => {

    assert.throws(() => {

        validateOptions({
            limit: "100"
        });

    });

});

test("Should reject decimal limit", (assert) => {

    assert.throws(() => {

        validateOptions({
            limit: 2.5
        });

    });

});