Template.ooColorPicker_Schemes.onCreated(function () {
  var self = this;
  self.complements = function() {
    var currentColor = Color(self.parent().getCurrentHslString())

    var complement = { color: currentColor.clone().rotate(180).hslString() }
    var complementA = { color: currentColor.clone().rotate(180).darken(0.1).hslString() }
    var complementB = { color: currentColor.clone().rotate(180).lighten(0.1).hslString() }

    return [{color: currentColor.hslString()}, complement, complementA, complementB]
  }

  self.splitComplements = function() {
    var currentColor = Color(self.parent().getCurrentHslString())

    var splitA =  { color: currentColor.clone().rotate(180+15).hslString() }
    var splitB =  { color: currentColor.clone().rotate(180-15).hslString() }
    var splitC =  { color: currentColor.clone().rotate(180+30).hslString() }
    var splitD =  { color: currentColor.clone().rotate(180-30).hslString() }

    return [splitA, splitB, {color: currentColor.hslString()}, splitC, splitD]
  }

  self.triadic = function() {
    var currentColor = Color(self.parent().getCurrentHslString())

    var triadicA = { color: currentColor.clone().rotate(180-60).hslString() }
    var triadicB = { color: currentColor.clone().rotate(180+60).hslString() }
    var triadicC = { color: currentColor.clone().rotate(180-75).hslString() }
    var triadicD = { color: currentColor.clone().rotate(180+75).hslString() }

    return [triadicA, triadicB, {color: currentColor.hslString()}, triadicC, triadicD]
  }

  self.tetradic = function() {
    var currentColor = Color(self.parent().getCurrentHslString())

    var tetradA = { color: currentColor.clone().rotate(180).hslString() }
    var tetradB = { color: currentColor.clone().rotate(180+30).hslString() }
    var tetradC = { color: currentColor.clone().rotate(30).hslString() }

    return [{color: currentColor.hslString()}, tetradA, tetradB, tetradC, ]
  }

  self.monochromatic = function() {
    var currentColor = Color(self.parent().getCurrentHslString())

    var monA = { color: currentColor.clone().lighten(0.4).hslString() }
    var monB = { color: currentColor.clone().lighten(0.3).hslString() }
    var monC = { color: currentColor.clone().lighten(0.2).hslString() }
    var monD = { color: currentColor.clone().lighten(0.1).hslString() }
    var monE = { color: currentColor.clone().darken(0.1).hslString() }
    var monF = { color: currentColor.clone().darken(0.2).hslString() }
    var monG = { color: currentColor.clone().darken(0.3).hslString() }
    var monH = { color: currentColor.clone().darken(0.4).hslString() }

    return [monA, monB, monC, monD, {color: currentColor.hslString()}, monE, monF, monG, monH]
  }

  self.analagous = function() {
    var currentColor = Color(self.parent().getCurrentHslString())

    var analogA = { color: currentColor.clone().rotate(-40).hslString() }
    var analogB = { color: currentColor.clone().rotate(-30).hslString() }
    var analogC = { color: currentColor.clone().rotate(-20).hslString() }
    var analogD = { color: currentColor.clone().rotate(-10).hslString() }
    var analogE = { color: currentColor.clone().rotate(10).hslString() }
    var analogF = { color: currentColor.clone().rotate(20).hslString() }
    var analogG = { color: currentColor.clone().rotate(30).hslString() }
    var analogH = { color: currentColor.clone().rotate(40).hslString() }

    return [analogA, analogB, analogC, analogD, {color: currentColor.hslString()}, analogE, analogF, analogG, analogH]
  }
});

Template.ooColorPicker_Schemes.helpers({
  colorSchemes() {
   return ["complements", "splitComplements", "triadic", "monochromatic", "analagous"]
  },
  schemeSwatches() {
    return Template.instance()[this]()
  }
});
