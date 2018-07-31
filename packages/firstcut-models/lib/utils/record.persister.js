"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RecordPersister =
/*#__PURE__*/
function () {
  function RecordPersister(_ref) {
    var cls = _ref.cls,
        onSave = _ref.onSave,
        onRemove = _ref.onRemove;

    _classCallCheck(this, RecordPersister);

    this.cls = cls;
    this.onSave = onSave;
    this.onRemove = onRemove;
  }

  _createClass(RecordPersister, [{
    key: "remove",
    value: function remove(record) {
      return this.onRemove(record.toJS());
    }
  }, {
    key: "save",
    value: function save(record, options) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var cleaned = _this.clean(record.schema, record.toJS());

        _this.validate(cleaned);

        _this.onSave(cleaned).then(resolve).catch(reject);
      });
    }
  }, {
    key: "validate",
    value: function validate(record) {
      this.cls.validate(record);
    }
  }, {
    key: "clean",
    value: function clean(schema, record) {
      return schema.clean(record);
    }
  }]);

  return RecordPersister;
}();

exports.default = RecordPersister;