import {writable} from "svelte/store";
import availableWords from "../_availablewords.json";

let storedWords = Object.keys(availableWords).reduce((p, key) => [...p, ...availableWords[key]], []);

try {
    let storedVal = localStorage["savedWords"] || "";
    storedWords = JSON.parse(storedVal);
} catch (ex) {
    // pass
}

export const selectedWords = writable(storedWords);

selectedWords.subscribe(val => {
    localStorage["savedWords"] = JSON.stringify(val);
});

export const background = writable(localStorage["background"] || "#7a7979");

background.subscribe(val => {
    localStorage["background"] = val;
});
