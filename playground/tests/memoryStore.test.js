import { test } from "../testRunner.js";
import MemoryStore from "../../src/store/memoryStore.js";

test("Should store data", (assert) => {

    const store = new MemoryStore();

    store.set("user1", {
        count: 1,
        resetAt: 1000
    });

    assert.deepEqual(
        store.get("user1"),
        {
            count: 1,
            resetAt: 1000
        }
    );

});

test("Should return undefined for unknown key", (assert) => {

    const store = new MemoryStore();

    assert.equal(
        store.get("unknown"),
        undefined
    );

});

test("Should check key existence", (assert) => {

    const store = new MemoryStore();

    store.set("user1", { count: 1 });

    assert.equal(
        store.has("user1"),
        true
    );

    assert.equal(
        store.has("user2"),
        false
    );

});

test("Should delete data", (assert) => {

    const store = new MemoryStore();

    store.set("user1", { count: 1 });

    store.delete("user1");

    assert.equal(
        store.has("user1"),
        false
    );

});

test("Should clear all data", (assert) => {

    const store = new MemoryStore();

    store.set("user1", { count: 1 });
    store.set("user2", { count: 2 });

    store.clear();

    assert.equal(
        store.has("user1"),
        false
    );

    assert.equal(
        store.has("user2"),
        false
    );

});

test("Should overwrite existing key", (assert) => {

    const store = new MemoryStore();

    store.set("user1", {
        count: 1
    });

    store.set("user1", {
        count: 5
    });

    assert.deepEqual(
        store.get("user1"),
        {
            count: 5
        }
    );

});