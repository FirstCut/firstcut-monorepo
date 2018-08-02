
import {
  executeAsyncWithCallback, logError, isEmpty, isURL, asUSDollars, htmlifyString, removePunctuation,
} from './utils';
import {
  isUTC, DATE_FORMATS, humanReadableDate, fromNowDate, userTimezone,
} from './datetime';
import { ensureLoggedIn } from './validate';
import {
  getPlayerFromQuery,
  getUserEmails,
  getPlayerIdFromUser,
  getPlayer,
  playerIsClient,
  userPlayer,
  userPlayerId,
  getPlayerFromEmails,
} from './player.utils';

// export const COLLABORATOR_TYPES_TO_LABELS = Object.freeze({
//   interviewer: 'Interviewer',
//   videographer: 'Videographer',
//   adminOwner: 'Admin Owner',
//   postpoOwner: 'PostProduction Owner',
//   clientOwner: 'Client Owner',
// });

export {
  getUserEmails,
  executeAsyncWithCallback,
  getPlayerFromEmails,
  getPlayerFromQuery,
  getPlayerIdFromUser,
  getPlayer,
  removePunctuation,
  playerIsClient,
  logError,
  userPlayer,
  isEmpty,
  isUTC,
  ensureLoggedIn,
  isURL,
  asUSDollars,
  htmlifyString,
  userPlayerId,
  userTimezone,
  DATE_FORMATS,
  humanReadableDate,
  fromNowDate,
};
