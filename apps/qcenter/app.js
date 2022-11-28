require("Font8x12").add(Graphics);

// load pinned apps from config
var settings = require("Storage").readJSON("qcenter.json", 1) || {};
var pinnedApps = settings.pinnedApps || [];
var exitGesture = settings.exitGesture || "swipeup";

// if empty load a default set of apps as an example
if (pinnedApps.length == 0) {
	pinnedApps = [
		{ src: "setting.app.js", icon: "setting.img" },
		{ src: "about.app.js", icon: "about.img" },
	];
}

// button drawing from Layout.js, edited to have completely custom button size with icon
function drawButton(l) {
	var x = l.x + (0 | l.pad),
		y = l.y + (0 | l.pad),
		w = l.w - (l.pad << 1),
		h = l.h - (l.pad << 1);
	var poly = [
			x,
			y + 4,
			x + 4,
			y,
			x + w - 5,
			y,
			x + w - 1,
			y + 4,
			x + w - 1,
			y + h - 5,
			x + w - 5,
			y + h - 1,
			x + 4,
			y + h - 1,
			x,
			y + h - 5,
			x,
			y + 4,
		],
		bg = l.selected ? g.theme.bgH : g.theme.bg2;
	g.setColor(bg)
		.fillPoly(poly)
		.setColor(l.selected ? g.theme.fgH : g.theme.fg2)
		.drawPoly(poly);
	if (l.src)
		g.setBgColor(bg).drawImage(
			"function" == typeof l.src ? l.src() : l.src,
			l.x + l.w / 2,
			l.y + l.h / 2,
			{ scale: l.scale || undefined, rotate: Math.PI * 0.5 * (l.r || 0) }
		);
}

// function to split array into group of 3, for button placement
function groupBy3(data) {
	var result = [];
	for (var i = 0; i < data.length; i += 3) result.push(data.slice(i, i + 3));
	return result;
}

// generate object with buttons for apps by group of 3
var appButtons = groupBy3(pinnedApps).map((appGroup, i) => {
	return appGroup.map((app, j) => {
		return {
			type: "custom",
			render: drawButton,
			width: 50,
			height: 50,
			pad: 5,
			src: require("Storage").read(app.icon),
			scale: 0.75,
			cb: (l) => Bangle.load(app.src),
		};
	});
});

// create basic layout content with status info and sensor status on top
var layoutContent = [
	{
		type: "h",
		pad: 5,
		fillx: 1,
		c: [
			{ type: "txt", font: "8x12", pad: 3, scale: 2, label: E.getBattery() + "%" },
			{ type: "txt", font: "8x12", pad: 3, scale: 2, label: "GPS: " + (Bangle.isGPSOn() ? "ON" : "OFF") },
		],
	},
];

// create rows for buttons and add them to layoutContent
appButtons.forEach((appGroup) => {
	layoutContent.push({
		type: "h",
		pad: 2,
		c: appGroup,
	});
});

// create layout with content

Bangle.loadWidgets();

var Layout = require("Layout");
var layout = new Layout({
	type: "v",
	c: layoutContent,
});
g.clear();
layout.render();
Bangle.drawWidgets();

// swipe event listener for exit gesture
Bangle.on("swipe", function (lr, ud) {
	if(exitGesture == "swipeup" && ud == -1) Bangle.showClock();
	if(exitGesture == "swipedown" && ud == 1) Bangle.showClock();
	if(exitGesture == "swipeleft" && lr == -1) Bangle.showClock();
	if(exitGesture == "swiperight" && lr == 1) Bangle.showClock();
});