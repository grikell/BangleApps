(function(back) {
  const SETTINGS_FILE = "slopeclock2.json";
  const storage = require('Storage');
  let localSettings = {'autoCycle': true, 'Invert': false};
  let settings = storage.readJSON(SETTINGS_FILE, 1) || localSettings;

  function save(key, value) {
    settings[key] = value;
    storage.write(SETTINGS_FILE, settings);
  }

  function showMainMenu() {
    let menu ={
      '': { 'title': 'SlopeClock2' },
      /*LANG*/'< Back': back,
      /*LANG*/'Auto Cycle': {
        value: !!settings.autoCycle,
        format: () => (settings.autoCycle ? 'Yes' : 'No'),
        onchange: x => save('autoCycle', x),
      },
      /*LANG*/'Invert': {
        value: !!settings.Invert,
        format: () => (settings.Invert ? 'Yes' : 'No'),
        onchange: x => save('Invert', x),
      }
    };
    E.showMenu(menu);
  }


  showMainMenu();
});
