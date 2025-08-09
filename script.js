const quotes = {
  easy: [
    "Typing is fun and easy to learn.\nPractice daily to improve your speed.",
    "Short sentences help build skill.\nKeep your hands on the keyboard.",
    "Try to focus and avoid mistakes.\nThis is a simple typing test.",
    "Work hard and type fast.\nEasy level is good for beginners.",
    "Two lines make it easier to type.\nBuild confidence with small steps.",
    "Simple quotes are great to start.\nEnjoy typing without pressure.",
    "Stay calm and type slowly.\nSpeed will come with practice.",
    "Always type what you see.\nDon’t guess or skip words."
  ],
  medium: [
    "Typing quickly can increase your efficiency.\nKeep practicing every day to get better.",
    "Improve your focus while typing.\nIt will help you reduce mistakes.",
    "Use proper hand placement.\nIt improves both speed and accuracy.",
    "Stay calm and relaxed.\nTension leads to typing errors.",
    "Keep your eyes on the screen.\nNot on the keyboard while typing.",
    "Avoid unnecessary backspace.\nIt slows you down.",
    "Typing with rhythm improves flow.\nUse short breaks wisely.",
    "Typing skill is built slowly.\nBe patient and consistent."
  ],
  hard: [
    "Typing is not just about hitting keys on the keyboard. It's a cognitive skill that develops with practice. To type efficiently, one must learn proper finger placement and build muscle memory. Over time, speed and accuracy naturally improve.",
    "In a fast-paced digital world, being able to type quickly and accurately can save time and boost productivity. Regular practice and dedication are key to mastering the art of typing. Tools like this test help track your progress.",
    "Most people think typing fast is only about speed. However, accuracy is even more important. Typing without looking at the keyboard is a skill known as touch typing. It's the gold standard for professionals.",
    "The ability to type effortlessly improves communication, especially in careers like programming, writing, and data entry. It's a foundational digital skill that should be practiced regularly to stay sharp.",
    "Good posture and wrist alignment are also important when typing. Slouching or typing incorrectly can cause discomfort or long-term injury. Take breaks and stretch your fingers.",
    "Typing helps build focus and discipline. You learn to concentrate on a task while ignoring distractions. This makes you more productive in other areas as well.",
    "Learning typing in school can help students write essays faster, complete assignments on time, and take digital exams efficiently.",
    "Modern typing software includes features like WPM tracking, error analysis, and performance charts. These tools guide learners toward faster, more accurate typing."
  ]
};


const quoteDisplay = document.getElementById("quote");
const inputBox = document.getElementById("input");
const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const modeSelect = document.getElementById("modeSelect");
const difficultySelect = document.getElementById("difficultySelect");
const countdown = document.getElementById("countdown");

const welcomeModal = document.getElementById("welcomeModal");
const summaryModal = document.getElementById("summaryModal");
const leaderboardList = document.getElementById("leaderboardList");

const keypressSound = document.getElementById("keypressSound");
const finishSound = document.getElementById("finishSound");

let currentQuote = "";
let startTime;
let timerInterval;
let isTestRunning = false;
let typedChars = 0;

function getRandomQuote() {
  const difficulty = difficultySelect.value;
  const quoteArr = quotes[difficulty];
  return quoteArr[Math.floor(Math.random() * quoteArr.length)];
}

function displayQuote(quote) {
  quoteDisplay.innerHTML = "";
  quote.split("").forEach(char => {
    const span = document.createElement("span");
    span.innerText = char;
    quoteDisplay.appendChild(span);
  });
}


function startTest() {
  currentQuote = getRandomQuote();
  displayQuote(currentQuote);
  inputBox.value = "";
  typedChars = 0;

  let countdownValue = 3;
  countdown.textContent = countdownValue;

  const countdownInterval = setInterval(() => {
    countdownValue--;
    if (countdownValue > 0) {
      countdown.textContent = countdownValue;
    } else if (countdownValue === 0) {
      countdown.textContent = "Go!";
    } else {
      clearInterval(countdownInterval);
      countdown.textContent = "";
      startTime = new Date();
      const mode = modeSelect.value;
      if (mode !== "free") {
        const totalTime = parseInt(mode);
        timerInterval = setInterval(() => updateTime(totalTime), 1000);
      }
    }
  }, 1000);
}

function updateTime(limit) {
  const elapsed = Math.floor((new Date() - startTime) / 1000);
  timeDisplay.textContent = elapsed;
  const remaining = limit - elapsed;
  if (remaining <= 0) {
    finishTest();
  }
}

function finishTest() {
  clearInterval(timerInterval);
  isTestRunning = false;
  const totalTime = Math.floor((new Date() - startTime) / 1000);
  const correctChars = quoteDisplay.querySelectorAll(".highlight-green").length;
  const totalChars = currentQuote.length;
  const accuracy = Math.round((correctChars / totalChars) * 100);
  const wpm = Math.round((correctChars / 5) / (totalTime / 60));

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy;
  timeDisplay.textContent = totalTime;

  document.getElementById("sumWpm").textContent = wpm;
  document.getElementById("sumAccuracy").textContent = accuracy;
  document.getElementById("sumTime").textContent = totalTime;

  saveToLeaderboard(wpm);
  finishSound.play();
  summaryModal.classList.add("show");
}

function restartTest() {
  location.reload();
}

function showLeaderboard() {
  document.getElementById("leaderboard").style.display = "block";
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  leaderboardList.innerHTML = leaderboard
    .sort((a, b) => b.wpm - a.wpm)
    .slice(0, 5)
    .map(score => `<li>WPM: ${score.wpm}, Accuracy: ${score.accuracy}%</li>`)
    .join("");
  summaryModal.classList.add("show");
}

function saveToLeaderboard(wpm) {
  const correct = quoteDisplay.querySelectorAll(".highlight-green").length;
  const total = currentQuote.length;
  const accuracy = Math.round((correct / total) * 100);
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  leaderboard.push({ wpm, accuracy });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

inputBox.addEventListener("input", () => {
  if (!isTestRunning) {
    isTestRunning = true;
    startTest();
  }

  const input = inputBox.value.split("");
  const quoteSpans = quoteDisplay.querySelectorAll("span");
  typedChars++;

  quoteSpans.forEach((span, index) => {
    if (!input[index]) {
      span.classList.remove("highlight-green", "highlight-red");
    } else if (input[index] === span.innerText) {
      span.classList.add("highlight-green");
      span.classList.remove("highlight-red");
    } else {
      span.classList.add("highlight-red");
      span.classList.remove("highlight-green");
    }
  });

  keypressSound.play();

  const mode = modeSelect.value;
  if (mode === "free" && inputBox.value === currentQuote) {
    finishTest();
  }
});

function closeWelcome() {
  welcomeModal.classList.remove("show");
  inputBox.disabled = false;
  inputBox.focus();
}

function closeModal() {
  summaryModal.classList.remove("show");
}


function preloadQuote() {
  currentQuote = getRandomQuote();
  displayQuote(currentQuote);
}

// Preload a quote on page load
window.onload = preloadQuote;
