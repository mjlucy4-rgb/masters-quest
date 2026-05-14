// ===========================
// 미션 데이터
// ===========================
const MISSIONS = [
  {
    step: 1,
    title: "첫 번째 단서 찾기",
    location: "📍 안주리님 자리",
    type: "text",
    emoji: "📅",
    mission: "첫 번째 단서는 [안주리님 자리]에 숨어 있습니다.\n달력에서 5월 15일을 찾아보세요.\n\n그날에 적힌 키워드를 입력하면\n다음 보물 위치가 열립니다.",
    placeholder: "키워드를 입력해 주세요",
    answers: ["최고의리더", "최고의 리더", "최고의리더입니다", "최고의 리더입니다"],
    successTitle: "첫 번째 단서를 찾았습니다! 🎉",
    successMsg: "정민우님은 팀원들에게\n'최고의 리더'로 기록되어 있습니다.",
    nextMsg: "다음 단서는 에너지가 충전되는 곳에 숨어 있습니다.\n[탕비실 냉장고]로 이동해 주세요.",
    hint: "거의 다 왔습니다. 달력의 5월 15일 칸을 다시 한번 확인해 주세요."
  },
  {
    step: 2,
    title: "두 번째 단서 찾기",
    location: "📍 탕비실 냉장고",
    type: "number",
    emoji: "🥤",
    mission: "보물찾기에도 에너지 충전은 필요합니다.\n[탕비실 냉장고] 안에 준비된 콜라를 찾아보세요.\n\n콜라 바닥에 붙은 숫자가 두 번째 단서입니다.",
    placeholder: "숫자를 입력해 주세요",
    answers: ["5"],
    successTitle: "두 번째 단서를 찾았습니다! 🎉",
    successMsg: "첫 번째 숫자는 5입니다.\n오늘의 보물찾기가 시작된 5층을 의미합니다.",
    nextMsg: "다음 단서는 팀의 추억이 놓인 곳에 있습니다.\n[백송이님 자리]로 이동해 주세요.",
    hint: "콜라 바닥에 붙은 숫자를 다시 확인해 주세요."
  },
  {
    step: 3,
    title: "세 번째 단서 찾기",
    location: "📍 백송이님 자리",
    type: "number",
    emoji: "📸",
    mission: "이번 단서는 팀의 추억 속에 숨어 있습니다.\n[백송이님 자리]에 놓인 사진을 찾아보세요.\n\n사진에 적힌 숫자가 세 번째 단서입니다.",
    placeholder: "숫자를 입력해 주세요",
    answers: ["15"],
    successTitle: "세 번째 단서를 찾았습니다! 🎉",
    successMsg: "두 번째 숫자는 15입니다.\n오늘 5월 15일, 스승의 날을 의미합니다.",
    nextMsg: "마지막 단서는 본부장님의 리더십을 상징하는 심볼입니다.\n[미팅룸 복도]로 이동해 주세요.",
    hint: "사진을 다시 한번 확인해 주세요."
  },
  {
    step: 4,
    title: "리더십 심볼 찾기",
    location: "📍 미팅룸 복도",
    type: "symbol",
    emoji: "🏆",
    mission: "마지막 단서는 정민우님의 리더십을 상징하는\n3개의 심볼입니다.\n\n미팅룸 복도에 붙어 있는 안내 포스트잇을 확인하고,\n포스트잇에 적힌 1, 2, 3번 순서대로\n아래 심볼을 선택해 주세요.",
    symbols: ["🗝️", "🛡️", "🧭"],
    answer: ["🗝️", "🛡️", "🧭"],
    successTitle: "리더십 심볼을 모두 찾았습니다! 🎉",
    successMsg: "열쇠, 방패, 나침반.\n세 가지 심볼이 모여 정민우님의 리더십을 완성합니다.",
    hint: "안내 포스트잇에 적힌 1, 2, 3번 순서를 다시 한번 확인해 주세요."
  }
];

// ===========================
// 상태
// ===========================
let state = {
  screen: "start",
  step: 1,
  symbols: [],
  showSuccess: false
};

function loadState() {
  try {
    const s = localStorage.getItem("mwTreasure");
    if (s) state = JSON.parse(s);
  } catch (e) {}
}

function saveState() {
  try { localStorage.setItem("mwTreasure", JSON.stringify(state)); } catch (e) {}
}

