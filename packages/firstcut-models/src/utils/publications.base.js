
export default function enableBasePublications(cls) {
  if (Meteor.isServer) {
    const name = `${cls.collectionName}.all`;
    Meteor.publish(name, () => cls.collection.find({}));
  }
}
