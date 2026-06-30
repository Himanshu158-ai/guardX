export function fixedWindow({
    store,
    key,
    limit,
    windowMs
}) {

    const now = Date.now();

    // User exists?
    const data = store.get(key);

    // First Request
    if (!data) {

        return initializeWindow(store, key, now, windowMs, limit);
    }

    // Window Expired
    if (now > data.resetAt) {

        return initializeWindow(store, key, now, windowMs, limit);
    }

    // Increase Count
    data.count++;

    store.set(key, data);

    return {
        allowed: data.count <= limit,
        totalHits: data.count,
        remaining: Math.max(limit - data.count, 0),
        resetAt: data.resetAt
    };
}


function initializeWindow(store, key, now, windowMs, limit) {

    const resetAt = now + windowMs;

    store.set(key, {
        count: 1,
        resetAt
    });

    return {
        allowed: true,
        totalHits: 1,
        remaining: limit - 1,
        resetAt
    };

}