// ===========================
// 화면 전환
// ===========================
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("screen-" + id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===========================
// 게임 시작
// ===========================
function startGame() {
  state = { screen: "step", step: 1, symbols: [], showSuccess: false };
  saveState();
  renderStep();
  showScreen("step");
}

// ===========================
// Step 렌더링
// ===========================
function renderStep() {
  const m = MISSIONS[state.step - 1];

  // 진행바
  document.getElementById("progress-fill").style.width = (state.step / 4 * 100) + "%";
  document.getElementById("step-badge").textContent = "Step " + state.step + " / 4";

  // 카드 내용
  document.getElementById("step-location").textContent = m.location;
  document.getElementById("step-title").textContent = m.title;
  document.getElementById("step-emoji").textContent = m.emoji;
  document.getElementById("step-mission").innerHTML = formatMission(m.mission);

  // 성공 패널 숨기기
  hide("success-panel");
  hide("hint-area");

  if (m.type === "symbol") {
    hide("input-area");
    show("symbol-area");
    state.symbols = [];
    updateSymbolUI();
  } else {
    show("input-area");
    hide("symbol-area");

    const inp = document.getElementById("answer-input");
    inp.value = "";
    inp.type = m.type === "number" ? "tel" : "text";
    inp.placeholder = m.placeholder;
    inp.className = "answer-input";

    inp.onkeydown = e => { if (e.key === "Enter") checkAnswer(); };
  }
}

// ===========================
// 정답 확인 (텍스트/숫자)
// ===========================
function checkAnswer() {
  const m = MISSIONS[state.step - 1];
  const inp = document.getElementById("answer-input");
  const raw = inp.value;
  const val = normalize(raw);

  if (!val) return;

  const ok = m.answers.some(a => normalize(a) === val);

  if (ok) {
    showSuccess();
  } else {
    inp.classList.add("wrong");
    setTimeout(() => inp.classList.remove("wrong"), 500);
    showHint(m.hint);
  }
}

// [위치명] → <strong class="loc">위치명</strong> + \n → <br>
function formatMission(text) {
  return text
    .replace(/\[([^\]]+)\]/g, '<strong class="loc">$1</strong>')
    .replace(/\n/g, '<br>');
}

function normalize(str) {
  return str
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^가-힣\w]/g, "")
    .toLowerCase();
}

// ===========================
// 심볼 선택 (Step 4)
// ===========================
function selectSymbol(sym) {
  if (state.symbols.length >= 3) return;

  state.symbols.push(sym);
  updateSymbolUI();

  if (state.symbols.length === 3) {
    const m = MISSIONS[state.step - 1];
    const ok = state.symbols.every((s, i) => s === m.answer[i]);
    if (ok) {
      setTimeout(showSuccess, 300);
    } else {
      setTimeout(() => {
        showHint(m.hint);
        setTimeout(() => {
          state.symbols = [];
          updateSymbolUI();
          hide("hint-area");
        }, 2500);
      }, 300);
    }
  }
}

function resetSymbols() {
  state.symbols = [];
  updateSymbolUI();
  hide("hint-area");
}

function updateSymbolUI() {
  for (let i = 0; i < 3; i++) {
    const slot = document.getElementById("slot-" + i);
    if (state.symbols[i]) {
      slot.textContent = state.symbols[i];
      slot.classList.add("filled");
    } else {
      slot.textContent = "?";
      slot.classList.remove("filled");
    }
  }
  // 버튼 선택 표시
  document.querySelectorAll(".symbol-btn").forEach(btn => {
    const count = state.symbols.filter(s => s === btn.textContent.trim()).length;
    btn.classList.toggle("selected", count > 0);
  });
}

// ===========================
// 힌트 표시
// ===========================
function showHint(text) {
  document.getElementById("hint-text").textContent = text;
  show("hint-area");
}

// ===========================
// 성공 화면
// ===========================
function showSuccess() {
  const m = MISSIONS[state.step - 1];

  hide("input-area");
  hide("symbol-area");
  hide("hint-area");

  document.getElementById("success-title").textContent = m.successTitle;
  document.getElementById("success-message").textContent = m.successMsg;

  if (state.step < 4) {
    document.getElementById("next-message").textContent = m.nextMsg;
    show("next-location-area");
    document.getElementById("next-btn").textContent = "다음 단서 찾기 →";
  } else {
    hide("next-location-area");
    document.getElementById("next-btn").textContent = "보물 확인하기 🎁";
  }

  show("success-panel");
  state.showSuccess = true;
  saveState();

  setTimeout(() => {
    document.getElementById("success-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}

// ===========================
// 다음 단계
// ===========================
function nextStep() {
  if (state.step >= 4) {
    state.screen = "complete";
    saveState();
    showScreen("complete");
    launchConfetti();
  } else {
    state.step++;
    state.symbols = [];
    state.showSuccess = false;
    saveState();
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// ===========================
// 🎊 컨페티
// ===========================
const CONFETTI_EMOJIS = ["🎉", "✨", "🌸", "💛", "⭐", "🎊", "💖", "🌟"];

function launchConfetti() {
  const wrap = document.getElementById("confetti-wrap");
  wrap.innerHTML = "";
  for (let i = 0; i < 22; i++) {
    setTimeout(() => {
      const el = document.createElement("span");
      el.className = "confetti-piece";
      el.textContent = CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)];
      el.style.left = Math.random() * 100 + "vw";
      el.style.fontSize = (16 + Math.random() * 18) + "px";
      const dur = 2.5 + Math.random() * 2;
      el.style.animationDuration = dur + "s";
      wrap.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000 + 200);
    }, i * 120);
  }
}

// ===========================
// 유틸
// ===========================
function show(id) { document.getElementById(id).classList.remove("hidden"); }
function hide(id) { document.getElementById(id).classList.add("hidden"); }

// ===========================
// 초기화
// ===========================
window.addEventListener("DOMContentLoaded", () => {
  loadState();
  if (state.screen === "complete") {
    showScreen("complete");
    launchConfetti();
  } else if (state.screen === "step") {
    renderStep();
    showScreen("step");
    if (state.showSuccess) showSuccess();
  } else {
    showScreen("start");
  }
});
