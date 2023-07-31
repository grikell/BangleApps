(function(back) {
    const SETTINGS_FILE_NAME="messages_light2.settings.json";
    var settings = require('Storage').readJSON(SETTINGS_FILE_NAME, true) || {};
    function updateSetting(setting, value) {
      let settings = require('Storage').readJSON(SETTINGS_FILE_NAME, true) || {};
      settings[setting] = value;
      require('Storage').writeJSON(SETTINGS_FILE_NAME, settings);
    }
    const timeOutChoices = [/*LANG*/"Off", "10s", "15s", "20s", "30s"];
    var mainmenu = {
      "" : { "title" : /*LANG*/"Messages Light" },
      "< Back" : back,
      /*LANG*/'Time Out': {
        value: timeOutChoices.indexOf(settings.timeOut),
        min: 0, max: timeOutChoices.length-1,
        format: v => timeOutChoices[v],
        onchange: m => {
          updateSetting("timeOut", timeOutChoices[m]);
        }
      },
      'Invert BG': {
        value: (settings.invert !== undefined ? settings.invert : false),
        onchange : v => { updateSetting("invert", v); } 
      },
      'Show Nav.': {
        value: (settings.showNav !== undefined ? settings.showNav : false),
        onchange : v => { updateSetting("showNav", v); } 
      },
    };
    E.showMenu(mainmenu);
  });
  
