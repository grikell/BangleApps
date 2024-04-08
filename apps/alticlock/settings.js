
(function(back) {
  let settings = require('Storage').readJSON('alticlock.json',1)||{};
  if (typeof settings.offset !== "number") settings.offset = 0; // default values
  if (typeof settings.filt !== "boolean") settings.filt=true;
  if (typeof settings.delta !== "number") settings.delta=1;   
  if (typeof settings.timeint !== "number") settings.timeint=5;
  if (typeof settings.avrlen !== "number") settings.avrlen=2;
  if (typeof settings.uphill !== "number") settings.uphill=0;
  if (typeof settings.downhill !== "number") settings.downhill=0;

  function save(key, value) {
    settings[key] = value;
    require('Storage').write('alticlock.json', settings);
  }

  const appMenu = {
    '': {'title': 'App Settings'},
    '< Back': back,
    'Reset Up/Down' : {
      value : false,
      format : v => v ? "No":"Yes",
      onchange : (m) => {save('downhill',0); save('uphill',0);}
    },
    'Offset': {
      value: settings.offset,
      min: -200,
      max: 200,
      step: 1,
      onchange: (m) => {save('offset', m);}
    },
    'Kalman Filter' : {
      value : settings.filt,
      format : v => v?"On":"Off",
      onchange : (m) => {save('filt',m);}
    },
    'Threshold': {
      value: settings.delta,
      min: 0,
      max: 10,
      step: 1,
      onchange: (m) => {save('delta', m);}
    },   
    'Sample Int.': {
      value: settings.timeint,
      min: 1,
      max: 30,
      step: 2,
      onchange: (m) => {save('timeint', m);}
    },
    'AvgOver': {
      value: settings.avrlen,
      min: 1,
      max: 10,
      step: 1,
      onchange: (m) => {save('avrlen', m);}
    }   
  };
  E.showMenu(appMenu);
})
