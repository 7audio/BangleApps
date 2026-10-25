#!/usr/bin/env node
/*
 * Test script for the quicktimer app using the Bangle.js 2 emulator
 * This script loads the app, takes screenshots, and simulates button taps
 */

const fs = require('fs');
const path = require('path');

// Set up paths
const BASE_DIR = path.join(__dirname, '..');
const APP_DIR = path.join(BASE_DIR, 'apps');
const DIR_IDE = path.join(__dirname, 'EspruinoWebIDE');
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

if (!fs.existsSync(DIR_IDE)) {
  console.error(`Error: EspruinoWebIDE not found at ${DIR_IDE}`);
  console.error("Please run: cd emulator && git clone https://github.com/espruino/EspruinoWebIDE");
  process.exit(1);
}

// Override the emulator module paths and add console output capture
const emuModulePath = path.join(BASE_DIR, 'core', 'lib', 'emulator.js');
let emuModule = fs.readFileSync(emuModulePath, 'utf8');
emuModule = emuModule.replace(
  'var DIR_IDE =  BASE_DIR + "/../EspruinoWebIDE";',
  `var DIR_IDE = "${DIR_IDE.replace(/\\/g, '/')}";`
);

// Hook into console output
emuModule = emuModule.replace(
  'function onConsoleOutput(txt) {',
  `var consoleOutputCallback = null;
exports.setConsoleCallback = function(cb) { consoleOutputCallback = cb; };
function onConsoleOutput(txt) {
  if (consoleOutputCallback) consoleOutputCallback(txt);`
);

// Create a temporary modified emulator module
const tempEmuPath = path.join(__dirname, 'emulator-temp.js');
fs.writeFileSync(tempEmuPath, emuModule);

// Load modules
const apploader = require(path.join(BASE_DIR, 'core', 'lib', 'apploader.js'));
const emu = require(tempEmuPath);

const EMULATOR = "banglejs2";
const DEVICEID = "BANGLEJS2";

apploader.init({
  DEVICEID: DEVICEID
});

// Capture console output from the emulator
let consoleLog = '';

async function takeScreenshot(filename) {
  const filepath = path.join(OUTPUT_DIR, filename);
  try {
    await emu.writeScreenshot(filepath);
    console.log(`✓ Screenshot saved: ${filename}`);
    return filepath;
  } catch (err) {
    console.error(`✗ Screenshot failed: ${err}`);
    return null;
  }
}

async function simulateTouch(x, y, label) {
  console.log(`  Simulating touch at (${x}, ${y}) - ${label}`);
  // Emit a touch event with button=1 (touch), x, y coordinates
  emu.tx(`Bangle.emit("touch", 1, {x:${x}, y:${y}, type:1})\n`);
  emu.idle();
  // Wait a bit for the app to react
  await new Promise(resolve => setTimeout(resolve, 100));
}

