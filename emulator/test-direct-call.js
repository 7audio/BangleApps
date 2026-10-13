#!/usr/bin/env node
/*
 * Test by directly calling the touch handler
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

async function testDirectCall() {
  console.log('\n=================================');
  console.log('Testing direct handler call');
  console.log('=================================\n');

  try {
    const app = apploader.apps.find(a => a.id === 'quicktimer');
    const appFilesCommand = await apploader.getAppFilesString(app);
    
    emu.factoryReset();
    emu.tx('Bangle.loadWidgets()\n');
    emu.idle();
    emu.tx(appFilesCommand);
    emu.idle();
    emu.tx('reset()\n');
    emu.idle();
    emu.tx('Bangle.loadWidgets()\n');
    emu.idle();
    emu.tx('load("quicktimer.app.js")\n');
    emu.idle();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    await emu.writeScreenshot(path.join(OUTPUT_DIR, 'before-direct-call.png'));
    
    // Try calling onTouch directly
    console.log('Checking if onTouch exists...');
    emu.tx('\x10print(typeof onTouch)\n');
    emu.idle();
    console.log('typeof onTouch:', emu.getLastLine());
    
    console.log('\nCalling onTouch directly...');
    emu.tx('onTouch(1, {x:47, y:113, type:1})\n');
    emu.idle();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    await emu.writeScreenshot(path.join(OUTPUT_DIR, 'after-direct-call.png'));
    
    // Also try via Bangle.emit
    console.log('\nNow trying Bangle.emit("touch", ...)...');
    emu.tx('Bangle.emit("touch", 1, {x:47, y:113, type:1})\n');
    emu.idle();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    await emu.writeScreenshot(path.join(OUTPUT_DIR, 'after-emit.png'));
    
  } catch (err) {
    console.error('\nTest failed:', err);
    process.exit(1);
  }
}

emu.init({
  EMULATOR: "banglejs2",
  DEVICEID: "BANGLEJS2"
}).then(async () => {
  await testDirectCall();
  process.exit(0);
}).catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
