import { test } from "../testRunner.js";
import MemoryStore from "../../src/store/memoryStore.js";
import { fixedWindow } from "../../src/algorithms/fixedWindow.js";

function createConfig(store, key = "user1") {
    return {
        store,
        key,
        limit: 5,
        windowMs: 60000
    };
}

test("Should allow first request", (assert) => {

    const store = new MemoryStore();

    const result = fixedWindow(createConfig(store));

    assert.equal(result.allowed, true);
    assert.equal(result.totalHits, 1);
    assert.equal(result.remaining, 4);

});

test("Should increment request count", (assert) => {

    const store = new MemoryStore();

    fixedWindow(createConfig(store));

    const result = fixedWindow(createConfig(store));

    assert.equal(result.totalHits, 2);
    assert.equal(result.remaining, 3);

});

test("Should allow exactly up to the limit", (assert) => {

    const store = new MemoryStore();

    let result;

    for (let i = 0; i < 5; i++) {
        result = fixedWindow(createConfig(store));
    }

    assert.equal(result.allowed, true);
    assert.equal(result.totalHits, 5);
    assert.equal(result.remaining, 0);

});

test("Should block request after limit", (assert) => {

    const store = new MemoryStore();

    for (let i = 0; i < 5; i++) {
        fixedWindow(createConfig(store));
    }

    const result = fixedWindow(createConfig(store));

    assert.equal(result.allowed, false);
    assert.equal(result.totalHits, 6);
    assert.equal(result.remaining, 0);

});

test("Remaining should never be negative", (assert) => {

    const store = new MemoryStore();

    let result;

    for (let i = 0; i < 20; i++) {
        result = fixedWindow(createConfig(store));
    }

    assert.equal(result.remaining, 0);

});

test("Should keep different users independent", (assert) => {

    const store = new MemoryStore();

    fixedWindow(createConfig(store, "user1"));
    fixedWindow(createConfig(store, "user1"));

    const user2 = fixedWindow(createConfig(store, "user2"));

    assert.equal(user2.totalHits, 1);
    assert.equal(user2.remaining, 4);

});

test("Should reset after window expires", async (assert) => {

    const store = new MemoryStore();

    const config = {
        store,
        key: "user1",
        limit: 5,
        windowMs: 100
    };

    for (let i = 0; i < 5; i++) {
        fixedWindow(config);
    }

    await new Promise(resolve => setTimeout(resolve, 150));

    const result = fixedWindow(config);

    assert.equal(result.allowed, true);
    assert.equal(result.totalHits, 1);
    assert.equal(result.remaining, 4);

});

test("Should support limit of one", (assert) => {

    const store = new MemoryStore();

    const config = {
        store,
        key: "user1",
        limit: 1,
        windowMs: 60000
    };

    const first = fixedWindow(config);
    const second = fixedWindow(config);

    assert.equal(first.allowed, true);
    assert.equal(second.allowed, false);

});

test("Should support very large limits", (assert) => {

    const store = new MemoryStore();

    const config = {
        store,
        key: "user1",
        limit: 100000,
        windowMs: 60000
    };

    const result = fixedWindow(config);

    assert.equal(result.allowed, true);
    assert.equal(result.remaining, 99999);

});