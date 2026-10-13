#!/usr/bin/env node
/*
 * Debug touch handling more carefully
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

async function testTouchHandling() {
  console.log('\n=================================');
  console.log('Debug touch handling');
  console.log('=================================\n');

  try {
    const app = apploader.apps.find(a => a.id === 'quicktimer');
    if (!app) {
      console.error('Error: quicktimer app not found');
      process.exit(1);
    }

    const appFilesCommand = await apploader.getAppFilesString(app);
    
    emu.factoryReset();
    
    console.log('Loading widgets...');
    emu.tx('Bangle.loadWidgets()\n');
    emu.idle();
    
    console.log('Uploading quicktimer app...');
    emu.tx(appFilesCommand);
    emu.idle();
    
    console.log('Resetting and loading app...');
    emu.tx('reset()\n');
    emu.idle();
    emu.tx('Bangle.loadWidgets()\n');
    emu.idle();
    
    // Check appRect
    emu.tx('\x10print(JSON.stringify(Bangle.appRect))\n');
    emu.idle();
    console.log('Bangle.appRect:', emu.getLastLine());
    
    // Load the app
    emu.tx('load("quicktimer.app.js")\n');
    emu.idle();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if endTime is set initially
    emu.tx('\x10print(endTime)\n');
    emu.idle();
    console.log('Initial endTime:', emu.getLastLine());
    
    // Test touch on button 1 (should be around x=47, y=108 in screen coords)
    // But with widget offset, button drawn at y=108, so touch at y=132 (108+24)
    const testX = 47;
    const testY = 132; // y=108 in app space = y=132 in screen space
    
    console.log(`\nSimulating touch at screen coords (${testX}, ${testY})...`);
    emu.tx(`Bangle.emit("touch", 1, {x:${testX}, y:${testY}, type:1})\n`);
    emu.idle();
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if endTime changed
    emu.tx('\x10print(endTime)\n');
    emu.idle();
    const endTimeAfter = emu.getLastLine();
    console.log('endTime after touch:', endTimeAfter);
    
    if (endTimeAfter === '0' || endTimeAfter === 'undefined') {
      console.log('\n✗ Touch did NOT trigger timer!');
    } else {
      console.log('\n✓ Touch successfully triggered timer!');
    }
    
    await emu.writeScreenshot(path.join(OUTPUT_DIR, 'debug-after-touch.png'));
    console.log('Screenshot saved.');
    
  } catch (err) {
    console.error('\nTest failed:', err);
    process.exit(1);
  }
}

emu.init({
  EMULATOR: EMULATOR,
  DEVICEID: DEVICEID
}).then(async () => {
  await testTouchHandling();
  process.exit(0);
}).catch(err => {
  console.error('Failed to initialize emulator:', err);
  process.exit(1);
});
