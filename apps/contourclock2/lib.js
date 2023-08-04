var is12;
function getHours(d) {
  var h = d.getHours();
  if (is12===undefined) is12 = (require('Storage').readJSON('setting.json',1)||{})["12hour"];
  if (!is12) return h;
  return (h%12==0) ? 12 : h%12;
}

exports.getDigits = function(fontIndex) {
  var digits = [];
  fontFile=require("Storage").read("contourclock-"+Math.abs(parseInt(fontIndex+0.5))+".json");
  if (fontFile==undefined) return(false); //exit if font file not found
  var font = JSON.parse(fontFile);
  for (var n in font.characters) {
    digits.push({width: parseInt(font.characters[n].width),
      height: font.size,
      bpp: 2,
      transparent: 1,
      buffer:E.toArrayBuffer(atob(font.characters[n].buffer))});
    }
  if (n!=10) return (false); //font file seems to be invalid
  let fname=font.name;
  return { digits, fname };
};

exports.drawClock = function(settings, digits) {
    var x=0;
    var y = g.getHeight()/2-digits[0].height/2;
    var date = new Date();

    let fg=g.theme.fg;
    let bg=g.theme.bg;

    let setcol = function(c1,c2) {
      g.setColor(c1);
      g.setBgColor(c2);
    };

    let fn=(settings.fontIndex >= 0 );

    g.clearRect(0,38,g.getWidth()-1,138);
    let d1=parseInt(getHours(date)/10);
    let d2=parseInt(getHours(date)%10);
    let d3=10;
    let d4=parseInt(date.getMinutes()/10);
    let d5=parseInt(date.getMinutes()%10);
    let w1=digits[d1].width;
    let w2=digits[d2].width;
    let w3=digits[d3].width;
    let w4=digits[d4].width;
    let w5=digits[d5].width;

    let squeeze=(g.getWidth()-w5)/(w1+w2+w3+w4);

    let x1=x;

    let x2;
    if (d1!=0) x2=x1+parseInt(w1*squeeze);
    else x2=x1+parseInt(w1*squeeze)/2;

    let x3=x2+parseInt(w2*squeeze);
    let x4=x3+parseInt(w3*squeeze);
    let x5=x4+parseInt(w4*squeeze);

    if (fn) setcol(bg,fg);

    if (fn) setcol(bg,settings.digitsCol);
    g.drawImage(digits[d2],x2,y);
    g.drawImage(digits[d5],x5,y);

    if (fn) setcol(bg,settings.tensCol);
    if (d1!=0) g.drawImage(digits[d1],x1,y);
    g.drawImage(digits[d4],x4,y);

    if (fn) setcol(bg,settings.dotsCol);
    g.drawImage(digits[d3],x3,y);

    setcol(fg,bg); 
  };
