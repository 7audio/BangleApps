let SEARCH_ID = 'c7:7d';
let TIMEOUT = 8000;

function out(msg) {
  console.log(msg);
  E.showMessage(msg);
}

function refreshFindPuck() {
  out("Started looking for " + SEARCH_ID);
  setTimeout(() => out("Looking for " + SEARCH_ID), 100);
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
  var gatt;
  NRF.findDevices(function(d) {
    console.log(d);
    const thePuckINeed = d.find(device => (device.id && device.id.includes(SEARCH_ID)));
    if (!thePuckINeed) {
      out("Cant not find");
      return;
    };
    thePuckINeed.gatt.connect()
      .then(function(g) {
        out("Connected " + SEARCH_ID);
        gatt = g;
        return gatt.getPrimaryService("3e440001-f5bb-357d-719d-179272e4d4d9");
      }).then(function(service) {
        out("Got service");
        return service.getCharacteristic("3e440002-f5bb-357d-719d-179272e4d4d9");
      }).then(function(characteristic) {
        out("Got characteristic");
        return characteristic.readValue();
      }).then(function(d) {
        out("Done! " + JSON.stringify(d.buffer));
        console.log("Done!", JSON.stringify(d.buffer));
        gatt.disconnect();
        const timestamps = uint8ArrayToTimestamps(d.buffer);
        if (timestamps && timestamps.length > 0 && !(timestamps.length === 1 && timestamps[0] === 0)) {
          let dateTimes = timestamps.map(timestamp => new Date(timestamp * 1000).toISOString());
          out(dateTimes.join('\n'));
          sendTimestamps(dateTimes.join('\n'));
        } else {
          out("Timestamps not found");
        }
      })
      .catch(function(err) {
        out("Error: " + err);
      });
  }, 3500);
}

refreshFindPuck();

setWatch(() => {
  refreshFindPuck();
}, BTN1, { edge: 'rising', repeat: true, debounce: 50 });