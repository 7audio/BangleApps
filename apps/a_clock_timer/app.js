// assets
function getImg() {
  return require("heatshrink").decompress(atob("2FRgP/ABnxBRP5BJH+gEfBZHghnAv4JFmA+Bj0PBIn3//4h3An4oDAQJWEEIf8AwMEuFOCofAh/QjAWEg4VEwEAnw2DDoKEHEYPwAoUBmgrDhgUHS4XgAwUD/gVC/g+FAAZgEwEf4YqC/EQFQ4NDFgV/4Z3C/EcCo1974VCLAV/V4d7Co9/Co0PCoX+vk4Ko/HCosCRYX5nwTFkEAr/nCokICoL+B/aCGCoMHCoq3EdoraGCosPz4HBcILEJCocBwEHOwQrIgQrHgoHCFYMEgwVJYoMBsEnCofAnkMNQJXH4D4EbQMPkF/xwrEj+/HIkAoAVDj8QueHCoorDCoUDLwd96J0BKwgrHh4VDv+9CosDx6QCCo4HB//8VwvvXgQVDJIYSBCo/sBwaZBgF/NoYVHgH8V4qYDAwUYlAVFEYbFDDgwAGConogf9Zg8DCpP4cIh0Dg0BGAgVE+gVIgUA+AVI+wVE/xAEh5HDEgn+CpEAbgJCCHQoVBn4VJ/ED4ANDAAQVJ4EPPQPAt4VF4BeDColgj/8h/gFYwJBCpF//k//ANDCAYVIcgP+CpH/54VHCAIVB/4VIwYECCocIAwIVBx4VG9+AMITbCYAYJB34VG/UAj4VI7/9Cgw9CJYXAmBtDMAQsIfYhvCCofyvywGB4QFFgYGC/d+agYVLSgf8+ArG/APBD4QVBgh0CAwNwv/fCo4PCCo94s7VDCohnDAoI7Enlv8BZECoRCDAggAB3/3/gzDMAIVFY4IVE4IPBOoZ9DCpXwCoMvCqKxB//3bYywD4BtFAAPfDooVFFYIVGw4VFB4KZFngNE/uPCovgFYgEBuK+Fg4zFCoIrFCovwgQVF+AVFgPxEYzFEbgQVD4EDCoozBYogVCgYVE8bpGCo4HDCoPzBgoVIL4fAg4MGgAIHCofgCszND8BOHK4x2BCofwXgv4h6vGCps/Co6uDAA/7RgIjDDwTaDABPA//9FaAtDCop0FC5YVDLwoAH8//94GD/wVNCYKNECpwPBQggVPNggVBNp4VFFZwAGCquHCqnzCB4"));
}

var IMAGEHEIGHT = 81;

