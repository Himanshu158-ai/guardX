class RedisStore {
    constructor(client, prefix = "guardx:") {
        this.client = client;
        this.prefix = prefix;
    }

    key(key) {
        return `${this.prefix}${key}`;
    }

    async get(key) {
        const data = await this.client.get(this.key(key));
        return data ? JSON.parse(data) : null;
    }

    async set(key, value) {
        const ttl = Math.max(
            Math.ceil((value.resetAt - Date.now()) / 1000),
            1
        );

        await this.client.set(
            this.key(key),
            JSON.stringify(value),
            { EX: ttl }
        );
    }

    async delete(key) {
        await this.client.del(this.key(key));
    }

    async clear() {
        throw new Error("RedisStore.clear() is not supported.");
    }
}

export default RedisStore;