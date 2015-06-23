var ooColorPickerHistory = new Meteor.Collection(null);

Template.ooColorPicker.onCreated(function () {
  var self = this;
  var color = "crimson";
  self.prevColor = new Blaze.ReactiveVar("crimson");
  self.currentColor = new Blaze.ReactiveVar(Color(color));

  self.hue = new Blaze.ReactiveVar(100);
  self.saturation = new Blaze.ReactiveVar(50);
  self.lightness = new Blaze.ReactiveVar(50);

  self.setHsl = function(color) {
    var hsl = Color(tinycolor(color).toRgbString())
    self.hue.set(hsl.hue());
    self.saturation.set(hsl.saturation());
    self.lightness.set(hsl.lightness());

    // Add history record
    ooColorPickerHistory.insert({
      color: hsl
    })
  }

  // self.H = new Blaze.ReactiveVar(tinycolor(color).toHsl().h);
  // self.S = new Blaze.ReactiveVar(tinycolor(color).toHsl().s);
  // self.L = new Blaze.ReactiveVar(tinycolor(color).toHsl().l);
  // self.A = new Blaze.ReactiveVar(tinycolor(color).toHsl().a);
});


// var convertToPercent = function(fraction) {
//   return Math.round((fraction * 100)) + '%';
// }

Template.ooColorPicker.helpers({
  currentColor : function () {
    return Template.instance().currentColor.get().hexString();
  },
  prevColor : function () {
    return Template.instance().prevColor.get();
  },
  historyColours : function () {
    return ooColorPickerHistory.find({});
  },
  currentRgb : function () {
    return Template.instance().currentColor.get().rgbString();
  },
  currentHsl : function () {
    return Template.instance().currentColor.get().hslString();
  },
  currentHex : function () {
    return Template.instance().currentColor.get().hexString();
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
  convertToPercent: function(fraction) {
    return Math.round((fraction * 100)) + '%';
  },
  roundPercent: function(fraction) {
    return Math.round(fraction);
  },
  hueG: function(fraction) {
    return Session.get("hue");
  },
  hueGradient: function() {
    var steps = 36;
    var s = Template.instance().saturation.get();
    var l = Template.instance().lightness.get();
    var colors = [];
    for (steps; steps >= 0; steps--) {
      colors.push("hsla(" + steps * 10 + ", " + s + "%," + l + "%, 1)")
    };
    return { style: "background: linear-gradient(to right, " + colors + ");"}
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
    t.setHsl(e.target.value)
  },
  'click .js-colorInput' : function (e, t) {
    $(e.target).select();
  },
  'input .js-updateHue' : function (e, t) {
    // t.currentColor.set(t.currentColor.get().hue(e.target.value));
    t.hue.set(e.target.value);
  },
  'input .js-updateSaturation' : function (e, t) {
    // t.currentColor.set(t.currentColor.get().saturation(e.target.value));
    t.saturation.set(e.target.value);
  },
  'input .js-updateLightness' : function (e, t) {
    // t.currentColor.set(t.currentColor.get().lightness(e.target.value));
    t.lightness.set(e.target.value);
  }
});
