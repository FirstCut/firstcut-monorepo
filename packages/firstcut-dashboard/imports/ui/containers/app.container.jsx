import { Meteor } from 'firstcut-meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'firstcut-meteorhacks:subs-manager';
import { _ } from 'lodash';
import App from '../layouts/app';
import { userPlayerId } from 'firstcut-players';
import { getSubscriptions } from '../config';
import Analytics from 'firstcut-analytics';

const Subs = new SubsManager();
const PlayerSubs = new SubsManager();

const AppContainer = withTracker((props) => {
  if (Meteor.user() && !_.isEqual(this.previousSubscriptions, getSubscriptions())) {
    this.previousSubscriptions = getSubscriptions();
    Subs.clear();
  }

  const playerId = userPlayerId();
  const playersHandle = PlayerSubs.subscribe('players.public');
  const subscriptions = getSubscriptions().filter(s => s !== 'players.public');
  console.log(subscriptions);
  const handles = subscriptions.map(name => Subs.subscribe(name, playerId));
  const doneLoading = handles.reduce((ready, handle) => ready && handle.ready(), true);

  if (doneLoading && !this.hasIdentifiedCurrentUser) {
    Analytics.identifyCurrentUser();
    this.hasIdentifiedCurrentUser = true;
  }
  return {
    doneLoading,
    playersDoneLoading: playersHandle.ready(),
    user: Meteor.user(),
  };
})(App);

export default AppContainer;
