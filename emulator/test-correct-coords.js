#!/usr/bin/env node
/*
 * Test with correctly calculated coordinates
 */

const fs = require('fs');
const path = require('path');

// Set up paths
const BASE_DIR = path.join(__dirname, '..');
const DIR_IDE = path.join(__dirname, 'EspruinoWebIDE');
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Override the emulator module paths
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

const EMULATOR = "banglejs2";
const DEVICEID = "BANGLEJS2";

apploader.init({
  DEVICEID: DEVICEID
});

async function testWithCorrectCoords() {
  console.log('\n=================================');
  console.log('Testing with correct coordinates');
  console.log('=================================\n');

  try {
    const app = apploader.apps.find(a => a.id === 'quicktimer');
    if (!app) {
      console.error('Error: quicktimer app not found');
      process.exit(1);
    }

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
    await emu.writeScreenshot(path.join(OUTPUT_DIR, 'before-touch.png'));
    console.log('Initial screenshot saved.');
    
    // With appRect.y=24, height=152:
    // buttonTop = floor(152 * 0.48) = 72
    // buttonWidth = floor((176 - 16 - 6) / 2) = 77
    // buttonHeight = floor((152 - 72 - 8 - 6) / 2) = 33
    // Button 1 is at screen coords (8, 96) to (85, 129)
    // Center: (46.5, 112.5)
    
    const testX = 47;
    const testY = 113;
    
    console.log(`\nTouching at (${testX}, ${testY})...`);
    emu.tx(`Bangle.emit("touch", 1, {x:${testX}, y:${testY}, type:1})\n`);
    emu.idle();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    emu.tx('\x10print(endTime)\n');
    emu.idle();
    const endTimeAfter = emu.getLastLine();
    console.log('endTime after touch:', endTimeAfter);
    
    await emu.writeScreenshot(path.join(OUTPUT_DIR, 'after-touch.png'));
    console.log('After-touch screenshot saved.');
    
    if (endTimeAfter === '0' || endTimeAfter === 'undefined') {
      console.log('\n✗ Touch did NOT trigger timer!');
    } else {
      console.log('\n✓ Touch successfully triggered timer!');
      
      // Wait a bit more to see timer countdown
      await new Promise(resolve => setTimeout(resolve, 1000));
      await emu.writeScreenshot(path.join(OUTPUT_DIR, 'timer-running.png'));
      console.log('Timer running screenshot saved.');
    }
    
  } catch (err) {
    console.error('\nTest failed:', err);
    process.exit(1);
  }
}

emu.init({
  EMULATOR: EMULATOR,
  DEVICEID: DEVICEID
}).then(async () => {
  await testWithCorrectCoords();
  process.exit(0);
}).catch(err => {
  console.error('Failed to initialize emulator:', err);
  process.exit(1);
});
