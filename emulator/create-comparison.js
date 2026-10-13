#!/usr/bin/env node
/*
 * Create before/after comparison screenshots
 * This demonstrates the widget offset issue and fix
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const DIR_IDE = path.join(__dirname, 'EspruinoWebIDE');
const OUTPUT_DIR = path.join(__dirname, 'comparison');

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

const emu = require(tempEmuPath);

async function createComparison() {
  console.log('\n=== Creating Before/After Comparison ===\n');

  // Read the broken version from git
  const { execSync } = require('child_process');
  const brokenCode = execSync('git show 7fba3aea5:apps/quicktimer/app.js', { cwd: BASE_DIR }).toString();
  const fixedCode = fs.readFileSync(path.join(BASE_DIR, 'apps', 'quicktimer', 'app.js'), 'utf8');

  // Test broken version
  console.log('1. Testing BROKEN version (without widget offset fix)...');
  emu.factoryReset();
  emu.tx('Bangle.loadWidgets()\n');
  emu.idle();
  emu.tx(brokenCode + '\n');
  emu.idle();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await emu.writeScreenshot(path.join(OUTPUT_DIR, '01-broken-initial.png'));
  console.log('   ✓ Saved: 01-broken-initial.png');
  
  // Try touch on broken version
  emu.tx('Bangle.emit("touch", 1, {x:47, y:104, type:1})\n');
  emu.idle();
  await new Promise(resolve => setTimeout(resolve, 500));
  await emu.writeScreenshot(path.join(OUTPUT_DIR, '02-broken-after-touch.png'));
  console.log('   ✓ Saved: 02-broken-after-touch.png (timer should NOT start)');

  // Test fixed version
  console.log('\n2. Testing FIXED version (with widget offset fix)...');
  emu.factoryReset();
  emu.tx('Bangle.loadWidgets()\n');
  emu.idle();
  emu.tx(fixedCode + '\n');
  emu.idle();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await emu.writeScreenshot(path.join(OUTPUT_DIR, '03-fixed-initial.png'));
  console.log('   ✓ Saved: 03-fixed-initial.png');
  
  // Try touch on fixed version - use correct coordinates
  emu.tx('Bangle.emit("touch", 1, {x:47, y:113, type:1})\n');
  emu.idle();
  await new Promise(resolve => setTimeout(resolve, 300));
  await emu.writeScreenshot(path.join(OUTPUT_DIR, '04-fixed-after-touch-immediate.png'));
  console.log('   ✓ Saved: 04-fixed-after-touch-immediate.png');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  await emu.writeScreenshot(path.join(OUTPUT_DIR, '05-fixed-timer-running.png'));
  console.log('   ✓ Saved: 05-fixed-timer-running.png (timer should be counting down)');

  console.log('\n=== Comparison Complete ===');
  console.log(`Screenshots saved to: ${OUTPUT_DIR}\n`);
}

emu.init({
  EMULATOR: "banglejs2",
  DEVICEID: "BANGLEJS2"
}).then(async () => {
  await createComparison();
  process.exit(0);
}).catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
