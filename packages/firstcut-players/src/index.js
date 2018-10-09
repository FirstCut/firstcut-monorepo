
import {
  initializeCollaboratorFromUser,
  getPlayerFromQuery,
  getUserEmails,
  numPendingTasks,
  getPendingPlayerTasks,
  getPlayer,
  playerIsClient,
  userPlayer,
  getPlayerFromEmails,
} from './player.utils';

export default function enablePlayerUtils(Models) {
  Models.initializeCollaboratorFromUser = initializeCollaboratorFromUser.bind(Models, Models);
  Models.numPendingTasks = numPendingTasks.bind(Models, Models);
  Models.getPendingPlayerTasks = getPendingPlayerTasks.bind(Models, Models);
  Models.getUserEmails = getUserEmails.bind(Models, Models);
  Models.getPlayerFromEmails = getPlayerFromEmails.bind(Models, Models);
  Models.getPlayerFromQuery = getPlayerFromQuery.bind(Models, Models);
  Models.getPlayer = getPlayer.bind(Models, Models);
  Models.playerIsClient = playerIsClient.bind(Models, Models);
  Models.userPlayer = userPlayer.bind(Models, Models);
}
