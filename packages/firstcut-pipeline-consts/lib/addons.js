"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAddOnPrice = getAddOnPrice;
exports.ADD_ONS = void 0;

var _immutable = require("immutable");

var PRICES = new _immutable.Record({
  SOCIAL_MEDIA_SNIPPET: '$100',
  CAPTIONS: '$35',
  TRANSCRIPT: '$6 per minute'
});
var ADD_ONS = Object.freeze({
  SOCIAL_MEDIA_SNIPPET: 'a social media snippet',
  CAPTIONS: 'captions',
  TRANSCRIPT: 'a transcript'
});
exports.ADD_ONS = ADD_ONS;

function getAddOnPrice(addOn) {
  switch (addOn) {
    case ADD_ONS.SOCIAL_MEDIA_SNIPPET:
      return PRICES.SOCIAL_MEDIA_SNIPPET;

    case ADD_ONS.CAPTIONS:
      return PRICES.CAPTIONS;

    case ADD_ONS.TRANSCRIPT:
      return PRICES.TRANSCRIPT;

    default:
      return 0;
  }
}