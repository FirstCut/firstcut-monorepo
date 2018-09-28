
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import RecordPersister from './record.persister';

export default function enableCrud(cls) {
  const persister = new RecordPersister({
    cls,
    namespace: cls.collectionName,
    onSave: r => new Promise((resolve, reject) => {
      const record = r;
      if (!record._id) {
        record._id = Random.id();
      }
      cls._persist_save.call(record, (err, updatedRecord) => {
        if (err) reject(err);
        // console.log('The new record has been returned');
        const newRecord = new cls(updatedRecord);
        resolve(newRecord);
      });
    }),
    onRemove: record => new Promise((resolve, reject) => {
      cls._persist_remove.call(record, (err, res) => {
        if (err) reject(err);
        resolve();
      });
    }),
  });

  let name = `${cls.collectionName}.upsert`;
  cls._persist_save = new ValidatedMethod({
    name,
    validate: cls.schema.validator(),
    run(record) {
      if (!record._id) {
        record._id = Random.id();
      }
      this.unblock();
      cls.collection.upsert(record._id, { $set: record });
      return record;
    },
  });

  name = `${cls.collectionName}.remove`;
  cls._persist_remove = new ValidatedMethod({
    name,
    validate: cls.schema.validator(),
    run(record) {
      if (Meteor.isServer) {
        cls.collection.remove(record._id);
      }
    },
  });
  cls.persister = persister;
}