Graphics.prototype.setFontMichroma36 = function() {
g.setFontCustom(atob("AAAAAAAAAAAAAAAAeAAAAAeAAAAAeAAAAAeAAAAAAAAAAAAAAAAAAAAAAAGAAAAA+AAAAD+AAAAP+AAAA/8AAAD/wAAAf/AAAB/4AAAH/gAAAf+AAAB/4AAAH/gAAAf+AAAAfwAAAAfAAAAAcAAAAAAAAAAAAAAAAAAAAAAAA///AAD///wAH///4AP///8APwAD+APAAAeAeAAAeAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAPAeAAAeAPAAAeAPwAD+AP///8AH///4AD///wAA///AAAAAAAAAAAAAAAAAAAAAEAAAAAOAAAAAfAAAAA+AAAAB8AAAAD8AAAAH4AAAAPwAAAAPgAAAAfAAAAAf///+Af///+Af///+Af///+AAAAAAAAAAAAAAAAAAAAAAAAAA/Af+AD/A/+AH/B/+AP/D/+APwD4eAPADweAfADweAeADweAeADweAeADweAeAHgeAeAHgeAeAHgeAeAHgeAeAHgeAeAHgeAeAHgeAeAHgeAeAHgeAeAHgeAeAPgeAeAPAeAeAPAeAeAPAeAeAPAeAfAPAeAPw/AeAP/+AeAH/+AeAD/8AeAB/wAOAAAAAAAAAAAAAAAAAAAAAAAAAB8APgAD8AP4AH8AP8AP8AP8APgAB+AfAAAeAeAAAeAeAAAPAeAAAPAeAAAPAeAAAPAeAeAPAeAeAPAeAeAPAeAeAPAeAeAPAeAeAPAeAeAPAeAeAPAeAeAPAeAeAPAeAeAPAeAeAPAeAeAPAeAeAeAfAeAeAPx/h+AP///+AH///8AD///4AB/h/gAAAAAAAAAAAAAAAAAAAAAAeAAAAA/AAAAA/AAAAB/AAAAD/AAAAH/AAAAPvAAAAPPAAAAfPAAAA+PAAAB8PAAAD4PAAADwPAAAHwPAAAPgPAAAfAPAAA+APAAA8APAAB8APAAD4APAAHwAPAAPgAPAAPAAPAAfAAPAAf///+Af///+Af///+Af///+AAAAPAAAAAPAAAAAPAAAAAPAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAf/8PgAf/8P4Af/8P8Af/8P8AeB4A+AeB4AeAeDwAeAeDwAPAeDwAPAeDwAPAeDwAPAeDwAPAeDwAPAeDwAPAeDwAPAeDwAPAeDwAPAeDwAPAeDwAPAeDwAPAeDwAPAeDwAPAeDwAPAeDwAfAeDwAeAeD4A+AeD+D+AeB//8AeB//4AeA//4AAAP/AAAAAAAAAAAAAAAAAAAAAAAAAAA///AAD///wAH///4AH///8AP4fB+APAeAeAfA8AeAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAfA8APAPA+AeAPgeAeAP8fh+AH8f/8AD8P/8AA8H/4AAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAeAAAAAeAAAAAeAAAAAeAAAAAeAAAAAeAAACAeAAAGAeAAAOAeAAAeAeAAA+AeAAD+AeAAH8AeAAP4AeAAfwAeAA/gAeAB/AAeAD+AAeAP4AAeAfwAAeA/gAAeB/AAAeD+AAAeH8AAAefwAAAe/gAAAf/AAAAf+AAAAf8AAAAf4AAAAfgAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAMAAB+B/wAD/j/4AH/3/8AP///+AP//A+AfB+AeAeA+AeAeA+APAeA+APAeA+APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA8APAeA+APAeA+APAeA+APAeA+AOAeA+AeAPh/A+AP///+AP/3/8AH/3/8AB/D/wAAAA/AAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAD/4HAAH/8HwAP/+H4AP5/H8AfAfA8AeAPAeAeAPAeAeAPAeAeAHgfAeAHgPAeAHgPAeAHgPAeAHgPAeAHgPAeAHgPAeAHgPAeAHgPAeAHgPAeAHgPAeAHgPAeAHgPAeAHAPAeAPAOAeAPAeAPAPAeAPwfB+AP///8AH///4AD///wAA///AAAAAAAAAAAAAAAAAAAAAAAAAAAB8DwAAB8HwAAB8HwAAB8DwAAAAAAAAAAAAA"), 46, atob("CBIkESMjJCMjIyMjCA=="), 36+(1<<8)+(1<<16));
};

Graphics.prototype.setFontMichroma16 = function(scale) {
g.setFontCustom(atob("AAAAGAAYAAAAGAB4A/APwD4AeADgAAAAAAA/8H/4YBjAGMAcwBzAHMAcwBzAHMAYYBh/+D/wAAAAABgAOABwAGAA//h/+AAAAAA4+Hn4YZjhmMOYw5jDmMMYwxjDGOMYYxh/GD4YAAAAADBwcHhgGOAYwBzHHMccxxzHHMcc5xhnGH/4PfAAAAAAAOAB4APgB2AGYAxgHGA4YDBgYGD/+P/4AOAAYAAAAAD+cP547BjsGOwc7BzsHOwc7BzsHOwY7zjv+APgAAAAAD/wf/hmGOYYxhzGHMYcxhzGHOYYZhh3uDP4AeAAAEAA4ADgAOAI4DjgeODw4eDjgOcA7gD8APgA8AAAAAAAAAA58H/4bxjmGMYcxhzGHMYcxhzGHOYYbxh/+DnwAAAAADxgfnBnOOMYwxjDHMMcwxzDHMMY4xhjOH/4P/AAAAAABnAGcAAA"), 46, atob("BAgQCBAQEBAQEBAQBA=="), 16+(scale<<8)+(1<<16));
};

