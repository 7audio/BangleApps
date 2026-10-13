#!/usr/bin/env node
/*
 * Test with logging added to the app code
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const DIR_IDE = path.join(__dirname, 'EspruinoWebIDE');
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const emuModulePath = path.join(BASE_DIR, 'core', 'lib', 'emulator.js');
let emuModule = fs.readFileSync(emuModulePath, 'utf8');
emuModule = emuModule.replace(
  'var DIR_IDE =  BASE_DIR + "/../EspruinoWebIDE";',
  `var DIR_IDE = "${DIR_IDE.replace(/\\/g, '/')}";`
);

const tempEmuPath = path.join(__dirname, 'emulator-temp.js');
fs.writeFileSync(tempEmuPath, emuModule);

const apploader = require(path.join(BASE_DIR, 'core', 'lib', 'apploader.js'));
const emu = require(tempEmuPath);

apploader.init({ DEVICEID: "BANGLEJS2" });

async function testWithLogging() {
  console.log('\n=================================');
  console.log('Testing with detailed logging');
  console.log('=================================\n');

  try {
    // Load app manually with debug logging
    const appPath = path.join(BASE_DIR, 'apps', 'quicktimer', 'app.js');
    let appCode = fs.readFileSync(appPath, 'utf8');
    
    // Add logging to onTouch function
    appCode = appCode.replace(
      'function onTouch(_button, point) {',
      `function onTouch(_button, point) {
  print("=== onTouch called ===");
  print("button:", _button, "point:", JSON.stringify(point));`
    );
    
    appCode = appCode.replace(
      'if (point.y < R.y + buttonTop) return;',
      `print("R.y:", R.y, "buttonTop:", buttonTop, "R.y+buttonTop:", R.y + buttonTop);
  print("point.y:", point.y, "check:", point.y < R.y + buttonTop);
  if (point.y < R.y + buttonTop) { print("EARLY RETURN 1"); return; }`
    );
    
    appCode = appCode.replace(
      'if (column < 0 || column > 1 || row < 0 || row > 1) return;',
      `print("column:", column, "row:", row);
  if (column < 0 || column > 1 || row < 0 || row > 1) { print("EARLY RETURN 2"); return; }`
    );
    
    appCode = appCode.replace(
      'if (point.x > x + buttonWidth || point.y > y + buttonHeight) return;',
      `print("x:", x, "y:", y, "buttonWidth:", buttonWidth, "buttonHeight:", buttonHeight);
  print("point.x:", point.x, "x+buttonWidth:", x + buttonWidth, "check1:", point.x > x + buttonWidth);
  print("point.y:", point.y, "y+buttonHeight:", y + buttonHeight, "check2:", point.y > y + buttonHeight);
  if (point.x > x + buttonWidth || point.y > y + buttonHeight) { print("EARLY RETURN 3"); return; }`
    );
    
    appCode = appCode.replace(
      'startTimer(row * 2 + column + 1);',
      `print("STARTING TIMER:", row * 2 + column + 1);
  startTimer(row * 2 + column + 1);`
    );
    
    emu.factoryReset();
    emu.tx('Bangle.loadWidgets()\n');
    emu.idle();
    
    console.log('Uploading instrumented app...');
    emu.tx(appCode + '\n');
    emu.idle();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('\nCalling onTouch(1, {x:47, y:113})...');
    emu.tx('onTouch(1, {x:47, y:113, type:1})\n');
    emu.idle();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    await emu.writeScreenshot(path.join(OUTPUT_DIR, 'logged-test.png'));
    
  } catch (err) {
    console.error('\nTest failed:', err);
    process.exit(1);
  }
}

emu.init({
  EMULATOR: "banglejs2",
  DEVICEID: "BANGLEJS2"
}).then(async () => {
  await testWithLogging();
  process.exit(0);
}).catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
