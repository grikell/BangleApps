(function(back) {
  const SETTINGS_FILE = "slopeclock2.json";
  const storage = require('Storage');
  let localSettings = {'Colour': 'C', 'Invert': false, 'Animate': false};
  let settings = storage.readJSON(SETTINGS_FILE, 1) || localSettings;

  let color_options = ['Green','Orange','Cyan','Purple','Red','Blue','Black','White','Cycle'];
  let color_code = ['#0f0','#ff0','#0ff','#f0f','#f00','#00f','#000','#fff','C'];

  function save(key, value) {
    settings[key] = value;
    storage.write(SETTINGS_FILE, settings);
  }

  function showMainMenu() {
    let menu ={
      '': { 'title': 'SlopeClock2' },
      /*LANG*/'Colour': {
        value: 0 | color_options.indexOf(localSettings.color),
	min: 0, max: 8,
	format: v => color_options[v],
	onchange: v => {
	    localSettings.color = color_options[v];
	    localSettings.bg = bg_code[v];
	    save('Colour',x);
        },
      },
      /*LANG*/'Animate': {
        value: !!settings.Animate,
        format: () => (settings.Animate ? 'Yes' : 'No'),
        onchange: x => save('Animate', x),
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