function showWelcomeMessage() {
  g.reset().clearRect(0, 76, 44+44, g.getHeight()/2+6);
  g.setFontAlign(0, 0).setFont("6x8");
  g.drawString(`version 3`, 44, 90);
  Bangle.http("https://api.waqi.info/feed/Bangkok/?token=baf1c562ecda746eff772626b2ed246e8a66ffa3").then(data => {
    var aqiStatuses = `0-50\tGood
51-100\tModerate
101-150\tUnhealthy for Sensitive
151-200\tUnhealthy
201-300\tVery Unhealthy
300-999999\tHazardous`;
    var readableStatus = aqiStatuses.split("\n").find(statusLine => {
      var aqiRange = statusLine.split("\t")[0].split("-");
      return data.data.aqi >= aqiRange[0] && data.data.aqi <= aqiRange[1];
    }) || "0\tUnknown";
    var data = JSON.parse(data.resp);
    g.setFont('6x8').setFontAlign(0, 0);
    g.drawString(readableStatus.split("\t")[1], 44, 80);
    g.drawString(`PM2.5: ${data.data.iaqi.pm25.v}`, 44, 70);
  }).catch((err) => {
    g.drawString(err, 44, 75);
  });
}

// time
var offsets = require("Storage").readJSON("a_clock_timer.settings.json") || [ ["PAR",1], ["TYO",9] ];
var drawTimeout;

function getGmt() {
  var d = new Date();
  var gmt = new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
  return gmt;
}

function getTimeFromTimezone(offset) {
  return new Date(getGmt().getTime() + offset * 60 * 60 * 1000);
}

function queueNextDraw() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    draw();
  }, 60000 - (Date.now() % 60000));
}

function draw() {
  g.reset().clearRect(0,24,g.getWidth(),g.getHeight()-IMAGEHEIGHT);
  // g.drawImage(getImg(),0,g.getHeight()-IMAGEHEIGHT);

  var gmtHours = getGmt().getHours();

  var x_sun = 176 - (gmtHours / 24 * 176 + 4);
  g.setColor('#ff0').drawLine(x_sun, g.getHeight()-IMAGEHEIGHT, x_sun, g.getHeight());
  g.reset();

  var x_night_start = (176 - (((gmtHours-6)%24) / 24 * 176 + 4)) % 176;
  var x_night_end = 176 - (((gmtHours+6)%24) / 24 * 176 + 4);
  g.setColor('#000');
  for (let x = x_night_start; x < (x_night_end < x_night_start ? 176 : x_night_end); x+=2) {
    g.drawLine(x, g.getHeight()-IMAGEHEIGHT, x, g.getHeight());
  }
  if (x_night_end < x_night_start) {
    for (let x = 0; x < x_night_end; x+=2) {
      g.drawLine(x, g.getHeight()-IMAGEHEIGHT, x, g.getHeight());
    }
  }

  var locale = require("locale");

  var date = new Date();
  g.setFontAlign(0,0);
  g.setFont("Michroma36").drawString(locale.time(date,1), g.getWidth()/2, 46);
  g.setFont("6x8");
  g.drawString(locale.date(new Date(),1), 125, 68);
  g.drawString(offsets[0][0]+" "+locale.time(getTimeFromTimezone(offsets[0][1]),1), 125, 80);
  g.drawString(offsets[1][0]+" "+locale.time(getTimeFromTimezone(offsets[1][1]),1), 125, 88);

  queueNextDraw();
}

// init
g.setTheme({bg:"#fff",fg:"#000",dark:false}).clear();
draw();
Bangle.setUI("clock");
Bangle.loadWidgets();
Bangle.drawWidgets();
showWelcomeMessage();
