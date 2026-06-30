import { test } from "../testRunner.js";
import getClientKey from "../../src/utils/getClientKey.js";

test("Should return req.ip when x-forwarded-for is absent", (assert) => {

    const req = {
        ip: "127.0.0.1",
        headers: {}
    };

    assert.equal(
        getClientKey(req),
        "127.0.0.1"
    );

});

test("Should use x-forwarded-for header", (assert) => {

    const req = {
        ip: "127.0.0.1",
        headers: {
            "x-forwarded-for": "10.10.10.10"
        }
    };

    assert.equal(
        getClientKey(req),
        "10.10.10.10"
    );

});

test("Should return first IP from multiple forwarded IPs", (assert) => {

    const req = {
        headers: {
            "x-forwarded-for":
                "10.10.10.10, 20.20.20.20, 30.30.30.30"
        }
    };

    assert.equal(
        getClientKey(req),
        "10.10.10.10"
    );

});

test("Should throw when client key cannot be determined", (assert) => {

    assert.throws(
        () => getClientKey({}),
        {
            message: "Unable to determine client key."
        }
    );

});

test("Should trim whitespace from forwarded IP", (assert) => {

    const req = {
        headers: {
            "x-forwarded-for":
                "   10.10.10.10   ,20.20.20.20"
        }
    };

    assert.equal(
        getClientKey(req),
        "10.10.10.10"
    );

});