<section class="config">
  <div class="config--header">
    <h1 class="text-2xl mt-3">Settings</h1>
    <button on:click|preventDefault={() => dispatch("close")} type="button" class="icon-button">
      <i class="fas fa-times"/></button>
  </div>
  <div class="overflow-y-auto h-full">
    <div class="flex flex-col w-full p-4">
      <h2 class="text-sm text-gray-100 uppercase font-bold whitespace-nowrap mb-2">Theme</h2>
      <div class="flex flex-row gap-4">
        {#each themeColours as col}
          <button on:click|preventDefault={() => setThemeColour(col)} type="button" class="w-16 h-16 rounded-lg border border-gray-700 cursor-pointer shadow-lg" style="background-color: {col};"></button>
        {/each}
      </div>
    </div>
    <div class="flex flex-row h-full">
      <div class="h-full w-1/2 px-4 py-0 text-gray-100">
        <h2 class="text-sm text-gray-100 uppercase font-bold whitespace-nowrap mb-2">Selected words</h2>
        {#each $selectedWords as selected}
          <button type="button"
                  on:click|preventDefault="{() => removeSelection(selected)}"
                  class="border-transparent bg-transparent text-white hover:text-red-500 flex justify-start items-center flex-row capitalize gap-x-2 focus:outline-none outline-none active:bg-transparent">
            <i class="{icon(selected)} w-8"/><span>{selected}</span>
          </button>
        {/each}
      </div>
      <div class="config--available-words">
        <h2 class="text-sm text-gray-100 uppercase font-bold whitespace-nowrap mb-2">Available words</h2>
        <div class="mb-2 flex flex-row gap-x-2">
          <button on:click|preventDefault={selectAll} class="text-xs font-semibold uppercase text-white px-2 py-1 bg-gradient-to-br from-blue-400 hover:from-blue-500 hover:to-green-600 to-green-500 rounded border-gray-600 flex items-center gap-x-2 border focus:outline-none"><i class="fas fa-plus"/> all words</button>
          <button on:click|preventDefault={() => selectPredicate((x) => x.length < 5)} class="text-xs font-semibold uppercase text-white px-2 py-1 bg-gradient-to-br from-blue-400 to-green-500 hover:from-blue-500 hover:to-green-600 rounded border-gray-600 flex items-center gap-x-2 border focus:outline-none"><i class="fas fa-plus"/> short words</button>
          <button on:click|preventDefault={() => selectPredicate((x) => x.length > 4)} class="text-xs font-semibold uppercase text-white px-2 py-1 bg-gradient-to-br from-blue-400 to-green-500 hover:from-blue-500 hover:to-green-600 rounded border-gray-600 flex items-center gap-x-2 border focus:outline-none"><i class="fas fa-plus"/> long words</button>
          <button on:click|preventDefault={clearSelection} class="text-xs font-semibold uppercase text-white px-2 py-1 bg-gradient-to-br from-red-400 to-yellow-500 hover:from-red-500 hover:to-yellow-600 rounded border-gray-600 flex items-center gap-x-2 border focus:outline-none"><i class="fas fa-times"/> clear all</button>
        </div>
        <div class="available-icons">
          {#each Object.keys(availableWords) as category}
            <h3 class="text-white opacity-75 font-bold mt-1 w-full mb-0 uppercase text-xs">{category}</h3>
            {#each availableWords[category] as available}
              <button type="button"
                      on:click|preventDefault="{() => toggleSelection(available)}"
                      class="focus:outline-none text-gray-100 hover:text-white rounded-lg flex flex-col gap-y-1 items-center justify-center p-2 cursor-pointer border-2 transition word-icon-button {$selectedWords.includes(available) ? 'border-green-400' : 'border-gray-600'}">
                <i class="{icon(available)}"/><span>{available}</span>
              </button>
            {/each}
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<script>
import availableWords from "./_availablewords.json";
import overrides from "./_wordoverrides.json";
import {selectedWords, background} from "./stores";
import {createEventDispatcher} from "svelte";

const dispatch = createEventDispatcher();

const themeColours = [
    "#B91C1C",
    "#B45309",
    "#047857",
    "#1D4ED8",
    "#6D28D9",
    "#BE185D"
];

function icon(word) {
    return overrides[word] || `fas fa-${word}`;
}

function removeSelection(word) {
    if ($selectedWords.indexOf(word) >= 0) {
        selectedWords.update(words => words.filter(existing => existing !== word));
    }
}

function clearSelection() {
    selectedWords.update(words => []);
}

function selectAll() {
    selectedWords.update(words => Object.keys(availableWords).reduce((p, key) => [...p, ...availableWords[key]], []))
}

function selectPredicate(pred) {
    selectedWords.update(words => [...words, Object.keys(availableWords).reduce((p, key) => [...p, ...availableWords[key].filter(pred)], [])])
}

function toggleSelection(word) {
    if ($selectedWords.indexOf(word) < 0) {
        selectedWords.update(words => [...words, word]);
    } else {
        selectedWords.update(words => words.filter(existing => existing !== word));
    }
}

function setThemeColour(col) {
    background.update(prev => col);
}
</script>

<style>
.config {
  margin: 0 32px;
  padding: 0 0 16px 0;
  background: rgba(0, 0, 0, 0) linear-gradient(45deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.125));
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
}

.config--header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;
  padding: 0 16px;
}

.config--body {
  display: flex;
  flex-direction: row;
  color: white;
  height: 100%;
  overflow: hidden;
}

.available-icons {
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  gap: 8px;
  align-content: flex-start;
}

.word-icon-button {
  width: 64px;
  height: 64px;
  background-image: linear-gradient(135deg, var(--theme-800), var(--teal-900));
}

.word-icon-button:hover {
  background-image: linear-gradient(45deg, var(--theme-500), var(--teal-600));
}

.word-icon-button > i {
  font-size: 32px;
}

.word-icon-button:hover > * {
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.word-icon-button > span {
  font-size: 10px;
  font-weight: bold;
  text-transform: capitalize;
}

.config--available-words {
  display: flex;
  flex-direction: column;
  padding: 0 0 8px 24px;
  flex-shrink: 1;
}

</style>