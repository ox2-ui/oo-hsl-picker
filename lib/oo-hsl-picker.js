// Create a client-only collection for storing color picker history during the browser session
var ooColorPickerHistory = new Meteor.Collection(null);

Template.ooColorPicker.onCreated(function () {
  var self = this;
  var color = Color("hsl(180, 50%, 50%)");
  self.prevColor = new Blaze.ReactiveVar(color.hslString());

  self.hue = new Blaze.ReactiveVar(color.hue());
  self.saturation = new Blaze.ReactiveVar(color.saturation());
  self.lightness = new Blaze.ReactiveVar(color.lightness());
  self.randomColorType = new Blaze.ReactiveVar("red");
  self.colorSchemeType = new Blaze.ReactiveVar("analogous");

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
  }

  self.getCurrentHslString = function() {
    return "hsl(" + self.hue.get() + ", " + self.saturation.get() + "%, " + self.lightness.get() +"%)"
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

  self.getColorSchemeRange = function() {
    // var schemeColors = [];
    // // var scheme = tinycolor(self.getCurrentHslString())[self.colorSchemeType.get()]()
    // // scheme = scheme.map(function(t) { return t.toHexString(); });

    // var scheme = new ColorScheme;
    //   scheme.from_hue(self.hue.get())
    //         .scheme('mono')



    //   // var colors = scheme.colors();

    // scheme.colors().forEach(function(element){
    //   schemeColors.push({color: self.convertToHslString(element)})
    // })
    // return schemeColors;
    //
    // var color = Color(self.getCurrentHslString())
    // console.log('%c color   ',  'background: #FF9900; color: white; padding: 1px 15px 1px 5px;', color);


    var currentColor = Color(self.getCurrentHslString())

    var complement = { color: currentColor.clone().rotate(180).hslString() }
    var complementA = { color: currentColor.clone().rotate(180).darken(0.1).hslString() }
    var complementB = { color: currentColor.clone().rotate(180).lighten(0.1).hslString() }

    var splitA =  { color: currentColor.clone().rotate(195).hslString() }
    var splitB =  { color: currentColor.clone().rotate(165).hslString() }
    var splitC =  { color: currentColor.clone().rotate(210).hslString() }
    var splitD =  { color: currentColor.clone().rotate(150).hslString() }

    var triadicA = { color: currentColor.clone().rotate(120).hslString() }
    var triadicB = { color: currentColor.clone().rotate(240).hslString() }

    var tetradA = { color: currentColor.clone().rotate(180).hslString() }
    var tetradB = { color: currentColor.clone().rotate(210).hslString() }
    var tetradC = { color: currentColor.clone().rotate(30).hslString() }

    var analogA = { color: currentColor.clone().rotate(10).hslString() }
    var analogB = { color: currentColor.clone().rotate(20).hslString() }
    var analogC = { color: currentColor.clone().rotate(30).hslString() }
    var analogD = { color: currentColor.clone().rotate(40).hslString() }
    var analogF = { color: currentColor.clone().rotate(50).hslString() }

    return [{color: currentColor.hslString()}, complement, complementA, complementB, splitA, splitB,splitC, splitD, triadicA, triadicB, tetradA, tetradB , tetradC, {color: currentColor.hslString()}, analogA, analogB, analogC, analogD, analogF ]
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
    return Template.instance().getCurrentHslString() === this.color ? true : false;
  },
  rgbString : function () {
    return Template.instance().getCurrentRgbString();
  },
  hslString : function () {
    return Template.instance().getCurrentHslString();
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
  randomColors: function() {
    return Template.instance().getRandomColorRange();
  },
  randomHueButtons: function() {
    return ["red", "orange", "yellow", "green", "blue", "purple", "pink", "monochrome"]
  },
  colorSchemeButtons: function() {
    return ["analogous", "monochromatic", "splitcomplement", "triad", "tetrad"]
  },
  colorScheme: function() {
    return Template.instance().getColorSchemeRange();
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
    t.setCurrentHslFromColor(e.target.value)
    t.addHistoryRecord();
  },
  'click .js-colorInput' : function (e, t) {
    $(e.target).select();
  },
  'click .js-setHistoryColor' : function (e, t) {
    var self = this;
    t.setCurrentHsl(self.color);
  },
  'click .js-setRandomColor' : function (e, t) {
    var self = this;
    t.setCurrentHsl(self.color);
    t.addHistoryRecord();
  },
  'click .js-setPreviuosColor' : function (e, t) {
    t.setCurrentHslFromColor(e.target.dataset.color)
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
