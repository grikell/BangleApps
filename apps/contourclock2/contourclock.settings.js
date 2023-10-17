(function(back) {
  Bangle.setUI("");
  var settings = require('Storage').readJSON('contourclock2.json', true) || {};
  if (settings.fontIndex==undefined) {
    settings.fontIndex=0;
    settings.widgets=true;
    settings.weekday=true;
    settings.date=true;
    settings.hideWhenLocked=false;
    settings.tapToShow=false;
    settings.twistToShow=false;
    settings.col1="#fff";
    settings.col2="#fff";
    settings.col3="#fff";
    settings.col4="#fff";
    settings.dotsCol="#fff";
    require('Storage').writeJSON("contourclock2.json", settings);
  }

  let color_options = ['Green', 'Orange', 'Cyan', 'Gray', 'Red', 'Blue', 'Black', 'White'];
  let color_code = ['#0f0', '#ff0', '#0ff', '#888', '#f00', '#00f', '#000', '#fff'];

  function mainMenu() {
    E.showMenu({
      "" : { "title" : "ContourClock" },
      "< Back" : () => back(),
      'Widgets': {
        value: (settings.widgets !== undefined ? settings.widgets : true),
        onchange : v => {settings.widgets=v; require('Storage').writeJSON('contourclock2.json', settings);}
      },
      'Weekday': {
        value: (settings.weekday !== undefined ? settings.weekday : true),
        onchange : v => {settings.weekday=v; require('Storage').writeJSON('contourclock2.json', settings);}
      },
      'Date': {
        value: (settings.date !== undefined ? settings.date : true),
        onchange : v => {settings.date=v; require('Storage').writeJSON('contourclock2.json', settings);}
      },
      'Hide widgets, weekday and date when locked': {
        value: (settings.hideWhenLocked !== undefined ? settings.hideWhenLocked : false),
        onchange : v => {settings.hideWhenLocked=v; require('Storage').writeJSON('contourclock2.json', settings);}
      },
      'Tap to show': {
        value: (settings.tapToShow !== undefined ? settings.tapToShow : false),
        onchange : v => {settings.tapToShow=v; require('Storage').writeJSON('contourclock2.json', settings);}
      },
      'Twist to show': {
        value: (settings.twistToShow !== undefined ? settings.twistToShow : false),
        onchange : v => {settings.twistToShow=v; require('Storage').writeJSON('contourclock2.json', settings);}
      },
      '1st Digit': {
        value: color_code.indexOf(settings.col1),
        min:0, max:7,
        format: v => color_options[v],
        onchange: v => {settings.col1=color_code[v]; require('Storage').writeJSON('contourclock2.json', settings);}
      },
      '2nd Digit': {
        value: color_code.indexOf(settings.col2),
        min:0, max:7,
        format: v => color_options[v],
        onchange: v => {settings.col2=color_code[v]; require('Storage').writeJSON('contourclock2.json', settings);}
      },
      '3rd Digit': {
        value: color_code.indexOf(settings.col3),
        min:0, max:7,
        format: v => color_options[v],
        onchange: v => {settings.col3=color_code[v]; require('Storage').writeJSON('contourclock2.json', settings);}
      },
      '4th Digit': {
        value: color_code.indexOf(settings.col4),
        min:0, max:7,
        format: v => color_options[v],
        onchange: v => {settings.col4=color_code[v]; require('Storage').writeJSON('contourclock2.json', settings);}
      },
      'Dots Color': {
        value: color_code.indexOf(settings.dotsCol),
        min:0, max:7,
        format: v => color_options[v],
        onchange: v => {settings.dotsCol=color_code[v]; require('Storage').writeJSON('contourclock2.json', settings);}
      },
      'set Font': () => fontMenu() 
    });
  }

  function fontMenu() {
    Bangle.setUI("");
    savedIndex=settings.fontIndex;
    saveListener = setWatch(function() {          //save changes and return to settings menu
      require('Storage').writeJSON('contourclock2.json', settings);
      Bangle.removeAllListeners('swipe');
      Bangle.removeAllListeners('lock');
      mainMenu();
    }, BTN, { repeat:false, edge:'falling' });
    lockListener = Bangle.on('lock', function () { //discard changes and return to clock
      settings.fontIndex=savedIndex;
      require('Storage').writeJSON('contourclock2.json', settings);
      Bangle.removeAllListeners('swipe');
      Bangle.removeAllListeners('lock');
      mainMenu();
    });
    swipeListener = Bangle.on('swipe', function (direction) {
      let D = require('contourclock2').getDigits(settings.fontIndex+direction);
      let fontName=D.fname;
      let digits1=D.digits;
      if (fontName) {
        settings.fontIndex+=direction;
        require('contourclock2').drawClock(settings, digits1);
        g.clearRect(0,g.getHeight()-36,g.getWidth()-1,g.getHeight()-36+16);
        g.setFont('6x8:2x2').setFontAlign(0,-1).drawString(fontName,g.getWidth()/2,g.getHeight()-36);
      } else {
        let D = require('contourclock2').getDigits(settings.fontIndex);
        let digits=D.digits;        
        require('contourclock2').drawClock(settings,digits);
      }
    });
    g.reset();
    g.clearRect(0,24,g.getWidth()-1,g.getHeight()-1);
    g.setFont('6x8:2x2').setFontAlign(0,-1);
    let D = require('contourclock2').getDigits(settings.fontIndex);
    let fontName=D.fname;
    let digits=D.digits;
    require('contourclock2').drawClock(settings,digits);
    g.drawString(fontName,g.getWidth()/2,g.getHeight()-36);
    g.drawString('Button to save',g.getWidth()/2,g.getHeight()-18);
  }
  mainMenu();
})
