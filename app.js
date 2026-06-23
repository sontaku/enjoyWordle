let answer = [];
let current = [];
let history = [];

const KEYS = [
  "ㄱ","ㄴ","ㄷ","ㄹ","ㅁ",
  "ㅂ","ㅅ","ㅇ","ㅈ","ㅊ",
  "ㅋ","ㅌ","ㅍ","ㅎ",
  "ㅏ","ㅓ","ㅗ","ㅜ","ㅡ"
];

function disassemble(word) {
  const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
  const JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";

  let result = [];

  for (let ch of word) {
    const code = ch.charCodeAt(0) - 0xac00;
    const cho = Math.floor(code / 588);
    const jung = Math.floor((code % 588) / 28);

    result.push(CHO[cho]);
    result.push(JUNG[jung]);
  }

  return result;
}

fetch("words.json")
  .then(r => r.json())
  .then(words => {
    const valid = words.filter(w => disassemble(w).length === 5);

    const day = Math.floor(Date.now() / 86400000);
    const selected = valid[day % valid.length];

    answer = disassemble(selected);

    renderKeyboard();
    renderBoard();
  });

function addKey(k) {
  if (current.length >= 5) return;
  current.push(k);
  renderBoard();
}

function backspace() {
  current.pop();
  renderBoard();
}

function submit() {
  if (current.length !== 5) return;

  const row = current.map((c, i) => {
    if (c === answer[i]) return "green";
    if (answer.includes(c)) return "yellow";
    return "gray";
  });

  history.push({ chars: current, result: row });

  current = [];
  renderBoard();
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  history.forEach(row => {
    const div = document.createElement("div");
    div.className = "row";

    row.chars.forEach((c, i) => {
      const cell = document.createElement("div");
      cell.className = "cell " + row.result[i];
      cell.innerText = c;
      div.appendChild(cell);
    });

    board.appendChild(div);
  });

  const cur = document.createElement("div");
  cur.className = "row";

  for (let i = 0; i < 5; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = current[i] || "";
    cur.appendChild(cell);
  }

  board.appendChild(cur);
}

function renderKeyboard() {
  const kb = document.getElementById("keyboard");
  kb.innerHTML = "";

  KEYS.forEach(k => {
    const btn = document.createElement("button");
    btn.innerText = k;
    btn.onclick = () => addKey(k);
    kb.appendChild(btn);
  });

  const del = document.createElement("button");
  del.innerText = "⌫";
  del.onclick = backspace;
  kb.appendChild(del);
}
