const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";
const quoteDisplayElement = document.querySelector("#quoteDisplay");
const quoteInputElement = document.querySelector("#quoteInput");
const timerElement = document.querySelector("#timer");
const wordsPerMinuteElement = document.querySelector("#wpm");
const progressBarContainer = document.querySelector(".progress-bar-container");
const progressBar = document.querySelector("#progressBar");
const divider = document.querySelector("hr");

let startTime;

quoteInputElement.addEventListener("input", handleInput);

async function getNextQuote() {
  const quote = await getRandomQuote();
  renderQuote(quote);
  resetInput();
  startTimer();
  resetProgressBar();
}

function handleInput() {
  const { correctCount, totalCharacters } = updateCharacterClasses();
  updateFeedback(correctCount, totalCharacters);
  updateProgressBar(correctCount, totalCharacters);

  if (correctCount === totalCharacters) {
    getNextQuote();
  }
}

function updateCharacterClasses() {
  const quoteArray = quoteDisplayElement.querySelectorAll("span");
  const valueArray = quoteInputElement.value.split("");
  let correctCount = 0;

  quoteArray.forEach((characterSpan, i) => {
    const character = valueArray[i];

    if (character == null) {
      characterSpan.classList.remove("right", "wrong");
    } else if (character === characterSpan.textContent) {
      characterSpan.classList.add("right");
      characterSpan.classList.remove("wrong");
      correctCount++;
    } else {
      characterSpan.classList.remove("right");
      characterSpan.classList.add("wrong");
    }
  });

  return { correctCount, totalCharacters: quoteArray.length };
}

function updateFeedback(correctCount, totalCharacters) {
  const feedbackElement = document.querySelector("#feedback");
  feedbackElement.innerHTML = `Correct: ${correctCount} | Total: ${totalCharacters}`;
}

function updateProgressBar(correctCount, totalCharacters) {
  const progressPercentage = (correctCount / totalCharacters) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content)
    .catch((error) => console.log(error));
}

function renderQuote(quote) {
  quoteDisplayElement.innerHTML = quote
    .split("")
    .map((character) => `<span>${character}</span>`)
    .join("");
}

function resetInput() {
  quoteInputElement.value = "";
}

function startTimer() {
  timerElement.textContent = 0;
  startTime = new Date();

  setInterval(() => {
    timer.textContent = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function resetProgressBar() {
  progressBar.style.width = "0";
}

getNextQuote();
