{
  let drawTimeout;
  let extrasTimeout;
  let onLock;
//  let onTap;
//  let onTwist;

  let libs=require('contourclock2');

  let LOG=function() {  
//    print.apply(null, arguments);
  };
  
    
  let settings = require('Storage').readJSON("contourclock2.json", true) || {};
  if (settings.fontIndex == undefined) {
    settings.fontIndex = 0;
    settings.widgets = true;
    settings.weekday = true;
    settings.hideWhenLocked = false;
    settings.tapToShow = false;
    settings.twistToShow = false;
    settings.date = true;
    settings.col1=g.theme.fg;
    settings.col2=g.theme.fg;
    settings.col3=g.theme.fg;
    settings.col4=g.theme.fg;
    settings.dotsCol=g.theme.fg;
    require('Storage').writeJSON("contourclock2.json", settings);
  }
  require("FontTeletext10x18Ascii").add(Graphics);
  let extrasShown = (!settings.hidewhenlocked) && (!Bangle.isLocked());
  let installedFonts = require('Storage').readJSON("contourclock-install.json") || {};
  if (installedFonts.n > 0) { //New install - check for unused font files
    settings.fontIndex = E.clip(settings.fontIndex, -installedFonts.n + 1, installedFonts.n - 1);
    require('Storage').writeJSON("contourclock2.json", settings);
    for (let n = installedFonts.n;; n++) {
      if (require("Storage").read("contourclock-" + n + ".json") == undefined) break;
      require("Storage").erase("contourclock-" + n + ".json");
    }
    require("Storage").erase("contourclock-install.json");
  }
  let showExtras = function() { //show extras for a limited time
    LOG("showExtras");
    drawExtras();
    if (extrasTimeout) clearTimeout(extrasTimeout);
    extrasTimeout = setTimeout(() => {
      extrasTimeout = undefined;
      hideExtras();
    }, 5000);
    extrasShown = false;
  };
  let drawExtras = function() { //draw date, day of the week and widgets
    LOG("drawExtras");
    let date = new Date();
    g.reset();
    g.clearRect(0, 138, g.getWidth() - 1, 176);
    g.setFont("Teletext10x18Ascii").setFontAlign(0, 1);
    if (settings.weekday) g.drawString(require("locale").dow(date).toUpperCase(), g.getWidth() / 2, g.getHeight() - 18);
    if (settings.date) g.drawString(require('locale').date(date, 1), g.getWidth() / 2, g.getHeight());
    LOG("showUtils");
    require("widget_utils").show();
    extrasShown = true;
  };
  let hideExtras = function() {
    LOG("hideExtras");
    if (extrasTimeout) clearTimeout(extrasTimeout);
    extrasTimeout = undefined; //NEW
    g.reset();
    g.clearRect(0, 138, g.getWidth() - 1, 176);
    LOG("hideutils");
    require("widget_utils").hide();
    extrasShown = false; ///NEW
  };

  let D = libs.getDigits(settings.fontIndex);
  let digits=D.digits;
  let draw = function() {
    LOG("draw-1");
    if (drawTimeout) clearTimeout(drawTimeout); //NEW
    drawTimeout = setTimeout(function() {
      drawTimeout = undefined;
      draw();
    }, 60000 - (Date.now() % 60000));
//    let date = new Date();
    g.reset();
    if (extrasShown) drawExtras();
    else hideExtras();
    libs.drawClock(settings,digits);
  };
  if (settings.hideWhenLocked) {
    onLock = locked => {
      if (!locked) {
	LOG("showwidgets");
        require("widget_utils").show();
        drawExtras();
      } else {
	LOG("hidewidgets");
        require("widget_utils").hide();
        hideExtras();
      }
    };
    Bangle.on('lock', onLock);
    if (settings.tapToShow) Bangle.on('tap', showExtras);
    if (settings.twistToShow) Bangle.on('twist', showExtras);
  }
  Bangle.setUI({
    mode: "clock",
    remove: function() {
      Bangle.removeListener('lock', onLock);
      Bangle.removeListener('tap', showExtras);
      Bangle.removeListener('twist', showExtras);
      if (drawTimeout) clearTimeout(drawTimeout);
      if (extrasTimeout) clearTimeout(extrasTimeout);
      drawTimeout = undefined;
      extrasTimeout = undefined;
      if (settings.hideWhenLocked) {
	LOG("hidewidgets");
        require("widget_utils").hide();
      }
      g.reset();
      g.clear();
    }
  });
  g.clear();
  if (settings.widgets) {
    Bangle.loadWidgets();
    // setTimeout(Bangle.drawWidgets,0); //NEW
    Bangle.drawWidgets(); 
  }
  draw();
}