async function testQuickTimer() {
  console.log('\n=================================');
  console.log('Testing quicktimer app');
  console.log('=================================\n');

  try {
    // Find the quicktimer app
    const app = apploader.apps.find(a => a.id === 'quicktimer');
    if (!app) {
      console.error('Error: quicktimer app not found');
      process.exit(1);
    }

    // Get app files
    console.log('Loading app files...');
    const appFilesCommand = await apploader.getAppFilesString(app);
    
    // Factory reset
    console.log('Factory resetting emulator...');
    emu.factoryReset();
    
    // Load widgets
    console.log('Loading widgets...');
    emu.tx('Bangle.loadWidgets()\n');
    emu.idle();
    
    // Upload the app
    console.log('Uploading quicktimer app...');
    emu.tx(appFilesCommand);
    emu.idle();
    
    // Reset and load the app
    console.log('Resetting and loading app...');
    emu.tx('reset()\n');
    emu.idle();
    emu.tx('Bangle.loadWidgets()\n');
    emu.idle();
    emu.tx('load("quicktimer.app.js")\n');
    emu.idle();
    
    // Wait for app to initialize
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Take initial screenshot
    console.log('\nTaking initial screenshot...');
    await takeScreenshot('quicktimer-initial.png');
    
    // Test button coordinates based on the app's layout
    // Screen is 176x176, buttons are in a 2x2 grid
    // Button calculations from app.js:
    const width = 176;
    const height = 176;
    const margin = 8;
    const gap = 6;
    const buttonTop = Math.floor(height * 0.48); // ~84
    const buttonWidth = Math.floor((width - margin * 2 - gap) / 2); // ~77
    const buttonHeight = Math.floor((height - buttonTop - margin - gap) / 2); // ~42
    
    // Calculate button centers
    const buttons = [
      { id: '1min', x: margin + buttonWidth / 2, y: buttonTop + buttonHeight / 2, row: 0, col: 0 },
      { id: '2min', x: margin + buttonWidth + gap + buttonWidth / 2, y: buttonTop + buttonHeight / 2, row: 0, col: 1 },
      { id: '3min', x: margin + buttonWidth / 2, y: buttonTop + buttonHeight + gap + buttonHeight / 2, row: 1, col: 0 },
      { id: '4min', x: margin + buttonWidth + gap + buttonWidth / 2, y: buttonTop + buttonHeight + gap + buttonHeight / 2, row: 1, col: 1 }
    ];
    
    console.log('\nButton layout:');
    console.log(`  Screen: ${width}x${height}`);
    console.log(`  Button size: ${buttonWidth}x${buttonHeight}`);
    console.log(`  Button top: ${buttonTop}`);
    console.log(`  Margin: ${margin}, Gap: ${gap}`);
    
    // Test each button
    for (const btn of buttons) {
      console.log(`\n--- Testing ${btn.id} button ---`);
      console.log(`  Position: (${Math.round(btn.x)}, ${Math.round(btn.y)})`);
      
      await simulateTouch(Math.round(btn.x), Math.round(btn.y), btn.id);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await takeScreenshot(`quicktimer-${btn.id}-active.png`);
      
      // Wait a bit to see timer countdown
      await new Promise(resolve => setTimeout(resolve, 1000));
      await takeScreenshot(`quicktimer-${btn.id}-running.png`);
      
      // Stop the timer by going back to initial state
      console.log('  Resetting for next test...');
      emu.tx('load("quicktimer.app.js")\n');
      emu.idle();
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('\n=================================');
    console.log('✓ Test completed successfully!');
    console.log(`✓ Screenshots saved to: ${OUTPUT_DIR}`);
    console.log('=================================\n');
    
    // Check for errors in console log
    if (consoleLog.includes('Uncaught') || consoleLog.includes('not allowed')) {
      console.error('\n⚠️  ERRORS DETECTED IN EMULATOR CONSOLE:');
      console.error('─────────────────────────────────────────');
      consoleLog.split('\n').forEach(line => {
        if (line.includes('Uncaught') || line.includes('Error') || line.includes('not allowed')) {
          console.error(line);
        }
      });
      console.error('─────────────────────────────────────────\n');
      process.exit(1);
    }
    
  } catch (err) {
    console.error('\n=================================');
    console.error('✗ Test failed:', err);
    console.error('=================================\n');
    process.exit(1);
  }
}

// Initialize emulator and run test
console.log('Initializing Bangle.js 2 emulator...');
emu.init({
  EMULATOR: EMULATOR,
  DEVICEID: DEVICEID
}).then(async () => {
  console.log('✓ Emulator ready!\n');
  
  // Set up console output capture
  emu.setConsoleCallback((txt) => {
    consoleLog += txt + '\n';
    console.log('[Emulator Console]', txt);
    if (txt.includes('Uncaught') || txt.includes('Error') || txt.includes('not allowed')) {
      console.error('⚠️  ERROR DETECTED:', txt);
    }
  });
  
  await testQuickTimer();
  process.exit(0);
}).catch(err => {
  console.error('Failed to initialize emulator:', err);
  process.exit(1);
});
