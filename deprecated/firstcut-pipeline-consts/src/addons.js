import { Record } from 'immutable';

const PRICES = new Record({
  SOCIAL_MEDIA_SNIPPET: '$100',
  CAPTIONS: '$35',
  TRANSCRIPT: '$6 per minute',
});

const ADD_ONS = Object.freeze({
  SOCIAL_MEDIA_SNIPPET: 'a social media snippet',
  CAPTIONS: 'captions',
  TRANSCRIPT: 'a transcript',
});

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

export { ADD_ONS, getAddOnPrice };
