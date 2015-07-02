// Create a client-only collection for storing color picker history during the browser session
var ooColorPickerHistory = new Meteor.Collection(null);
var ooColorPickerFavorites = new Meteor.Collection(null);


Template.ooColorPicker.onCreated(function () {
  var self = this;
  var color = Color("hsl(180, 50%, 50%)");
  self.prevColor = new Blaze.ReactiveVar(color.hslaString());

  self.hue = new Blaze.ReactiveVar(color.hue());
  self.saturation = new Blaze.ReactiveVar(color.saturation());
  self.lightness = new Blaze.ReactiveVar(color.lightness());
  self.alpha = new Blaze.ReactiveVar(color.alpha());
  self.randomColorType = new Blaze.ReactiveVar("red");
  self.colorSchemeType = new Blaze.ReactiveVar("analogous");

  self.schemeAction = new Blaze.ReactiveVar("addToFavorites");
  self.historyAction = new Blaze.ReactiveVar("select");
  self.randomAction = new Blaze.ReactiveVar("select");


  self.addHistoryRecord = function(hsl) {
    // Only add unique colors to history
    if (!ooColorPickerHistory.findOne({color: self.getCurrentHslString()})) {

      // Limit the number of history items to 100
      if (ooColorPickerHistory.find().count() >= 100) {
        var doc = ooColorPickerHistory.findOne({}, {sort: {createdAt: 1}})
        ooColorPickerHistory.remove(doc);
      }

      // Insert new history item
      ooColorPickerHistory.insert({
        color: self.getCurrentHslString(),
        createdAt: new Date()
      })
    }
  }

  self.addToFavorites = function(hslString) {
    // Only add unique colors to history
    if (!ooColorPickerFavorites.findOne({color: hslString})) {

      // Limit the number of history items to 100
      if (ooColorPickerFavorites.find().count() >= 100) {
        var doc = ooColorPickerFavorites.findOne({}, {sort: {createdAt: 1}})
        ooColorPickerFavorites.remove(doc);
      }

      // Insert new history item
      ooColorPickerFavorites.insert({
        color: hslString,
        createdAt: new Date()
      })
    }
  }

  self.lightenCurrent = function(num) {
    self.lightness.set(Math.min(self.lightness.get() + num, 100))
  }

  self.darkenCurrent = function(num) {
    self.lightness.set(Math.max(self.lightness.get() - num, 0))
  }

  self.saturateCurrent = function(num) {
    self.saturation.set(Math.min(self.saturation.get() + num, 100))
  }

  self.desaturateCurrent = function(num) {
    self.saturation.set(Math.max(self.saturation.get() - num, 0))
  }

  self.convertToHslString = function (color) {
    var colorObj = Color(tinycolor(color).toRgbString())
    return "hsl(" + colorObj.hue() + ", " + colorObj.saturation() + "%, " + colorObj.lightness() +"%)"
  }

  self.setCurrentHslFromColor = function(color) {
    // var hsl = self.convertToHslString(color)
    var hsl = Color(tinycolor(color).toRgbString())
    self.hue.set(hsl.hue());
    self.saturation.set(hsl.saturation());
    self.lightness.set(hsl.lightness());
  }

  self.setCurrentHsl = function(hslString) {
    var hsl = Color(hslString);
    self.hue.set(hsl.hue());
    self.saturation.set(hsl.saturation());
    self.lightness.set(hsl.lightness());
    self.alpha.set(hsl.alpha());
  }

  self.getCurrentHslString = function() {
    return "hsla(" + self.hue.get() + ", " + self.saturation.get() + "%, " + self.lightness.get() +"%, " + self.alpha.get() + ")"
  }

  self.getCurrentHslaString = function() {
    return "hsla(" + self.hue.get() + ", " + self.saturation.get() + "%, " + self.lightness.get() +"%, " + self.alpha.get() + ")"
  }

  self.getCurrentRgbString = function() {
    var color = Color(self.getCurrentHslString());
    return color.rgbString()
  }

  self.getCurrentHexString = function() {
    var color = Color(self.getCurrentHslString());
    return color.hexString()
  }

  self.getRandomColorRange = function() {
    var randomColors = [];
    var generatedColors = randomColor({hue: self.randomColorType.get(), count: 18})
    generatedColors.forEach(function(element){
      randomColors.push({color: self.convertToHslString(element)})
    })
    return randomColors;
  }

  self.addHistoryRecord();

  self.delayedAddHistoryRecord = _.throttle(self.addHistoryRecord, 5000, {leading: false});
});


