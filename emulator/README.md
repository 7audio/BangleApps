# Bangle.js 2 Emulator Setup

This directory contains scripts and tools for testing Bangle.js 2 apps using the Espruino emulator.

## Prerequisites

The emulator requires:
- Node.js (v16 or later)
- npm packages: `jimp@0.22.12` (installed in parent directory)
- EspruinoWebIDE repository (cloned in this directory)

## Setup

1. Install dependencies from the workspace root:
   ```bash
   npm install
   ```

2. Clone the EspruinoWebIDE repository:
   ```bash
   cd emulator
   git clone https://github.com/espruino/EspruinoWebIDE
   ```

3. The core submodule should already be initialized:
   ```bash
   cd ..
   git submodule update --init
   ```

## Testing Apps

### Quick Timer Test

To test the quicktimer app with simulated touch events:

```bash
node emulator/test-quicktimer.js
```

This will:
- Load the app in the emulator
- Simulate touches on all four timer buttons
- Generate screenshots in `emulator/screenshots/`
- Verify that timers start correctly

### Manual Testing

You can create custom test scripts using the emulator API:

```javascript
const emu = require('./core/lib/emulator.js');

await emu.init({
  EMULATOR: "banglejs2",
  DEVICEID: "BANGLEJS2"
});

// Load widgets
emu.tx('Bangle.loadWidgets()\\n');
emu.idle();

// Load your app
emu.tx('load("yourapp.app.js")\\n');
emu.idle();

// Simulate touch at (x, y)
emu.tx('Bangle.emit("touch", 1, {x:50, y:100, type:1})\\n');
emu.idle();

// Take screenshot
await emu.writeScreenshot('output.png');
```

## Important Notes

### Widget Offset

When widgets are loaded (via `Bangle.loadWidgets()`), they occupy screen space:
- Top widget bar: typically 24 pixels
- `Bangle.appRect` provides the drawable area: `{x:0, y:24, w:176, h:152, x2:175, y2:175}`

Apps must use `Bangle.appRect` for layout calculations to properly account for this offset.

### Touch Coordinates

Touch event coordinates are in **absolute screen coordinates** (0-175 for both x and y).
To convert to app-relative coordinates:
```javascript
const appX = touchX - Bangle.appRect.x;
const appY = touchY - Bangle.appRect.y;
```

### Emulator Limitations

The emulator may not fully support all Bangle.js features:
- Some `Bangle.setUI()` callbacks may need testing on real hardware
- Bluetooth features are not available
- GPS and sensors are simulated or unavailable

## Troubleshooting

### "Cannot find module" errors

Make sure you've cloned EspruinoWebIDE in the emulator directory:
```bash
cd emulator && git clone https://github.com/espruino/EspruinoWebIDE
```

### "Jimp is not a constructor" error

Install the correct jimp version from the workspace root:
```bash
npm install jimp@0.22.12
```

### Screenshots are blank

Wait longer after loading the app before taking screenshots, or check that the app's `draw()` function is being called.

## Files

- `test-quicktimer.js` - Automated test for the quicktimer app
- `test-touch-coords.js` - Debug script to check coordinate system
- `screenshots/` - Output directory for generated screenshots
- `EspruinoWebIDE/` - Espruino Web IDE (git clone, not tracked)

## References

- [Espruino Forums](https://forum.espruino.com/)
- [Bangle.js Documentation](https://www.espruino.com/Bangle.js)
- [BangleApps Repository](https://github.com/espruino/BangleApps)
