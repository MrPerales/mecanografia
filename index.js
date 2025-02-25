const $ = (element) => document.querySelector(element);

const $time = $("time");
const $paragraph = $("p");
const $input = $("input");

const INITIAL_TIME = 10;
const TEXT =
  "estas palabras abarcan una buena variedad de letras combinaciones y elementos gramaticales sin repetirse Espero que te sean útiles para practicar mecanografía";

let words = [];
let currentTime = INITIAL_TIME;

initGame();
initEvents();

function initGame() {
  words = TEXT.split(" ").slice(0, 20);
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
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
}
function onKeyDown() {}
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
}
function gameOver() {
  console.log("GameOver");
}
