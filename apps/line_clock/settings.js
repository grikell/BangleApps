(function(back) {
    const SETTINGS_FILE = "line_clock.setting.json";

    // initialize with default settings...
    const storage = require('Storage')
    let settings = {
      showLock: true,
      showMinute: true,
      handColor: '#f00',
    };
    let saved_settings = storage.readJSON(SETTINGS_FILE, 1) || settings;
    for (const key in saved_settings) {
      settings[key] = saved_settings[key]
    }
    
    let color_options = ['Green', 'Orange', 'Cyan', 'Gray', 'Red', 'Blue', 'Black', 'White'];
    let color_code = ['#0f0', '#ff0', '#0ff', '#888', '#f00', '#00f', '#000', '#fff'];
    
    function save() {
      storage.write(SETTINGS_FILE, settings)
    }

    E.showMenu({
      '': { 'title': 'Line Clock' },
      '< Back': back,
      'Show Lock': {
        value: settings.showLock,
        onchange: () => {
          settings.showLock = !settings.showLock;
          save();
        },
      },
      'Show Minute': {
        value: settings.showMinute,
        onchange: () => {
          settings.showMinute = !settings.showMinute;
          save();
        },
      },
      'Hand Color': {
            value: color_code.indexOf(settings.handColor),
            min:0, max:7,
            format: v => color_options[v],
            onchange: () => {
                settings.handColor = color_code[v];
                save();
            },
        }
    });
  })
