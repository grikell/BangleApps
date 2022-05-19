// Load fonts
require("Font7x11Numeric7Seg").add(Graphics);
// position on screen
var R = Bangle.appRect;

var MEDIANLENGTH = 30;
var INTERVAL=10000;
var avr = [], median;

var ascent=0, descent=0;
var oldv=-999;

var y = R.y + R.h/2;

const green=2016;
const cyan=2047;

let settings = require('Storage').readJSON('alticlock.json',1)||{};

var zero = 0;
var filt=true;
var delta=1;

if (typeof settings.offset == "number") zero = -settings.offset;
if (typeof settings.filt == "boolean") filt=settings.filt;
if (typeof settings.delta == "number") delta=settings.delta;


/*kalmanjs, Wouter Bulten, MIT, https://github.com/wouterbulten/kalmanjs */
var KalmanFilter = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
  * KalmanFilter
  * @class
  * @author Wouter Bulten
  * @see {@link http://github.com/wouterbulten/kalmanjs}
  * @version Version: 1.0.0-beta
  * @copyright Copyright 2015-2018 Wouter Bulten
  * @license MIT License
  * @preserve
  */
  var KalmanFilter =
  /*#__PURE__*/
  function () {
    /**
    * Create 1-dimensional kalman filter
    * @param  {Number} options.R Process noise
    * @param  {Number} options.Q Measurement noise
    * @param  {Number} options.A State vector
    * @param  {Number} options.B Control vector
    * @param  {Number} options.C Measurement vector
    * @return {KalmanFilter}
    */
    function KalmanFilter() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$R = _ref.R,
          R = _ref$R === void 0 ? 1 : _ref$R,
          _ref$Q = _ref.Q,
          Q = _ref$Q === void 0 ? 1 : _ref$Q,
          _ref$A = _ref.A,
          A = _ref$A === void 0 ? 1 : _ref$A,
          _ref$B = _ref.B,
          B = _ref$B === void 0 ? 0 : _ref$B,
          _ref$C = _ref.C,
          C = _ref$C === void 0 ? 1 : _ref$C;

      _classCallCheck(this, KalmanFilter);

      this.R = R; // noise power desirable

      this.Q = Q; // noise power estimated

      this.A = A;
      this.C = C;
      this.B = B;
      this.cov = NaN;
      this.x = NaN; // estimated signal without noise
    }
    /**
    * Filter a new value
    * @param  {Number} z Measurement
    * @param  {Number} u Control
    * @return {Number}
    */


    _createClass(KalmanFilter, [{
      key: "filter",
      value: function filter(z) {
        var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (isNaN(this.x)) {
          this.x = 1 / this.C * z;
          this.cov = 1 / this.C * this.Q * (1 / this.C);
        } else {
          // Compute prediction
          var predX = this.predict(u);
          var predCov = this.uncertainty(); // Kalman gain

          var K = predCov * this.C * (1 / (this.C * predCov * this.C + this.Q)); // Correction

          this.x = predX + K * (z - this.C * predX);
          this.cov = predCov - K * this.C * predCov;
        }

        return this.x;
      }
      /**
      * Predict next value
      * @param  {Number} [u] Control
      * @return {Number}
      */

    }, {
      key: "predict",
      value: function predict() {
        var u = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        return this.A * this.x + this.B * u;
      }
      /**
      * Return uncertainty of filter
      * @return {Number}
      */

    }, {
      key: "uncertainty",
      value: function uncertainty() {
        return this.A * this.cov * this.A + this.R;
      }
      /**
      * Return the last filtered measurement
      * @return {Number}
      */

    }, {
      key: "lastMeasurement",
      value: function lastMeasurement() {
        return this.x;
      }
      /**
      * Set measurement noise Q
      * @param {Number} noise
      */

    }, {
      key: "setMeasurementNoise",
      value: function setMeasurementNoise(noise) {
        this.Q = noise;
      }
      /**
      * Set the process noise R
      * @param {Number} noise
      */

    }, {
      key: "setProcessNoise",
      value: function setProcessNoise(noise) {
        this.R = noise;
      }
    }]);

    return KalmanFilter;
  }();

  return KalmanFilter;

}());



