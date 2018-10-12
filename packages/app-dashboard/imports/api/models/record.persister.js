

export default class RecordPersister {
  constructor({
    cls, onSave, onRemove, namespace,
  }) {
    this.cls = cls;
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
