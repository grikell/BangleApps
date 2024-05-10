
(function(back) {

  let color_options = ['White', 'Green','Orange','Cyan','Purple','Red','Blue','Black'];
  let nc=color_options.length-1;

  let localSettings = {
    'hideWhenLocked': false,
    'timeCol':color_options[0],
    'dateCol':color_options[0]
  };

  let settings = require('Storage').readJSON('deko.json',1)|| localSettings;


  function save(key, value) {
    settings[key] = value;
    require('Storage').write('deko.json', settings);
  }

  const appMenu = {
    '': {'title': 'App Settings'},
    '< Back': back,
    'Time Colour': {
        value: 0 | color_options.indexOf(settings.timeCol),
        min: 0, max: nc,
        format: v => color_options[v],
        onchange: v => {
          settings.timeCol = color_options[v];
          save();
        }
    },
    'Date Colour': {
        value: 0 | color_options.indexOf(settings.dateCol),
        min: 0, max: nc,
        format: v => color_options[v],
        onchange: v => {
          settings.dateCol = color_options[v];
          save();
        }
    },
    'Hide Locked': {
    value: !!settings.hideWhenLocked,
    onchange: x => save('hideWhenLocked', x),
    }
  };
  E.showMenu(appMenu);
})
