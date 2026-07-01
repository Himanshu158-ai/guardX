export async function fixedWindow({
    store,
    key,
    limit,
    windowMs
}) {
    const now = Date.now();

    const data = await store.get(key);

    // First Request
    if (!data) {
        return await initializeWindow(store, key, now, windowMs, limit);
    }

    // Window Expired
    if (now > data.resetAt) {
        return await initializeWindow(store, key, now, windowMs, limit);
    }

    // Increase Count
    data.count++;
    
    await store.set(key, data, data.resetAt - now);

    return {
        allowed: data.count <= limit,
        totalHits: data.count,
        remaining: Math.max(limit - data.count, 0),
        resetAt: data.resetAt
    };
}

async function initializeWindow(store, key, now, windowMs, limit) {

    const resetAt = now + windowMs;

    await store.set(
        key,
        {
            count: 1,
            resetAt
        },
        windowMs
    );

    return {
        allowed: true,
        totalHits: 1,
        remaining: limit - 1,
        resetAt
    };
}