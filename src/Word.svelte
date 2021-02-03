<section class="word {wordSuccess ? 'word--solved' : ''}">
  {#each wordLetters as letter, idx (word+idx+letter)}
    <div class="letter
            {letter.state === 'correct' ? 'letter--correct' : (idx === charIndex ? 'letter--active' : (letter.state === 'incorrect' ? 'letter--incorrect' : 'letter--unguessed'))}
            {upperCase ? 'letter--uppercase' : ''}
            " style="--random-spin: {Math.floor(Math.random() * 40) - 20};">
      <span>{letter.letter}</span>
    </div>
  {/each}
</section>

<svelte:window on:keydown={handleKeyPress}/>

<script>
import {createEventDispatcher} from "svelte";

const dispatch = createEventDispatcher();

export let word = "no config!";
let wordSuccess = false;
let charIndex = 0;
let upperCase = true;

$: wordLetters = word.split("").map(letter => ({letter, state: 'unguessed'}));
$: currentLetter = wordLetters[charIndex];

async function handleKeyPress(evt) {
    if (!currentLetter) {
        return;
    }
    if (evt.key.toLowerCase() === currentLetter.letter.toLowerCase()) {
        currentLetter.state = "correct";
        charIndex++;
    }

    if (charIndex >= wordLetters.length) {
        wordSuccess = true;
        dispatch("complete", {});

        setTimeout(() => {
            charIndex = 0;
            wordSuccess = false;
        }, 1500);
    }
}

</script>

<style>
.letter {
  font-family: "Bree Serif", serif;
  animation: appear 250ms ease-out;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-weight: 700;
  font-size: 32px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  border-top-color: rgba(255, 255, 255, 0.25);
  border-left-color: rgba(255, 255, 255, 0.25);
  border-width: 2px;
  border-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.25);
  border-right-color: rgba(0, 0, 0, 0.25);
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25), 1px 1px 1px rgba(255, 255, 255, 0.25);
  transition: background-color 0.1s;
}

@keyframes success {
  0% {
    opacity: 1;
    transform: scale(1.0);
  }
  100% {
    transform: scale(3.0);
    opacity: 0;
  }
}

@keyframes spin-out {
  0% {
    transform: rotateZ(0deg) rotateX(0deg) translate(0, 0);
  }
  100% {
    transform: rotateZ(calc(var(--random-spin, 100) * 15deg + 10deg)) rotateX(calc(var(--random-spin, 100) * 20deg - 10deg)) translate(calc(var(--random-spin, 100) * 1px), calc(var(--random-spin, 100) * 1px));
  }
}

.word--solved {
  transform-origin: 50% 50%;
  animation: success 1500ms ease-out;
}

.word--solved > .letter {
  animation: spin-out 1500ms ease-out;
}

.letter--correct {
  background: #5eca3c;
  animation: letter-success ease-out 0.5s;
}

.letter--incorrect {
  background: #bf2929;
}

.letter--uppercase {
  text-transform: uppercase;
}

.letter:first-of-type {
  margin-left: 0;
}

.letter > span {
  display: block;
}

.letter--active {
  background: #32679f;
}

@keyframes letter-success {
  0% {
    transform: scale(1.0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1.0);
  }
}

</style>