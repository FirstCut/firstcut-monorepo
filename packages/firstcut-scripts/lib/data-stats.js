"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = countVideographerCities;

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _fs = _interopRequireDefault(require("fs"));

function countVideographerCities() {
  // a very innefficient count
  var players = _firstcutModels.default.Collaborator.find({});

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
  var json = (0, _stringify.default)(counts);

  _fs.default.writeFileSync("/Users/artichokes/FirstCut/firstcutfirstcut-pipeline-consts/".concat(filename), json);
}