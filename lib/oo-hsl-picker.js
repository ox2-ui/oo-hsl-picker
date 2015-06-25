// Create a client-only collection for storing color picker history during the browser session
var ooColorPickerHistory = new Meteor.Collection(null);

Template.ooColorPicker.onCreated(function () {
  var self = this;
  var color = "crimson";
  self.prevColor = new Blaze.ReactiveVar(Color(color).hslString());

  self.hue = new Blaze.ReactiveVar(100);
  self.saturation = new Blaze.ReactiveVar(50);
  self.lightness = new Blaze.ReactiveVar(50);
  self.randomColorRange = new Blaze.ReactiveVar("red");

  self.addHistoryRecord = function(hsl) {
    // Only add unique colors to history
    if (!ooColorPickerHistory.findOne({color: self.getHslString()})) {

      // Limit the number of history items to 100
      if (ooColorPickerHistory.find().count() >= 100) {
        var doc = ooColorPickerHistory.findOne({}, {sort: {createdAt: 1}})
        ooColorPickerHistory.remove(doc);
      }

      // Insert new history item
      ooColorPickerHistory.insert({
        color: self.getHslString(),
        createdAt: new Date()
      })
    }
  }

  self.convertToHslString = function (color) {
    var colorObj = Color(tinycolor(color).toRgbString())
    return "hsl(" + colorObj.hue() + ", " + colorObj.saturation() + "%, " + colorObj.lightness() +"%)"
  }

  self.setHslFromColor = function(color) {
    // var hsl = self.convertToHslString(color)
    var hsl = Color(tinycolor(color).toRgbString())
    self.hue.set(hsl.hue());
    self.saturation.set(hsl.saturation());
    self.lightness.set(hsl.lightness());
  }

  self.getHslString = function() {
    return "hsl(" + self.hue.get() + ", " + self.saturation.get() + "%, " + self.lightness.get() +"%)"
  }

  self.getRgbString = function() {
    var color = self.getHslString();
    return tinycolor(color).toRgbString()
  }

  self.getHexString = function() {
    var color = self.getHslString();
    return tinycolor(color).toHexString()
  }

});


Template.ooColorPicker.helpers({
  prevColor : function () {
    return Template.instance().prevColor.get();
  },
  historyColours : function () {
    return ooColorPickerHistory.find({}, {sort: {createdAt: -1}});
  },
  isSelectedColor : function () {
    return Template.instance().getHslString() === this.color ? true : false;
  },
  rgbString : function () {
    return Template.instance().getRgbString();
  },
  hslString : function () {
    return Template.instance().getHslString();
  },
  hexString : function () {
    return Template.instance().getHexString();
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
  randomColors: function() {
    var t = Template.instance();
    var randomColors = [];
    var generatedColors = randomColor({hue: t.randomColorRange.get(), count: 18})
    generatedColors.forEach(function(element){
      console.log('%c t.convertToHslString(element)   ',  'background: #FF9900; color: white; padding: 1px 15px 1px 5px;', t.convertToHslString(element));
      randomColors.push({color: t.convertToHslString(element)})
    })
    return randomColors;
  },
  hueGradient: function() {
    var steps = 36;
    var s = Template.instance().saturation.get();
    var l = Template.instance().lightness.get();
    var colors = [];
    for (steps; steps >= 0; steps--) {
      colors.push("hsla(" + steps * 10 + ", " + s + "%," + l + "%, 1)")
    };
    return { style: "background: linear-gradient(to left, " + colors + ");"}
  },
  saturationGradient: function() {
    var steps = 5;
    var h = Template.instance().hue.get();
    var l = Template.instance().lightness.get();
    var colors = [];
    for (steps; steps >= 0; steps--) {
      colors.push("hsla(" + h + ", " + steps * 20 + "%," + l + "%, 1)")
    };
    return { style: "background: linear-gradient(to left, " + colors + ");"}
  },
  lightnessGradient: function() {
    var steps = 5;
    var s = Template.instance().saturation.get();
    var h = Template.instance().hue.get();
    var colors = [];
    for (steps; steps >= 0; steps--) {
      colors.push("hsla(" + h + ", " + s + "%," + steps * 20 + "%, 1)")
    };
    return { style: "background: linear-gradient(to left, " + colors + ");"}
  },
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
    t.setHslFromColor(e.target.value)
    t.addHistoryRecord();
  },
  'click .js-colorInput' : function (e, t) {
    $(e.target).select();
  },
  'click .js-setHistoryColor' : function (e, t) {
    var self = this;
    t.setHslFromColor(self.color);
  },
  'click .js-setRandomColor' : function (e, t) {
    var self = this;
    t.setHslFromColor(self.color);
    t.addHistoryRecord();
  },
  'click .js-setPreviuosColor' : function (e, t) {
    t.setHslFromColor(e.target.dataset.color)
  },
  'click .js-setRandomColorType' : function (e, t) {
    t.randomColorRange.set(e.target.dataset.color);
  },
  'input .js-updateHue' : function (e, t) {
    t.hue.set(e.target.value);
  },
  'input .js-updateSaturation' : function (e, t) {
    t.saturation.set(e.target.value);
  },
  'input .js-updateLightness' : function (e, t) {
    t.lightness.set(e.target.value);
  },
  'change .js-updateHue' : function (e, t) {
    t.addHistoryRecord();
  },
  'change .js-updateSaturation' : function (e, t) {
    t.addHistoryRecord();
  },
  'change .js-updateLightness' : function (e, t) {
    t.addHistoryRecord();
  }
});