Template.ooColorPicker.helpers({
  prevColor : function () {
    return Template.instance().prevColor.get();
  },
  favoriteColors : function () {
    return ooColorPickerFavorites.find({}, {sort: {createdAt: -1}});
  },
  isSelectedColor : function () {
    return Template.instance().getCurrentHslaString() === this.color ? true : false;
  },
  isFavoritedColor : function () {
    var self = this;
    return  ooColorPickerFavorites.findOne({color: self.color}) ? true : false;
  },
  rgbString : function () {
    return Template.instance().getCurrentRgbString();
  },
  hslString : function () {
    return Template.instance().getCurrentHslString();
  },
  hslaString : function () {
    return Template.instance().getCurrentHslaString();
  },
  hexString : function () {
    return Template.instance().getCurrentHexString();
  },
  hue : function () {
    return Template.instance().hue.get();
  },
  saturation : function () {
    return Template.instance().saturation.get();
  },
  lightness : function () {
    return Template.instance().lightness.get();
  },
  alpha : function () {
    return Template.instance().alpha.get();
  },
  alphaPercent : function () {
    return (Template.instance().alpha.get() * 100);
  },
  randomColors: function() {
    return Template.instance().getRandomColorRange();
  },
  randomHueButtons: function() {
    return ["red", "orange", "yellow", "green", "blue", "purple", "pink", "monochrome"]
  },
  colorSchemeButtons: function() {
    return ["analogous", "monochromatic", "splitcomplement", "triad", "tetrad"]
  },
  hueGradient: function() {
    var steps = 36;
    var s = Template.instance().saturation.get();
    var l = Template.instance().lightness.get();
    var a = Template.instance().alpha.get();
    var colors = [];
    for (steps; steps >= 0; steps--) {
      colors.push("hsla(" + steps * 10 + ", " + s + "%," + l + "%, " + a + ")")
    };
    return { style: "background: linear-gradient(to left, " + colors + ");"}
  },
  saturationGradient: function() {
    var steps = 5;
    var h = Template.instance().hue.get();
    var l = Template.instance().lightness.get();
    var a = Template.instance().alpha.get();
    var colors = [];
    for (steps; steps >= 0; steps--) {
      colors.push("hsla(" + h + ", " + steps * 20 + "%," + l + "%, " + a + ")")
    };
    return { style: "background: linear-gradient(to left, " + colors + ");"}
  },
  lightnessGradient: function() {
    var steps = 5;
    var h = Template.instance().hue.get();
    var s = Template.instance().saturation.get();
    var a = Template.instance().alpha.get();
    var colors = [];
    for (steps; steps >= 0; steps--) {
      colors.push("hsla(" + h + ", " + s + "%," + steps * 20 + "%, " + a + ")")
    };
    return { style: "background: linear-gradient(to left, " + colors + ");"}
  },
  alphaGradient: function() {
    var steps = 5;
    var h = Template.instance().hue.get();
    var s = Template.instance().saturation.get();
    var l = Template.instance().lightness.get();
    var colors = [];
    for (steps; steps >= 0; steps--) {
      colors.push("hsla(" + h + ", " + s + "%," + l + "%, " + steps * 0.2 + ")")
    };
    return { style: "background: linear-gradient(to left, " + colors + ")"}
  }
});

Template.ooColorSwatch.helpers({
  multiBackgroundStyle : function () {
    var color = this.color || "";
    // Use linear gradient as background color to able to position alpha color on top of chekered background
    // More info https://css-tricks.com/tinted-images-multiple-backgrounds/
   return { style: "background: linear-gradient(" + color + "," + color + "), linear-gradient(45deg, rgba(255,255,255,0.2) 25%,transparent 25%,transparent 75%,rgba(255,255,255,0.2) 75%,rgba(255,255,255,0.2)) 0px 0px,linear-gradient(45deg, rgba(255,255,255,0.2) 25%,transparent 25%,transparent 75%,rgba(255,255,255,0.2) 75%,rgba(255,255,255,0.2)) 10px 10px; background-size: 20px 20px;"}
  }
});

// var createGradient = function(part) {
//   var colors, multiplier, steps;
//   switch (part) {
//     case 'h':
//       steps = 36;
//       multiplier = 10;
//       break;
//     case 's':
//     case 'l':
//       steps = 5;
//       multiplier = 20;
//       break;
//   }
// }


// setSliderBg = function(part) {
//   return $("#" + part + "-slider").attr('style', "background: -webkit-" + (this.gradient(part)) + "; background: -moz-" + (this.gradient(part)));
// }


// gradient = function(part) {
//   var colors, multiplier, num, size;
//   switch (part) {
//     case 'h':
//       size = 36;
//       multiplier = 10;
//       break;
//     case 's':
//     case 'l':
//       size = 5;
//       multiplier = 20;
//       break;
//     case 'a':
//       size = 5;
//       multiplier = .2;
//   }
//   colors = (function() {
//     var i, ref, results;
//     results = [];
//     for (num = i = 0, ref = size; 0 <= ref ? i <= ref : i >= ref; num = 0 <= ref ? ++i : --i) {
//       results.push(hslaStr(tweakHsla(part, num * multiplier)));
//     }
//     return results;
//   }).call(this);
//   return "linear-gradient(left, " + (colors.join(',')) + ");";
// }
// tweakHsla = function(part, value) {
//   var color, pos;
//   color = hsla();
//   switch (part) {
//     case 'h':
//       pos = 0;
//       break;
//     case 's':
//       pos = 1;
//       break;
//     case 'l':
//       pos = 2;
//       break;
//     case 'a':
//       pos = 3;
//   }
//   color.splice(pos, 1, value);
//   return color;
// }


