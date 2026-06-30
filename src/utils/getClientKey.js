import GuardXError from "../errors/GuardXError.js";

function getClientKey(req) {

    const forwardedFor = req?.headers?.["x-forwarded-for"];

    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    if (req?.ip) {
        return req.ip;
    }

    throw new GuardXError(
        "Unable to determine client key."
    );
}

export default getClientKey;