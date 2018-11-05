import { Meteor } from 'meteor/meteor';
import Models from '/imports/api/models';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { _ } from 'lodash';
import Analytics from 'firstcut-analytics';
import { userPlayerId } from 'firstcut-user-session';
import App from '../layouts/app';
import { getSubscriptions } from '../config';

const Subs = new SubsManager();
const PlayerSubs = new SubsManager();

const AppContainer = withTracker((props) => {
  if (Meteor.user() && !_.isEqual(this.previousSubscriptions, getSubscriptions())) {
    this.previousSubscriptions = getSubscriptions();
    Subs.clear();
  }

  const playerId = userPlayerId();
  const playersHandle = Meteor.subscribe('players.public');
  const subscriptions = getSubscriptions().filter(s => s !== 'players.public');
  const handles = subscriptions.map(name => Meteor.subscribe(name, playerId));
  const doneLoading = handles.reduce((ready, handle) => ready && handle.ready(), true);

  if (doneLoading && !this.hasIdentifiedCurrentUser) {
    Analytics.identifyCurrentUser();
    this.hasIdentifiedCurrentUser = true;
  }
  console.log('redo');
  return {
    doneLoading,
    playersDoneLoading: playersHandle.ready(),
    user: Meteor.user(),
  };
})(App);

export default AppContainer;
