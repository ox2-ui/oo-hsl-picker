Template.ooColorPicker.onCreated(function () {
  var self = this;
  var color = "crimson";
  self.prevColor = new Blaze.ReactiveVar("crimson");
  self.currentColor = new Blaze.ReactiveVar(Color(color));

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
    return Template.instance().currentColor.get().hslString();
  },
  prevColor : function () {
    return Template.instance().prevColor.get();
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
    return Template.instance().currentColor.get().hue();
  },
  saturation : function () {
    return Template.instance().currentColor.get().saturation();
  },
  lightness : function () {
    return Template.instance().currentColor.get().lightness();
  },
  convertToPercent: function(fraction) {
    return Math.round((fraction * 100)) + '%';
  },
  roundPercent: function(fraction) {
    return Math.round(fraction);
  }
});

// var updateHsl = function(hsl, prop, val) {
//   hsl[prop] = Number.parseInt(val);
//   console.log('%c hsl   ',  'background: #FF9900; color: white; padding: 1px 15px 1px 5px;', hsl);
//   return hsl;
// }

Template.ooColorPicker.events({
  'input .js-colorInput' : function (e, t) {
    var color = Color(tinycolor(e.target.value).toRgbString())
    t.currentColor.set(color);
  },
  'input .js-updateHue' : function (e, t) {
    t.currentColor.set(t.currentColor.get().hue(e.target.value));
  },
  'input .js-updateSaturation' : function (e, t) {
    t.currentColor.set(t.currentColor.get().saturation(e.target.value));
  },
  'input .js-updateLightness' : function (e, t) {
    t.currentColor.set(t.currentColor.get().lightness(e.target.value));
  }
});
