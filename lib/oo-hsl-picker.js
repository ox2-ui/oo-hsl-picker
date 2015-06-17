Template.ooColorPicker.onCreated(function () {
  var self = this;
  var color = "crimson";
  self.prevColor = new Blaze.ReactiveVar("crimson");
  self.currentColor = new Blaze.ReactiveVar(tinycolor(color).toHsl());

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
    return tinycolor(Template.instance().currentColor.get()).toHslString();
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
    return Template.instance().currentColor.get().h;
  },
  saturation : function () {
    console.log('%c Template.instance().currentColor.get().s   ',  'background: #FF9900; color: white; padding: 1px 15px 1px 5px;',typeof Template.instance().currentColor.get().s);
    return Template.instance().currentColor.get().s;
  },
  luminance : function () {
    return Template.instance().currentColor.get().l;
  },
  convertToPercent: function(fraction) {
    return Math.round((fraction * 100)) + '%';
  },
  roundPercent: function(fraction) {
    return Math.round(fraction);
  }
});

var updateHsl = function(hsl, prop, val) {
  hsl[prop] = Number.parseInt(val);
  console.log('%c hsl   ',  'background: #FF9900; color: white; padding: 1px 15px 1px 5px;', hsl);
  return hsl;
}

Template.ooColorPicker.events({
  'input .js-colorInput' : function (e, t) {
    var rgb = tinycolor(e.target.value).toRgb();
    var hsl = tinycolor(rgb).toHsl();
    console.dir(rgb);
    console.dir(hsl);
    t.currentColor.set(hsl);
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
