import { EnglishEasyWords } from "./data.js";
const $ = (element) => document.querySelector(element);

const $time = $("time");
const $paragraph = $("p");
const $input = $("input");
const $game = $("#game");
const $wpm = $("#wpm-result");
const $results = $("#results");
const $accuracy = $("#accuracy-result");
const $reloadBtn = $("#reload-btn");

const INITIAL_TIME = 60;
let INITIAL_WORDS = EnglishEasyWords;
let words = [];
let currentTime = INITIAL_TIME;

initGame();
initEvents();

function initGame() {
  $game.style.display = "flex";
  $results.style.display = "none";
  $input.value = "";
  // palabras en posiciones randoms
  words = INITIAL_WORDS.toSorted(() => Math.random() - 0.5).slice(0, 40);
  currentTime = INITIAL_TIME;
  $time.textContent = currentTime;
  //dividimos las palabras y las letras en diferentes etiquetas
  //etiquetas sin semantica
  $paragraph.innerHTML = words
    .map((word, index) => {
      // separamos la letra => hola => h o l a
      const letters = word.split("");
      return `<x-word>
        ${letters.map((letter) => `<x-letter>${letter}</x-letter>`).join("")}
        </x-word>`;
    })
    .join("");
  //seleccionamos la primera palabra y letra para pintar el cursor "|"
  const $firstWord = $paragraph.querySelector("x-word");
  $firstWord.classList.add("active");
  $firstWord.querySelector("x-letter").classList.add("active");

  const interval = setInterval(() => {
    currentTime--;
    $time.textContent = currentTime;
    if (currentTime === 0) {
      clearInterval(interval); //para el contador
      gameOver();
    }
  }, 1000);
}
function initEvents() {
  document.addEventListener("click", () => {
    $input.focus();
  });
  $input.addEventListener("keydown", onKeyDown);
  $input.addEventListener("keyup", onKeyUp);
  $reloadBtn.addEventListener("click", initGame);
}
function onKeyDown(event) {
  // recuperamos elementos actuales
  const $currentWord = $paragraph.querySelector("x-word.active");
  const $currentLetter = $currentWord.querySelector("x-letter.active");
  const { key } = event;
  // controlamos el space
  if (key === " ") {
    event.preventDefault();
    //pasamos a la sig palabra con ayuda de "nextElementSibling"
    const $nextWord = $currentWord.nextElementSibling;
    const $nexLetter = $nextWord.querySelector("x-letter");

    // quitamos styles de la palabra anterior
    $currentWord.classList.remove("active", "marked");
    $currentLetter.classList.remove("active");

    // agregamos estilos a la palabra sig
    $nextWord.classList.add("active");
    $nexLetter.classList.add("active");
    // reseteo del input
    $input.value = "";

    // marcamos la palabra si no fue completada
    const hasMissedLetters =
      $currentWord.querySelectorAll("x-letter:not(.correct)").length > 0;

    const classMissed = hasMissedLetters ? "marked" : "correct";

    $currentWord.classList.add(classMissed);
  }
  // retroceso si la palabra esta mal

  if (key === "Backspace") {
    const $previousWord = $currentWord.previousElementSibling;
    const $previousLetter = $currentLetter.previousElementSibling;

    if (!$previousWord && !$previousLetter) {
      event.preventDefault();
      return;
    }
    const $wordMarked = $paragraph.querySelector("x-word.marked");
    if ($wordMarked && !$previousLetter) {
      event.preventDefault();
      $previousWord.classList.remove("marked");
      $previousWord.classList.add("active");

      const $letterToGo = $previousWord.querySelector("x-letter:last-child");

      $currentLetter.classList.remove("active");
      $letterToGo.classList.add("active");
      // recuperamos las palabras que a puesto el usuario )
      // ya que al regresar con un backspace el input esta vacio
      $input.value = [
        ...$previousWord.querySelectorAll(
          "x-letter.correct, x-letter.incorect"
        ),
      ]
        .map(($letter) => {
          return $letter.classList.contains("correct")
            ? $letter.innerText
            : "*";
        })
        .join("");
    }
  }
}
function onKeyUp() {
  // recuperamos elementos actuales
  const $currentWord = $paragraph.querySelector("x-word.active");
  const $currentLetter = $currentWord.querySelector("x-letter.active");
  // recuperamos la primera palabra para poder comparar
  const currentWord = $currentWord.innerText.trim();
  $input.maxLength = currentWord.length; //limitamos numero de letras

  // recuperamos todas las letras
  const $allLetters = $currentWord.querySelectorAll("x-letter");
  // limpiamos las clases , para poder repintar si retrocedemos una letra
  $allLetters.forEach(($letter) =>
    $letter.classList.remove("correct", "incorrect")
  );
  //convertimos el valor del input en array para que podamos compara letra por letra
  $input.value.split("").forEach((item, index) => {
    const $letter = $allLetters[index];
    const letterToCheck = currentWord[index];
    // agregamos clase si coincide
    if (item === letterToCheck) {
      $letter.classList.add("correct");
    } else {
      $letter.classList.add("incorrect");
    }
  });

  // moviendo cursor
  $currentLetter.classList.remove("active", "is-last");
  // vemos en que letra va para poder poner el cursor
  const inputLength = $input.value.length;
  const $nextActiveLetter = $allLetters[inputLength];
  if ($nextActiveLetter) {
    $nextActiveLetter.classList.add("active");
  } else {
    // movemos el cursor a la derecha "letra| ....| "
    $currentLetter.classList.add("active", "is-last");
  }
}
function gameOver() {
  console.log("GameOver");
  $game.style.display = "none";
  $results.style.display = "flex";

  const correctWords = $paragraph.querySelectorAll("x-word.correct").length;
  const correctLetters = $paragraph.querySelectorAll("x-letter.correct").length;
  const incorectLetters =
    $paragraph.querySelectorAll("x-letter.incorrect").length;
  const totalLetters = incorectLetters + correctLetters;

  const accuracy = totalLetters > 0 ? (correctLetters / totalLetters) * 100 : 0;
  const wpm = correctWords / INITIAL_TIME;
  $wpm.textContent = wpm;
  $accuracy.textContent = `${accuracy.toFixed(2)}%`;
}
