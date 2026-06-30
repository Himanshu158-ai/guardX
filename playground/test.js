// import MemoryStore from "../src/store/memoryStore.js";
// import { fixedWindow } from "../src/algorithms/fixedWindow.js";

// const store = new MemoryStore();

// const config = {
//     store,
//     key: "127.0.0.1",
//     limit: 5,
//     windowMs: 3000
// };

// for (let i = 1; i <= 5; i++) {
//     console.log(fixedWindow(config));
// }


// console.log("\nWaiting 4 seconds...\n");

// await sleep(4000);


// console.log(fixedWindow(config));


// async function sleep(ms) {
//     await new Promise(resolve => setTimeout(resolve, ms));
// }


import GuardXError from "../src/errors/GuardXError.js";

try{
    throw new GuardXError("Limit must be greater than 0");
}catch(error){
    console.log(error);
}