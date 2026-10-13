#!/usr/bin/env node
/*
 * Test with debug instrumentation
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

async function testWithDebug() {
  console.log('\n=================================');
  console.log('Testing with debug output');
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
    
    // Load app with debug instrumentation
    console.log('Loading app with debug...');
    emu.tx(`
      var touchCount = 0;
      var originalOnTouch = onTouch;
      onTouch = function(btn, pt) {
        touchCount++;
        print("TOUCH CALLED:", touchCount, "btn:", btn, "point:", JSON.stringify(pt));
        return originalOnTouch(btn, pt);
      };
    `);
    emu.idle();
    
    emu.tx('load("quicktimer.app.js")\n');
    emu.idle();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if touch handler is registered
    emu.tx('\x10print(typeof Bangle.uiRemove)\n');
    emu.idle();
    console.log('Bangle.uiRemove type:', emu.getLastLine());
    
    // Try a touch
    console.log('\nSimulating touch at (47, 113)...');
    emu.tx('Bangle.emit("touch", 1, {x:47, y:113, type:1})\n');
    emu.idle();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    emu.tx('\x10print(touchCount)\n');
    emu.idle();
    console.log('Touch handler called count:', emu.getLastLine());
    
    await emu.writeScreenshot(path.join(OUTPUT_DIR, 'debug-test.png'));
    
  } catch (err) {
    console.error('\nTest failed:', err);
    process.exit(1);
  }
}

emu.init({
  EMULATOR: "banglejs2",
  DEVICEID: "BANGLEJS2"
}).then(async () => {
  await testWithDebug();
  process.exit(0);
}).catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
