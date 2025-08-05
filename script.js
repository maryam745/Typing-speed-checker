const quotes = {
  easy: [
    "Hello world.",
    "Typing is fun.",
    "Cats are cute.",
    "Practice makes perfect.",
    "Stay positive and happy.",
    "Be the best version of yourself."
  ],
  medium: [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast helps improve your productivity.",
    "Coding is both fun and challenging.",
    "Success doesn't come from what you do occasionally, it comes from what you do consistently.",
    "Learning never exhausts the mind, but fuels creativity and growth.",
    "Discipline is the bridge between goals and accomplishment."
  ],
  hard: [
    "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    "In the middle of every difficulty lies opportunity, waiting for those who are prepared to seize it.",
    "Your time is limited, so don't waste it living someone else's life. Have the courage to follow your heart and intuition.",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
  ]
};


let currentQuote = "";
let timer, startTime;
let isStarted = false;
let timeLeft = 0;

const quoteEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const difficultyEl = document.getElementById("difficulty");
const modeEl = document.getElementById("mode");

function loadQuote() {
  const diff = difficultyEl.value;
  currentQuote = quotes[diff][Math.floor(Math.random() * quotes[diff].length)];
  quoteEl.innerText = currentQuote;
  inputEl.value = "";
  inputEl.disabled = false;
  resetStats();
  clearInterval(timer);
  isStarted = false;
  if (modeEl.value !== "free") {
    timeLeft = parseInt(modeEl.value);
    timeEl.textContent = timeLeft;
  }
}

function resetStats() {
  timeEl.textContent = "0";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "0";
}

inputEl.addEventListener("input", () => {
  if (!isStarted) {
    startTime = new Date();
    isStarted = true;
    timer = modeEl.value === "free" ? setInterval(updateTime, 1000) : setInterval(countdown, 1000);
  }

  const typedText = inputEl.value;
  const correct = getCorrectChars(currentQuote, typedText);
  const accuracy = Math.round((correct / typedText.length) * 100) || 0;
  accuracyEl.textContent = accuracy;

  const words = typedText.trim().split(/\s+/).filter(Boolean).length;
  const seconds = Math.max(1, modeEl.value === "free" ? Math.floor((new Date() - startTime) / 1000) : parseInt(modeEl.value) - timeLeft);
  const wpm = Math.round((words / seconds) * 60) || 0;
  wpmEl.textContent = wpm;

  if (modeEl.value === "free" && typedText === currentQuote) {
    clearInterval(timer);
    showSummary(wpm, accuracy, seconds);
    saveScore(wpm);
    inputEl.disabled = true;
  }
});

function updateTime() {
  const seconds = Math.floor((new Date() - startTime) / 1000);
  timeEl.textContent = seconds;
}

function countdown() {
  if (timeLeft > 0) {
    timeLeft--;
    timeEl.textContent = timeLeft;
  } else {
    clearInterval(timer);
    const typedText = inputEl.value;
    const correct = getCorrectChars(currentQuote, typedText);
    const accuracy = Math.round((correct / typedText.length) * 100) || 0;
    const words = typedText.trim().split(/\s+/).filter(Boolean).length;
    const seconds = parseInt(modeEl.value);
    const wpm = Math.round((words / seconds) * 60) || 0;
    showSummary(wpm, accuracy, seconds);
    saveScore(wpm);
    inputEl.disabled = true;
  }
}

function getCorrectChars(actual, typed) {
  let count = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === actual[i]) count++;
  }
  return count;
}

function restartTest() {
  loadQuote();
}

function showSummary(wpm, accuracy, seconds) {
  document.getElementById("summaryTitle").innerText = "Test Summary";
  document.getElementById("summaryContent").style.display = "block";
  document.getElementById("leaderboard").style.display = "none";
  document.getElementById("sumWpm").textContent = wpm;
  document.getElementById("sumAccuracy").textContent = accuracy;
  document.getElementById("sumTime").textContent = seconds;
  document.getElementById("summaryModal").classList.add("show");
}

function closeModal() {
  document.getElementById("summaryModal").classList.remove("show");
}

function saveScore(score) {
  let scores = JSON.parse(localStorage.getItem("typingScores")) || [];
  scores.push(score);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5);
  localStorage.setItem("typingScores", JSON.stringify(scores));
}

function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("typingScores")) || [];
  const list = document.getElementById("leaderboardList");
  list.innerHTML = scores.map(score => `<li>${score} WPM</li>`).join('');
  document.getElementById("summaryTitle").innerText = "🏆 Top 5 Scores";
  document.getElementById("summaryContent").style.display = "none";
  document.getElementById("leaderboard").style.display = "block";
  document.getElementById("summaryModal").classList.add("show");
}

document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark");
};

difficultyEl.onchange = modeEl.onchange = loadQuote;
window.onload = loadQuote;
