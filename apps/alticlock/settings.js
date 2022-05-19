
(function(back) {
  let settings = require('Storage').readJSON('alticlock.json',1)||{};
  if (typeof settings.offset !== "number") settings.offset = 0; // default values
  if (typeof settings.filt !== "boolean") settings.filt=true;
  if (typeof settings.delta !== "number") settings.delta=1;   

  function save(key, value) {
    settings[key] = value;
    require('Storage').write('alticlock.json', settings);
  }

  const appMenu = {
    '': {'title': 'App Settings'},
    '< Back': back,
    'Offset': {
      value: settings.offset,
      min: -200,
      max: 200,
      step: 5,
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
    }   
  };
  E.showMenu(appMenu);
})
