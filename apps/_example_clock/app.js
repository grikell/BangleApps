{
  // timeout used to update every minute
  let drawTimeout;

  // schedule a draw for the next minute
  let queueDraw = function() {
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = setTimeout(function() {
      drawTimeout = undefined;
      draw();
    }, 60000 - (Date.now() % 60000));
  };

  let draw = function() {
    // queue next draw in one minute
    queueDraw();
    // Work out where to draw...
    var x = g.getWidth()/2;
    var y = g.getHeight()/2;
    g.reset();
    // work out locale-friendly date/time
    var date = new Date();
    var timeStr = require("locale").time(date,1);
    var dateStr = require("locale").date(date);
    // draw time
    g.setFontAlign(0,0).setFont("Vector",48);
    g.clearRect(0,y-20,g.getWidth(),y+25); // clear the background
    g.drawString(timeStr,x,y);
    // draw date
    y += 30;
    g.setFontAlign(0,0).setFont("6x8");
    g.clearRect(0,y-4,g.getWidth(),y+4); // clear the background
    g.drawString(dateStr,x,y);
  };

  // Clear the screen once, at startup
  g.clear();
  // draw immediately at first, queue update
  draw();

  // Show launcher when middle button pressed
  Bangle.setUI({mode:"clock", remove:function() {
    // free any memory we allocated to allow fast loading
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = undefined;
  }});
  // Load widgets
  Bangle.loadWidgets();
  Bangle.drawWidgets();
}