#!/usr/bin/env node
/*
 * Debug script to check what Bangle.appRect and touch coordinates look like
 */

const fs = require('fs');
const path = require('path');

// Set up paths
const BASE_DIR = path.join(__dirname, '..');
const DIR_IDE = path.join(__dirname, 'EspruinoWebIDE');

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

async function checkCoordinates() {
  console.log('\n=================================');
  console.log('Checking coordinate system');
  console.log('=================================\n');

  emu.factoryReset();
  
  // Load widgets
  console.log('Loading widgets...');
  emu.tx('Bangle.loadWidgets()\n');
  emu.idle();
  
  // Check what Bangle.appRect is
  console.log('Checking Bangle.appRect...');
  emu.tx('\x10print(JSON.stringify(Bangle.appRect))\n');
  emu.idle();
  const appRect = emu.getLastLine();
  console.log('Bangle.appRect =', appRect);
  
  // Check screen dimensions
  emu.tx('\x10print(g.getWidth())\n');
  emu.idle();
  const width = emu.getLastLine();
  console.log('g.getWidth() =', width);
  
  emu.tx('\x10print(g.getHeight())\n');
  emu.idle();
  const height = emu.getLastLine();
  console.log('g.getHeight() =', height);
  
  console.log('\n=================================\n');
}

emu.init({
  EMULATOR: EMULATOR,
  DEVICEID: DEVICEID
}).then(async () => {
  await checkCoordinates();
  process.exit(0);
}).catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
