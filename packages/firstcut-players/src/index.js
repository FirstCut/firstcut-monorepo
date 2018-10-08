
import {
  initializeCollaboratorFromUser,
  getPlayerFromQuery,
  userId,
  getUserEmails,
  numPendingTasks,
  getPendingPlayerTasks,
  getPlayerIdFromUser,
  getPlayer,
  playerIsClient,
  inSimulationMode,
  setSimulationPlayerId,
  userPlayer,
  userPlayerId,
  getPlayerFromEmails,
} from './player.utils';

export default function enablePlayerUtils(Models) {
  Models.userId = userId.bind(Models, Models);
  Models.initializeCollaboratorFromUser = initializeCollaboratorFromUser.bind(Models, Models);
  Models.numPendingTasks = numPendingTasks.bind(Models, Models);
  Models.setSimulationPlayerId = setSimulationPlayerId.bind(Models, Models);
  Models.inSimulationMode = inSimulationMode.bind(Models, Models);
  Models.getPendingPlayerTasks = getPendingPlayerTasks.bind(Models, Models);
  Models.getUserEmails = getUserEmails.bind(Models, Models);
  Models.getPlayerFromEmails = getPlayerFromEmails.bind(Models, Models);
  Models.getPlayerFromQuery = getPlayerFromQuery.bind(Models, Models);
  Models.getPlayerIdFromUser = getPlayerIdFromUser.bind(Models, Models);
  Models.getPlayer = getPlayer.bind(Models, Models);
  Models.playerIsClient = playerIsClient.bind(Models, Models);
  Models.userPlayer = userPlayer.bind(Models, Models);
  Models.userPlayerId = userPlayerId.bind(Models, Models);
}
