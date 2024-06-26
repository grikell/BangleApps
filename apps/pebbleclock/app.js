const locale = require("locale");
const storage = require('Storage');

const is12Hour = (storage.readJSON("setting.json", 1) || {})["12hour"];

let color;
var c = storage.readJSON("pebbleclock.json", 1);
if (c == undefined) {
  color=g.theme.fg;
}
else {
  color=c.color;
}

const light = {
    'White': 65535,
    'Yellow': 65504,
    'Cyan' : 2047,
    'Green': 2016,
};

const dark = {
    'Red': 63488,
    'Blue': 31,
    'Black':0,
    'Random':-1,
};

const colors = Object.assign({}, light, dark);
var cols=Object.keys(colors);
var idx=0;
var lightv=false;  

function nextcolor() {
  color=colors[cols[idx]];
  if (color<0) {
    idx=0;
    color=colors[cols[idx]];
  }
  idx +=1;
}

function setbg() {
  lightv=false;
  Object.keys(light).forEach(function(k) { if (light[k] == color) lightv=true;});
  if (!g.theme.dark) lightv = !lightv;
}

var flg=false;
if (color==9999) {
  flg=true;
  nextcolor();
}

setbg();


/* Clock *********************************************/
const scale = g.getWidth() / 176;

const screen = {
  width: g.getWidth(),
  height: g.getHeight() - 24,
};

const center = {
  x: screen.width / 2,
  y: screen.height / 2,
};

function d02(value) {
  return ('0' + value).substr(-2);
}

function renderEllipse(g) {
  g.fillEllipse(center.x + 25 * scale, center.y - 70 * scale, center.x + 160 * scale, center.y + 90 * scale);
}

function renderText(g) {
  const now = new Date();

  const hour = d02(now.getHours() - (is12Hour && now.getHours() > 12 ? 12 : 0));
  const minutes = d02(now.getMinutes());
  const day = d02(now.getDate());
//  const month = d02(now.getMonth() + 1);
  const year = now.getFullYear();

  const month2 = locale.month(now, 3);
  const day2 = locale.dow(now, 3);

  g.setFontAlign(1, 0).setFont("Vector", 90 * scale);
  g.drawString(hour, center.x + 32 * scale, center.y - 31 * scale);
  g.drawString(minutes, center.x + 32 * scale, center.y + 46 * scale);

  g.setFontAlign(1, 0).setFont("Vector", 28 * scale);
  g.drawString(day2, center.x + 88 * scale, center.y - 20 * scale);
  g.drawString(day, center.x + 88 * scale, center.y + 5 * scale);
  g.drawString(month2, center.x + 88 * scale, center.y + 25 * scale);
}

const buf = Graphics.createArrayBuffer(screen.width, screen.height, 1, {
  msb: true
});

function draw() {

  const fgcolor=g.theme.fg;

  const img = {
    width: screen.width,
    height: screen.height,
    transparent: 0,
    bpp: 1,
    buffer: buf.buffer
  };

  // cleat screen area
  g.clearRect(0, 24, g.getWidth(), g.getHeight());
  buf.clear();
  
  if (flg) {
    nextcolor();
    setbg();
  }
  
  // render outside text with ellipse
  if (!lightv) {
    renderEllipse(buf.setColor(0));
    renderText(buf.setColor(1));
  }
  else {
    renderText(buf.setColor(1));
    renderEllipse(buf.setColor(0));
  }
  g.setColor(fgcolor).drawImage(img, 0, 24);

  // render ellipse with inside text
  buf.clear();
  renderEllipse(buf.setColor(1));
  renderText(buf.setColor(0));
  g.setColor(color).drawImage(img, 0, 24);
}


/* Minute Ticker *************************************/

let ticker;

function stopTick() {
  if (ticker) {
    clearTimeout(ticker);
    ticker = undefined;
  }
}

function startTick(run) {
  stopTick();
  run();
  ticker = setTimeout(() => startTick(run), 60000 - (Date.now() % 60000));
  // ticker = setTimeout(() => startTick(run), 3000);
}

/* Init **********************************************/

g.clear();
startTick(draw);

Bangle.on('lcdPower', (on) => {
  if (on) {
    startTick(draw);
  } else {
    stopTick();
  }
});

Bangle.setUI("clock");

Bangle.loadWidgets();
Bangle.drawWidgets();

