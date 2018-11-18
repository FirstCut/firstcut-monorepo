

// const saveRecord = new ValidatedMethod({
//   name,
//   validate: () => {},
//   run({ record, clsName }) {
//     if (!record._id) {
//       record._id = oid();
//     }
//     console.log('ON SERVER');
//     console.log(Meteor.isServer);
//     console.log(cls.collectionName);
//     console.log('upeset');
//     console.log(record.SOWFile);
//     console.log(record);
//     cls.collection.remove(record._id);
//     cls.collection.insert(record);
//     return record;
//   },
// });
//
export default class RecordPersister {
  constructor({
    cls, onSave, onRemove, namespace,
  }) {
    this.cls = cls;
    // this.collections = createCollections(classes);
    this.onSave = onSave;
    this.onRemove = onRemove;
    this.namespace = namespace;
  }

  remove(record) {
    return this.onRemove(record.toJS());
  }

  save(record) {
    return new Promise((resolve, reject) => {
      const cleaned = this.clean(record);
      this.validate(cleaned);
      this.onSave(cleaned).then(resolve).catch(reject);
      // saveRecord.call(cleaned, (err, updatedRecord) => {
      //   console.log('CALLING SAVE');
      //   if (err) reject(err);
      //   console.log('The new record has been returned');
      //   const newRecord = new cls(updatedRecord);
      //   resolve(newRecord);
      // });
    });
  }

  validate(record) {
    if (this.cls.validate && typeof this.cls.validate === 'function') {
      this.cls.validate(record);
    }
  }

  clean(record) {
    // const withAutovalues = this.cls.schema.calculateAutovalueFields(record);
    return this.cls.schema.clean(record.toJS());
  }
}

function createCollections(classes) {
  return classes.forEach((cls) => {});
}
