function out(msg) {
  console.log(msg);
  E.showMessage(msg);
}

const koeff = 75;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function blinkBlue() {
  Bangle.buzz(50)
  out('blue')
}

function blinkGreen() {
  Bangle.buzz(50)
  out('green')
}

function blinkRed() {
  Bangle.buzz(50)
  out('red')
}

function blinkAllThree() {
  Bangle.buzz(koeff)
  out('all three')
}

function blinkAllThreeThrice() {
  for (let i = 0; i < 3; i++) {
    setTimeout(function () {
      blinkAllThree();
    }, i * koeff * 3);
  }
}

function otrezokEnding() {
  setTimeout(function () {
    blinkBlue(); // Blink blue LED after 1 second
    setTimeout(function () {
      blinkGreen(); // Blink green LED after 950 ms
      setTimeout(function () {
        blinkRed(); // Blink red LED after another 950 ms
        setTimeout(function () {
          blinkAllThreeThrice();
        }, 1000 - koeff);
      }, 1000 - koeff);
    }, 1000 - koeff);
  }, 1000);
}

function otrezokNSec(n) {
  const totalTime = 1000 * n
  const otrezokEndingLength = 3000 + koeff
  const jdatVTishine = totalTime - otrezokEndingLength
  out(`${totalTime}\n${jdatVTishine}`)
  return wait(jdatVTishine).then(() => otrezokEnding());
}

const runOtrezok = function() {
  const intro = 4
  const otdyx = 10
  const rabota = 38

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
    out('done')
    Bangle.buzz(3333)
  });
}

setWatch(() => {
  runOtrezok()
}, BTN1, { edge: 'rising', repeat: true, debounce: 50 });

// Bangle.on('touch', loopSearchIds);

