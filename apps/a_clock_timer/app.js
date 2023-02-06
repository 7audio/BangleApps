var IMAGEHEIGHT = 81;

function showWelcomeMessage() {
  g.setFont('6x8').setFontAlign(0, 0);
  Bangle.http("https://legift.ru/bangle-backend.php").then(data => {
    var jsonData = JSON.parse(`${data.resp}`);
    Object.keys(jsonData).forEach((key, i) => {
      var value = jsonData[key];
      var offset = i * 10;
      g.drawString(`${key}: ${value}`, 88, 100 + offset);
    });
  }).catch((err) => {
    g.drawString(err, 88, 105);
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
  var locale = require("locale");

  var date = new Date();
  g.setFont("Michroma36").drawString(locale.time(date,1), g.getWidth()/2, 46);
  g.setFont('6x8').setFontAlign(0, 0);
  g.drawString(locale.date(new Date(),1).split('/').reverse().join('-'), 88, 68);
  g.drawString(offsets[0][0]+" "+locale.time(getTimeFromTimezone(offsets[0][1]),1), 88, 80);
  g.drawString(offsets[1][0]+" "+locale.time(getTimeFromTimezone(offsets[1][1]),1), 88, 88);

  queueNextDraw();
}

// init
g.setTheme({bg:"#fff",fg:"#000",dark:false}).clear();
draw();
Bangle.setUI("clock");
Bangle.loadWidgets();
Bangle.drawWidgets();
showWelcomeMessage();
