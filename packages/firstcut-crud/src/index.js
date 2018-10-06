
import { ValidatedMethod } from 'mdg:validated-method';
import Random from 'meteor-standalone-random';

let Models = null;
export function initCollections(models) {
  Object.keys(models).forEach((key) => {
    const model = models[key];
    if (!model.collection) {
      const collection = new Mongo.Collection(model.collectionName);
      collection.attachSchema(model.schema.asSchema);
      model.collection = collection;
    }
    if (model.onInitCollection) {
      model.onInitCollection();
    }
  });
  Models = models;
}

export function saveRecord(record) {
  if (!models) {
    throw new Error('models not yet initialized. call initCollections with the models to enable');
  }
  return new Promise((resolve, reject) => {
    const cleaned = this.clean(record);
    this.validate(cleaned);
    this.onSave(cleaned).then(resolve).catch(reject);
    save.call({ record: cleaned, modelName: record.modelName }, (err, savedRecord) => {
      if (err) {
        reject(err);
      }
      const model = Models[modelName];
      resolve(Model.createNew(savedRecord));
    });
  });
}

const save = new ValidatedMethod({
  name: 'save_record',
  validate: () => true, // yes bad
  run({ record, modelName }) {
    if (!record._id) {
      record._id = Random.id();
    }
    // this.unblock();
    const collection = Models[modelName].collection;
    collection.upsert(record._id, { $set: record });
    return record;
  },
});
