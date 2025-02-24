const $ = (element) => document.querySelector(element);

const $time = $("time");
const $paragraph = $("p");
const $input = $("input");

const INITIAL_TIME = 10;
const TEXT =
  "Estas palabras abarcan una buena variedad de letras combinaciones y elementos gramaticales sin repetirse Espero que te sean útiles para practicar mecanografía";

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
        ${letters.map((letter) => `<x-latter>${letter}</x-latter>`).join("")}
        </x-word>`;
    })
    .join("");

  const interval = setInterval(() => {
    currentTime--;
    $time.textContent = currentTime;
    if (currentTime === 0) {
      clearInterval(interval); //para el contador
      gameOver();
    }
  }, 1000);
}
function initEvents() {}
function gameOver() {
  console.log("GameOver");
}
