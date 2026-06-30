import MemoryStore from "../src/store/memoryStore.js";

const store = new MemoryStore();

store.set("127.0.0.1", {
    count: 1,
    resetAt: Date.now() + 60000
});

console.log(store.get("127.0.0.1"));