/********************************************
 * slots.js
 * - 拉霸機: 使用 user.score
 ********************************************/

let coinPlayed = 1;
let winnerPaid = 0;
const maxCoinPlayed = 10;
const reelSymbols = ["7", "A", "K", "Q", "J", "♠", "♥", "♣", "♦"];

function updateStatus() {
  document.getElementById("credits").textContent = getCurrentScore();
  document.getElementById("coin-played").textContent = coinPlayed;
  document.getElementById("winner-paid").textContent = winnerPaid;
}

function spinReels() {
  const curScore = getCurrentScore();
  if (curScore < coinPlayed) {
    alert("點數不足！");
    return;
  }

  document.getElementById("spin").disabled = true;
  deductScore(coinPlayed);
  updateStatus();

  const reelElements = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3"),
  ];

  const finalSymbols = [];
  const isWin = Math.random() < 0.01; // 1% 中獎

  if (isWin) {
    const wSymbol = reelSymbols[Math.floor(Math.random() * reelSymbols.length)];
    finalSymbols.push(wSymbol, wSymbol, wSymbol);
  } else {
    // 隨機三個不同符號
    while (finalSymbols.length < 3) {
      const s = reelSymbols[Math.floor(Math.random() * reelSymbols.length)];
      if (!finalSymbols.includes(s)) {
        finalSymbols.push(s);
      }
    }
  }

  let spinCount = 0;
  const maxSpins = 40;
  let completedReels = 0;

  function animateReel(reel, finalSymbol, reelIndex) {
    let index = 0;
    const spinInterval = setInterval(() => {
      reel.textContent = reelSymbols[index];
      index = (index + 1) % reelSymbols.length;
      spinCount++;

      if (spinCount >= maxSpins - reelIndex * 5) {
        clearInterval(spinInterval);
        reel.textContent = finalSymbol;
        completedReels++;
        if (completedReels === reelElements.length) {
          checkWin(finalSymbols);
          document.getElementById("spin").disabled = false;
        }
      }
    }, 100 - spinCount * 2);
  }

  reelElements.forEach((reel, i) => {
    animateReel(reel, finalSymbols[i], i);
  });
}

function checkWin(finalSymbols) {
  const [s1, s2, s3] = finalSymbols;
  if (s1 === s2 && s2 === s3) {
    winnerPaid = coinPlayed * 5;
    addScore(winnerPaid);
  } else {
    winnerPaid = 0;
  }
  updateStatus();
}

function setupEventListeners() {
  document.getElementById("spin").addEventListener("click", spinReels);

  document.getElementById("bet-one").addEventListener("click", () => {
    if (coinPlayed < maxCoinPlayed && coinPlayed < getCurrentScore()) {
      coinPlayed++;
      updateStatus();
    }
  });

  document.getElementById("bet-minus").addEventListener("click", () => {
    if (coinPlayed > 1) {
      coinPlayed--;
      updateStatus();
    }
  });

  document.getElementById("bet-max").addEventListener("click", () => {
    coinPlayed = Math.min(getCurrentScore(), maxCoinPlayed);
    updateStatus();
  });

  document.getElementById("lobby").addEventListener("click", () => {
    window.location.href = "settings.html";
  });
}

window.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  initializeCurrentUserScoreBalls();
  updateStatus();
  setupEventListeners();
});
