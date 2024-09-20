function out(msg) {
  console.log(msg);
  E.showMessage(msg);
}

const intro = 5
const otdyx = 10
const rabota = 40

const buzzShortMs = 85
const buzzLongMs = 170

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function blinkBlue() {
  Bangle.buzz(buzzShortMs)
  out('blue')
}

function blinkGreen() {
  Bangle.buzz(buzzShortMs)
  out('green')
}

function blinkRed() {
  Bangle.buzz(buzzShortMs)
  out('red')
}

function blinkAllThree() {
  Bangle.buzz(buzzLongMs)
  out('all three')
}

function blinkAllThreeThrice() {
  for (let i = 0; i < 3; i++) {
    setTimeout(function () {
      blinkAllThree();
    }, i * buzzLongMs * 3);
  }
}

function otrezokEnding() {
  setTimeout(function () {
    blinkBlue();
    setTimeout(function () {
      blinkGreen();
      setTimeout(function () {
        blinkRed();
        setTimeout(function () {
          blinkAllThreeThrice();
        }, 1000 - buzzLongMs);
      }, 1000 - buzzLongMs);
    }, 1000 - buzzLongMs);
  }, 1000);
}

function otrezokNSec(n) {
  const totalTime = 1000 * n
  const otrezokEndingLength = 3000 + buzzLongMs
  const jdatVTishine = totalTime - otrezokEndingLength
  out(`${totalTime}\n${jdatVTishine}`)
  return wait(jdatVTishine).then(() => otrezokEnding());
}

const runOtrezok = function() {
  otrezokNSec(intro);

  wait(1000*intro + (0*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx));
  wait(1000*intro + (0*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx+rabota));

  wait(1000*intro + (1*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx));
  wait(1000*intro + (1*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx+rabota));

  wait(1000*intro + (2*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx));
  wait(1000*intro + (2*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx+rabota));

  wait(1000*intro + (3*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx));
  wait(1000*intro + (3*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx+rabota));

  wait(1000*intro + (4*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx));
  wait(1000*intro + (4*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx+rabota));

  wait(1000*intro + (5*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx));
  wait(1000*intro + (5*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx+rabota));

  wait(1000*intro + (6*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx));
  wait(1000*intro + (6*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx+rabota));

  wait(1000*intro + (7*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx));
  wait(1000*intro + (7*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx+rabota));

  wait(1000*intro + (8*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx));
  wait(1000*intro + (8*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx+rabota));

  wait(1000*intro + (9*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx));
  wait(1000*intro + (9*1000*(otdyx+rabota))).then(() => otrezokNSec(otdyx+rabota));

  wait(2000+1000*intro + (10*1000*(otdyx+rabota))).then(() => {
    out('dope <3')
    Bangle.buzz(3333)
  });
}

out('you handsome');

setWatch(() => {
  runOtrezok()
}, BTN1, { edge: 'rising', repeat: true, debounce: 50 });
