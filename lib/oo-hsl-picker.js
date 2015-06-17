Template.ooColorPicker.onCreated(function () {
  var self = this;
  var color = "crimson";
  self.prevColor = new Blaze.ReactiveVar("crimson");
  self.currentColor = new Blaze.ReactiveVar(color);

  // self.H = new Blaze.ReactiveVar(tinycolor(color).toHsl().h);
  // self.S = new Blaze.ReactiveVar(tinycolor(color).toHsl().s);
  // self.L = new Blaze.ReactiveVar(tinycolor(color).toHsl().l);
  // self.A = new Blaze.ReactiveVar(tinycolor(color).toHsl().a);
});

Template.ooColorPicker.onRendered(function () {

});

// var convertToPercent = function(fraction) {
//   return Math.round((fraction * 100)) + '%';
// }

Template.ooColorPicker.helpers({
  currentColor : function () {
    return Template.instance().currentColor.get();
  },
  prevColor : function () {
    return Template.instance().prevColor.get();
  },
  currentRgb : function () {
    return tinycolor(Template.instance().currentColor.get()).toRgbString();
  },
  currentHsl : function () {
    return tinycolor(Template.instance().currentColor.get()).toHslString();
  },
  currentHex : function () {
    return tinycolor(Template.instance().currentColor.get()).toHexString();
  },
  hue : function () {
    return Math.round(tinycolor(Template.instance().currentColor.get()).toHsl().h);
  },
  saturation : function () {
    return tinycolor(Template.instance().currentColor.get()).toHsl().s;
  },
  luminance : function () {
    return tinycolor(Template.instance().currentColor.get()).toHsl().l;
  },
  convertToPercent: function(fraction) {
    return Math.round((fraction * 100)) + '%';
  }
});

var updateHsl = function(color, prop, val) {
  var hsl = tinycolor(color).toHsl();
  hsl[prop] = val;
  return tinycolor(hsl).toHexString();
}

Template.ooColorPicker.events({
  'input .js-colorInput' : function (e, t) {
    t.currentColor.set(tinycolor(e.target.value).toHexString());
  },
  'input .js-updateHue' : function (e, t) {
    t.currentColor.set(updateHsl(t.currentColor.get(), "h", e.target.value));
  },
  'input .js-updateSaturation' : function (e, t) {
    t.currentColor.set(updateHsl(t.currentColor.get(), "s", e.target.value));
  },
  'input .js-updateLuminance' : function (e, t) {
    t.currentColor.set(updateHsl(t.currentColor.get(), "l", e.target.value));
  }
});
