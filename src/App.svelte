<script>
import Config from "./Config.svelte";
import Word from "./Word.svelte";
import {selectedWords} from "./stores";
import wordOverrides from "./_wordoverrides.json";
import {background} from "./stores";
import {pickRandomIndex} from "./utils";

let words;
let complete = false;
let wordIndex = 0;
let starIndex = 0;

let hideContent = false;
let showConfig = $selectedWords.length === 0;
let animating = false;

function getRandomHues() {
    const start = Math.floor(Math.random() * 360);
    let end = start + 100;
    if (end > 360) {
        end -= 360;
    }

    return `--rotate-hue: ${start}; --rotate-hue-to: ${end};`;
}

function icon(word) {
    return wordOverrides[word] || `fas fa-${word}`;
}

function shuffleWordList(list) {
    wordIndex = 0;
    starIndex = 0;

    const source = [...list];
    const ret = [];
    while (source.length > 0) {
        const next = pickRandomIndex(source);
        const [popped] = source.splice(next, 1);
        ret.push(popped);
    }

    return ret;
}

function handleWordCompletion() {
    animating = true;
    starIndex += 1;

    setTimeout(() => {
        animating = false;

        if (wordIndex < words.length - 1) {
            wordIndex += 1;
        } else {
            hideContent = true;
            setTimeout(() => {
                complete = true;
                hideContent = false;
            }, 500);
        }
    }, 1500);
}

function restartGame() {
    words = shuffleWordList($selectedWords);
    complete = false;
}

let stars = [20, 40, 60, 80, 100];

$: words = shuffleWordList($selectedWords);
$: currentWord = words[wordIndex];
$: iconStyle = getRandomHues(currentWord);
</script>


<main class="h-screen w-screen overflow-hidden flex flex-col items-center justify-center m-0 p-0 transition duration-1000 ease-out" style="background-color: {complete ? 'rgb(29, 111, 65)' : $background};">
  {#if showConfig}
    <Config on:close={() => showConfig = false}/>
  {:else if complete}
    <div class="success-text-small text-4xl uppercase text-white font-sans font-bold tracking-wide">Finished!</div>
    <div class="success-emoji mt-2 uppercase text-yellow-500"><i class="fas fa-smile"/></div>
    <div class="mt-4 success-text text-green-500 font-sans font-bold tracking-tight">Well done!</div>
    <button on:click={restartGame} class="font-sans flex items-center bg-gradient-to-br from-blue-400 to-green-500 gap-4 mt-16 bg-green-600 text-xl font-bold uppercase tracking-tight rounded-xl px-12 border-1 border-gray-800 shadow-xl py-4 text-green-100 cursor-pointer">
      <i class="fas fa-redo text-green-100"/> Again!
    </button>
  {:else}
    <div class="absolute top-0 right-0 p-8 flex flex-row gap-x-4">
      <div class="text-gray-200 text-lg">{wordIndex + 1} / {words.length}</div>
      <button class="bg-transparent border-none text-gray-100 cursor-pointer" on:click|preventDefault={() => showConfig = true}>
        <i class="fas fa-cog"/></button>
    </div>
    <div class="flex flex-col items-center justify-center" style="visibility: {hideContent ? 'hidden' : 'visible'}">
      <Word word={currentWord} on:complete={handleWordCompletion}/>
      <section class="icon {animating ? 'icon--animating' : ''}" style="{iconStyle}">
        <i class={icon(currentWord)}/>
      </section>
    </div>
    <section class="text-2xl {(starIndex / words.length * 100) >= 100 ? 'stars-leaving' : ''}">
      {#each stars as star}
        <i class="fas fa-star {(starIndex / words.length * 100) >= star ? 'text-yellow-500 star-burst' : 'text-gray-500'}"/>
      {/each}
    </section>
  {/if}
</main>

<style global lang="postcss">

/* only apply purgecss on utilities, per Tailwind docs */
/* purgecss start ignore */
@tailwind base;
@tailwind components;
/* purgecss end ignore */

@tailwind utilities;

main {
  text-rendering: optimizeLegibility;
  --webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5));
}

.icon {
  animation: appear 250ms ease-out;
  font-size: 40vh;
  background: -webkit-linear-gradient(45deg, hsla(var(--rotate-hue, 280), 100%, 70%, 0.8), hsla(var(--rotate-hue-to, 180), 100%, 70%, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 3px 5px 5px rgba(0, 0, 0, 0.25);
}

.button--open-config {
  position: absolute;
  top: 8px;
  right: 8px;
}

@keyframes icon-leave {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.icon--animating.icon--animating {
  animation: icon-leave 1500ms ease-out;
}

.word {
  display: flex;
  flex-direction: row;
}

@keyframes spin-gradient {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 500% 0;
  }
}

.success-emoji {
  font-size: 10vh;
  background: -webkit-linear-gradient(45deg, hsla(40, 100%, 50%, 1), hsla(70, 100%, 70%, 0.9));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 3px 5px 5px rgba(0, 0, 0, 0.25);
}

.success-text-small {
  font-family: "Architects Daughter", cursive;
}

.success-text {
  font-family: "Permanent Marker", cursive;
  font-size: 15vh;
  animation: spin-gradient 15s ease-out infinite alternate-reverse;
  background: -webkit-linear-gradient(0deg, hsla(43, 75%, 67%, 0.8), hsla(180, 80%, 80%, 0.8), hsla(230, 82%, 66%, 0.8), hsla(289, 72%, 60%, 0.8), hsla(43, 75%, 67%, 0.8));
  background-size: 500%;
  background-position: 0 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}

@keyframes jump-in {
  0% {
    transform: scale(1);
  }

  55% {
    transform: scale(2.5) rotate(10deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
  }
}

.star-burst {
  animation: jump-in 500ms ease-in-out;
}

@keyframes stars-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.stars-leaving {
  animation: stars-out 2500ms ease-out;
}

</style>