// var updateHsl = function(hsl, prop, val) {
//   hsl[prop] = Number.parseInt(val);
//   console.log('%c hsl   ',  'background: #FF9900; color: white; padding: 1px 15px 1px 5px;', hsl);
//   return hsl;
// }

Template.ooColorPicker.events({
  'input .js-colorInput' : function (e, t) {
    t.setCurrentHslFromColor(e.target.value)
    t.addHistoryRecord();
  },
  'click .js-colorInput' : function (e, t) {
    $(e.target).select();
  },
  'click .js-lightenColor' : function (e, t) {
     t.lightenCurrent(2);

      t.delayedAddHistoryRecord()
  },
  'click .js-darkenColor' : function (e, t) {
     t.darkenCurrent(2);

      t.delayedAddHistoryRecord()
  },
  'click .js-saturateColor' : function (e, t) {
    t.saturateCurrent(4);

      t.delayedAddHistoryRecord()
  },
  'click .js-desaturateColor' : function (e, t) {
    t.desaturateCurrent(4);
     t.delayedAddHistoryRecord()
  },
  'click .js-setHistoryColor' : function (e, t) {
    var self = this;
    if (t.historyAction.get() === "addToFavorites") {
      t.addToFavorites(self.color);
      t.addHistoryRecord();
    } else if (t.historyAction.get() === "select") {
      console.log('%c self.color   ',  'background: #FF9900; color: white; padding: 1px 15px 1px 5px;', self.color);
      t.setCurrentHsl(self.color);
      t.addHistoryRecord();
    }
  },
  'click .js-setSchemeColor' : function (e, t) {
    var self = this;
    if (t.schemeAction.get() === "addToFavorites") {
      t.addToFavorites(self.color);
      t.addHistoryRecord();
    } else if (t.schemeAction.get() === "select") {
      t.setCurrentHsl(self.color);
      t.addHistoryRecord();
    }

  },
  'click .js-setFavoriteColor' : function (e, t) {
    var self = this;
    t.setCurrentHsl(self.color);
    t.addHistoryRecord();

  },
  'click .js-setSchemeAction' : function (e, t) {
    var self = this;
    t.schemeAction.set(e.target.dataset.action);
  },
  'click .js-colorSwatch' : function (e, t) {
    var self = this;
  },
  'click .js-setHistoryAction' : function (e, t) {
    var self = this;
    t.historyAction.set(e.target.dataset.action);
  },
  'click .js-setRandomAction' : function (e, t) {
    var self = this;
    t.randomAction.set(e.target.dataset.action);
  },
  'click .js-setRandomColor' : function (e, t) {
    var self = this;
    if (t.randomAction.get() === "addToFavorites") {
      t.addToFavorites(self.color);
      t.addHistoryRecord();
    } else if (t.randomAction.get() === "select") {
      t.setCurrentHsl(self.color);
      t.addHistoryRecord();
    }
  },
  'click .js-setPreviuosColor' : function (e, t) {
    var self = this;
    t.setCurrentHslFromColor(self.color);
  },
  'click .js-setRandomColorType' : function (e, t) {
    t.randomColorType.set(e.target.dataset.color);
  },
  'click .js-setColorSchemeType' : function (e, t) {
    t.colorSchemeType.set(e.target.dataset.scheme);
  },
  'input .js-updateHue' : function (e, t) {
    t.hue.set(parseInt(e.target.value));
  },
  'input .js-updateSaturation' : function (e, t) {
    t.saturation.set(parseInt(e.target.value));
  },
  'input .js-updateLightness' : function (e, t) {
    t.lightness.set(parseInt(e.target.value));
  },
  'input .js-updateAlpha' : function (e, t) {
    t.alpha.set(parseInt(e.target.value) / 100);
  },
  'change .js-updateHue' : function (e, t) {
    t.addHistoryRecord();
  },
  'change .js-updateSaturation' : function (e, t) {
    t.addHistoryRecord();
  },
  'change .js-updateLightness' : function (e, t) {
    t.addHistoryRecord();
  },
  'change .js-updateAlpha' : function (e, t) {
    t.addHistoryRecord();
  }
});

Template.ooColorPicker_History.helpers({
  historyColors : function () {
    return ooColorPickerHistory.find({}, {sort: {createdAt: -1}});
  }
});

