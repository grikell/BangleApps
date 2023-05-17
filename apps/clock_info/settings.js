(function(back) {
  let settings = require("clock_info").loadSettings();

  function save(key, value) {
    settings[key] = value;
    require('Storage').write("clock_info.json", settings);
  }

  let menu ={
    '': { 'title': 'Clock Info' },
    /*LANG*/'< Back': back,
    /*LANG*/'Defocus on Lock': {
      value:  !!settings.defocusOnLock,
      onchange: x => save('defocusOnLock', x),
    },
    /*LANG*/'HRM': {
      value: settings.hrmOn,
      min: 0, max: 1, step: 1,
      format: v => ["Always","Tap"][v],
      onchange: x => save('hrmOn', x),
    },
    /*LANG*/'Delta Altitude': {
      value: settings.deltaAltitude,
      min: -100, max: 100, step: 5,
      format: v => v+"m",
      onchange: x => save('deltaAltitude', x),
    }
  };
  E.showMenu(menu);
})
