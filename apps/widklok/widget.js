WIDGETS["widklok"] = { area:"tl", width: 36, draw: function() {
  var date = new Date();
  var timeStr = require("locale").time(date, 1);
  g.reset().setColor(g.theme.dark ? "#fff" : "#000").setFont("Vector", 13);
  g.drawString(timeStr, this.x+2, this.y+2, true);
  if (this.drawTimeout) clearTimeout(this.drawTimeout);
  this.drawTimeout = setTimeout(()=>{
    this.drawTimeout = undefined;
    this.draw();
  }, 60000 - (Date.now() % 60000));
} };