Bangle.setBarometerPower(true, "app");
// Clear the screen once, at startup
g.clear(1);

var altFilter = new KalmanFilter({R: 0.01, Q: 2 });
var altitude;

function getAlt(e) {
  var alt=e.altitude;
  while (avr.length>MEDIANLENGTH) avr.pop();
  if (filt) altitude=altFilter.filter(alt);
  else altitude=alt;
  avr.unshift(altitude);
//  console.log(alt+' '+altitude);
}

function drawalt(flg) {
  var v1=0;
  
  if (avr.length>1) {
    v1=Math.round(E.sum(avr)/avr.length);
    if (oldv!=-999) {
      if (Math.abs(v1-oldv)>delta) {
        if (v1>oldv) ascent += v1-oldv;
        else if (v1<oldv) descent += oldv-v1;
        oldv=v1;
        flg=true;
      }
    }
    else {
      oldv=v1;
      flg=true;
    }
  }

//  console.log(v1);
//  console.log(flg);
  if (flg) {
      g.reset().clearRect(0,y-30,g.getWidth()-10,y+30);
      g.setFont("Vector",50).setFontAlign(0,0).drawString(''+(v1-zero), g.getWidth()/2, y);
  }
}

g.setFont("6x8").setFontAlign(0,0).drawString(/*LANG*/"ALTITUDE (m)", g.getWidth()/2, y-40);
g.setFont("6x8").setFontAlign(0,0,3).drawString(/*LANG*/"ZERO", g.getWidth()-5, g.getHeight()/2);

function draw() {
  // work out how to display the current time
  var d = new Date();
  Bangle.getPressure().then(getAlt);

  //  const base=100;
  //  const randv=20;
  //  altitude=base+Math.random()*randv-randv/2;
  //  console.log('Alt:'+altitude);

  drawalt(false);

  var h = d.getHours(), m = d.getMinutes();
  var time = (" "+h).substr(-2) + ":" + ("0"+m).substr(-2);

  // Reset the state of the graphics library
  g.reset();
  // draw the current time (4x size 7 segment)
  g.setFont("7x11Numeric7Seg",4);
  g.setFontAlign(0,-1); 
  if (Bangle.isLocked())g.setColor(green);
  g.drawString(time, g.getWidth()/2-10, y+40, true /*clear background*/);
  g.clearRect(0,0,g.getWidth()-10,30);
  if (Bangle.isLocked())g.setColor(cyan);
  g.setFont("Vector",20).setFontAlign(-1,0).drawString('D+ '+ascent, 20, 25);
  g.setFont("Vector",20).setFontAlign(1,0).drawString('D- '+descent, R.x+R.w-20, 25);
}


// draw immediately at first
draw();
var mInterval = setInterval(draw, INTERVAL);
// Stop updates when LCD is off, restart when on
Bangle.on('lcdPower',on=>{
  if (on) {
    if (mInterval) clearInterval(mInterval);
    mInterval = setInterval(draw, INTERVAL);
    draw(); // draw immediately
  }
});

Bangle.on('lock', function(isLocked) {
  if (!isLocked) {
    if (mInterval) clearInterval(mInterval);
    mInterval = setInterval(draw, INTERVAL);
    draw();
  }
  
});

setWatch(function() {
  zero = value;
}, (process.env.HWVERSION==2) ? BTN1 : BTN2, {repeat:true});

// Load widgets
//Bangle.loadWidgets();
//Bangle.drawWidgets();

Bangle.setUI("clockupdown", btn=> {
  if (btn<0) zero -= 5;
  if (btn>0) zero +=5 ;
  drawalt(true);
});
