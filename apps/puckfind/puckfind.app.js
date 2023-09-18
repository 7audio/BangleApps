let SEARCH_NAME = 'Puck.js ebbc';
let TIMEOUT = 8000;

function out(msg) {
  console.log(msg);
  E.showMessage(msg);
}

function refreshFindPuck() {
  out("Started looking for " + SEARCH_NAME);
  setTimeout(() => out("Looking for " + SEARCH_NAME), 100);
  setTimeout(() => findPuck(), 200);
}

function uint8ArrayToTimestamps(byteArray) {
  if (!byteArray || byteArray.length === 0) return null;
  const buffer = byteArray;
  const view = new DataView(buffer);
  const timestamps = [];

  for (let i = 0; i < byteArray.length; i += 4) {
    timestamps.push(view.getUint32(i, true)); // 'true' is for little-endian
  }

  return timestamps;
}

function sendTimestamps(text) {
  Bangle.http("https://legift.ru/puckfind.php?message=" + btoa(text)).then(data => {
    out('Sent');
  }).catch((err) => {
    out('Error when sending');
    setTimeout(() => out(err), 750);
  });
}

function findPuck() {
  NRF.findDevices((devices) => {
    let puck = devices.find(device => (device.name && device.name === SEARCH_NAME));
    if (puck) {
      out("Found " + SEARCH_NAME);
      let timestamps = uint8ArrayToTimestamps(puck.manufacturerData);
      if (timestamps && timestamps.length > 0) {
        let dateTimes = timestamps.map(timestamp => new Date(timestamp * 1000).toISOString());
        out(dateTimes.join('\n'));
        sendTimestamps(dateTimes.join('\n'));
      } else {
        out("Timestamps not found");
      }
    } else {
      out(SEARCH_NAME + " not found");
    }
  }, { timeout: TIMEOUT });
}

refreshFindPuck();

setWatch(() => {
  refreshFindPuck();
}, BTN1, { edge: 'rising', repeat: true, debounce: 50 });
