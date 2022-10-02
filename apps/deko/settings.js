
(function(back) {

  let color_options = ['White', 'Green','Orange','Cyan','Purple','Red','Blue'];

  let settings = require('Storage').readJSON('deko.json',1)||{};
  if (typeof settings.timeCol !== "string") settings.timeCol=color_options[0];   
  if (typeof settings.dateCol !== "string") settings.dateCol=color_options[0];


  function save(key, value) {
    settings[key] = value;
    require('Storage').write('deko.json', settings);
  }

  const appMenu = {
    '': {'title': 'App Settings'},
    '< Back': back,
    'Time Colour': {
        value: 0 | color_options.indexOf(settings.timeCol),
        min: 0, max: 6,
        format: v => color_options[v],
        onchange: v => {
          settings.timeCol = color_options[v];
          save();
        }
    },
    'Date Colour': {
        value: 0 | color_options.indexOf(settings.dateCol),
        min: 0, max: 6,
        format: v => color_options[v],
        onchange: v => {
          settings.dateCol = color_options[v];
          save();
        }
    }
  };
  E.showMenu(appMenu);
})
