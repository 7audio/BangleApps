const storage = require("Storage");
const dataFile = "quicktimer.json";
let lastDuration = storage.readJSON(dataFile, 1);
const pages = [[1, 2, 3, 4], [5, 10, 20, 30]];
if (!pages[0].concat(pages[1]).includes(lastDuration)) lastDuration = 0;
let page = 0;
let cancelTimeout;

let endTime = 0;
let finished = false;
let timerInterval;
let alertTimeouts = [];

function draw() {
  const R = Bangle.appRect;
  const width = R.w;
  const height = R.h;
  const margin = 8;
  const gap = 6;
  const buttonTop = Math.floor(height * 0.48);
  const buttonWidth = Math.floor((width - margin * 2 - gap) / 2);
  const buttonHeight = Math.floor((height - buttonTop - margin - gap) / 2);

  g.reset().clearRect(R);
  g.setColor(g.theme.fg);
  g.setFontAlign(0, 0);
  g.setFont("6x8", 2);
  g.drawString(lastDuration ? `Last: ${lastDuration} min` : "Last: none", R.x + width / 2, R.y + 16);

  if (endTime) {
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    g.setFont("Vector", 40);
    g.drawString(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`, R.x + width / 2, R.y + height * 0.33);
  } else {
    if (finished) {
      g.setFont("6x8", 2);
      g.drawString("Time's up!", R.x + width / 2, R.y + height * 0.33);
    }
  }

  g.setFont("6x8", 2);
  for (let i = 0; i < 4; i++) {
    const x = R.x + margin + (i % 2) * (buttonWidth + gap);
    const y = R.y + buttonTop + Math.floor(i / 2) * (buttonHeight + gap);
    g.drawRect(x, y, x + buttonWidth, y + buttonHeight);
    g.drawString(`${pages[page][i]} m`, x + buttonWidth / 2, y + buttonHeight / 2);
  }
}

function clearAlert() {
  alertTimeouts.forEach(clearTimeout);
  alertTimeouts = [];
}

function alert() {
  Bangle.buzz(825);
  for (let i = 1; i < 5; i++) {
    alertTimeouts.push(setTimeout(() => Bangle.buzz(825), i * 1000));
  }
}

function updateTimer() {
  if (endTime <= Date.now()) {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = undefined;
    endTime = 0;
    finished = true;
    draw();
    alert();
    return;
  }
  draw();
}

function startTimer(minutes) {
  if (timerInterval) clearInterval(timerInterval);
  clearAlert();
  lastDuration = minutes;
  storage.writeJSON(dataFile, lastDuration);
  endTime = Date.now() + minutes * 60000;
  finished = false;
  draw();
  timerInterval = setInterval(updateTimer, 250);
}

function cancelTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = undefined;
  clearAlert();
  endTime = 0;
  finished = false;
  Bangle.buzz(100);
  draw();
}

function onDrag(e) {
  const R = Bangle.appRect;
  if (e.b && !cancelTimeout) {
    if (endTime && e.y < R.y + Math.floor(R.h * 0.48)) {
      cancelTimeout = setTimeout(() => { cancelTimeout = undefined; cancelTimer(); }, 1500);
    }
  } else if (!e.b && cancelTimeout) {
    clearTimeout(cancelTimeout);
    cancelTimeout = undefined;
  }
}

function onButton() {
  page = (page + 1) % pages.length;
  draw();
}

function onTouch(_button, point) {
  const R = Bangle.appRect;
  const width = R.w;
  const height = R.h;
  const margin = 8;
  const gap = 6;
  const buttonTop = Math.floor(height * 0.48);
  const buttonWidth = Math.floor((width - margin * 2 - gap) / 2);
  const buttonHeight = Math.floor((height - buttonTop - margin - gap) / 2);

  if (point.y < R.y + buttonTop) return;
  const column = Math.floor((point.x - R.x - margin) / (buttonWidth + gap));
  const row = Math.floor((point.y - R.y - buttonTop) / (buttonHeight + gap));
  if (column < 0 || column > 1 || row < 0 || row > 1) return;

  const x = R.x + margin + column * (buttonWidth + gap);
  const y = R.y + buttonTop + row * (buttonHeight + gap);
  if (point.x > x + buttonWidth || point.y > y + buttonHeight) return;
  startTimer(pages[page][row * 2 + column]);
}

Bangle.loadWidgets();
Bangle.drawWidgets();
Bangle.setUI({mode: "custom", touch: onTouch, drag: onDrag, btn: onButton});
draw();
