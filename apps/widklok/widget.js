WIDGETS["widklok"] = { area:"tr", width:16, draw: function() {
  var date = new Date();
  var timeStr = require("locale").time(date, 1).split(":"); // Hour and minute
  g.reset().setColor(g.theme.dark ? "#0ff" : "#00f").setFont("6x8", 1);
  g.drawString(timeStr[0], this.x+2, this.y+4, true);
  g.drawString(timeStr[1], this.x+2, this.y+14, true);
} };

if (this.klokDroTimeout) clearTimeout(this.klokDroTimeout);
this.klokDroTimeout = setTimeout(()=>{
  this.klokDroTimeout = undefined;
  this.draw();
}, 60000 - (Date.now() % 60000));
