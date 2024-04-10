(function(back) {
  const SETTINGS_FILE = "slopeclock2.json";
  const storage = require('Storage');
  let localSettings = {
    'Colour': 'C',
    'Invert': false,
    'Animate': false
    'hideWhenLocked': false
  };
  let settings = storage.readJSON(SETTINGS_FILE, 1) || localSettings;

  let color_options = ['Green', 'Orange', 'Cyan', 'Purple', 'Red', 'Blue', 'Black', 'White', 'Gray', 'Cycle'];
  let color_code =    ['#0f0',  '#ff0',   '#0ff', '#f0f',   '#f00','#00f', '#000',  '#fff',  '#888', 'C'];

  function save(key, value) {
    settings[key] = value;
    storage.write(SETTINGS_FILE, settings);
  }

  function showMainMenu() {
    let menu = {
      '': {
        'title': 'SlopeClock2'
      },      
      '< Back': back,
      /*LANG*/
      'Colour': {
        value: color_code.indexOf(settings.Colour),
        min:0, max:8,
        format: v => color_options[v],
        onchange: v => save('Colour', color_code[v]),
      },
      /*LANG*/
      'Animate': {
        value: !!settings.Animate,
        format: () => (settings.Animate ? 'Yes' : 'No'),
        onchange: x => save('Animate', x),
      },
      /*LANG*/
      'Hide Locked': {
        value: !!settings.hideWhenLocked,
        format: () => (settings.hideWhenLocked ? 'Yes' : 'No'),
        onchange: x => save('hideWhenLocked', x),
      },
      /*LANG*/
      'Invert': {
        value: !!settings.Invert,
        format: () => (settings.Invert ? 'Yes' : 'No'),
        onchange: x => save('Invert', x),
      }
    };
    E.showMenu(menu);
  }


  showMainMenu();
});
