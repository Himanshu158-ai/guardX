import assert from "node:assert/strict";

const tests = [];

export function test(name, callback) {
    tests.push({ name, callback });
}

export async function run() {

    let passed = 0;
    let failed = 0;

    console.log("\n🚀 Running Tests...\n");

    for (const { name, callback } of tests) {

        try {

            await callback(assert);

            console.log(`✅ ${name}`);

            passed++;

        } catch (error) {

            console.log(`❌ ${name}`);

            console.error(error.message);

            failed++;

        }

    }

    console.log("\n----------------------");

    console.log(`Passed : ${passed}`);

    console.log(`Failed : ${failed}`);

    console.log(`Total  : ${passed + failed}`);

}