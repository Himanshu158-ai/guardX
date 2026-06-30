class GuardXError extends Error {
    constructor(message) {
        super(message);
        this.name = "GuardXError";
    }
}

export default GuardXError;