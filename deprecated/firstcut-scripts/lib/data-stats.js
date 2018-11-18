"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = countVideographerCities;

var _fs = _interopRequireDefault(require("fs"));

// import Models from 'firstcut-models';
function countVideographerCities() {
  // a very innefficient count
  var players = Models.Collaborator.find({});
  var counts = players.reduce(function (result, player) {
    var cities = result;

    if (player.isQualifiedVideographer()) {
      var city = player.cityDisplayName;

      if (!cities[city]) {
        cities[city] = 0;
      }

      var numInCity = cities[city];
      cities[city] = numInCity + 1;
    }

    return cities;
  }, {});
  var filename = 'videographercities.json';
  var json = JSON.stringify(counts);

  _fs.default.writeFileSync("/Users/artichokes/FirstCut/firstcutfirstcut-pipeline-consts/".concat(filename), json);
}