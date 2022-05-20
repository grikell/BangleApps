(function(back) {
  const SETTINGS_FILE = "rebbleclock.json";

  // initialize with default settings...
  var s1 = {'bg': '#0f0', 'color': 'Green', 'cycle': true };

  const storage = require('Storage');
  var settings = storage.readJSON(SETTINGS_FILE, 1) || {};

  if  (settings.bg != undefined) s1.bg=settings.bg;
  if  (settings.color != undefined) s1.color=settings.color;
  if  (settings.cycle != undefined) s1.cycle=settings.cycle;

  function save() {
    storage.write(SETTINGS_FILE, s);
    console.log(s1);
  }

  var color_options = ['Green','Orange','Cyan','Purple','Red','Blue'];
  var bg_code = ['#0f0','#ff0','#0ff','#f0f','#f00','#00f'];
  
  E.showMenu({
    '': { 'title': 'Rebble Clock' },
    '< Back': back,
    'Colour': {
      value: 0 | color_options.indexOf(s1.color),
      min: 0, max: 5,
      format: v => color_options[v],
      onchange: v => {
        s1.color = color_options[v];
        s1.bg = bg_code[v];
        save();
      }
    },
    'Cycle Sidebar': {
      value : s1.cycle,
      format: () => (s1.cycle ? 'Yes' : 'No'),
      onchange : () => { 
        s1.cycle = !s1.cycle;
	save(); 
      }
    }
  });
})
