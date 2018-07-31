

export default class RecordPersister {
  constructor({cls, onSave, onRemove}) {
    this.cls = cls;
    this.onSave = onSave;
    this.onRemove = onRemove;
  }

  remove(record) {
    return this.onRemove(record.toJS());
  }

  save(record, options) {
    return new Promise((resolve, reject) => {
      const cleaned = this.clean(record.schema, record.toJS());
      this.validate(cleaned);
      this.onSave(cleaned).then(resolve).catch(reject);
    });
  }

  validate(record) {
    this.cls.validate(record);
  }

  clean(schema, record) {
    return schema.clean(record);
  }
}
