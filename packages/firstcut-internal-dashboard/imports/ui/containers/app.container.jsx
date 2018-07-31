import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import App from '../layouts/app.jsx';
import {userPlayerId} from 'firstcut-utils';
import {getSubscriptions} from '../config';
import {SubsManager} from 'meteor/meteorhacks:subs-manager';

const Subs = new SubsManager();

const AppContainer = withTracker((props) => {
  const playerId = userPlayerId()
  const handles = getSubscriptions().map(name => Subs.subscribe(name, playerId));
  let done_loading = handles.reduce((ready, handle) => ready && handle.ready(), true);
  return {
    loading: !done_loading,
    user: Meteor.user()
  };

})(App);

export default AppContainer;
