
import sinon from 'sinon';

export function stubUser(currentUserId) {
  try {
    Meteor.userId();
  } catch (e) {
    const TEST_USER_ID = "BDBPjnXYtn4Qf4bYD";
    sinon.stub(Meteor, 'userId', () => TEST_USER_ID);
    sinon.stub(Meteor, 'user', () => Meteor.users.findOne({ _id: TEST_USER_ID}));
  }
}
