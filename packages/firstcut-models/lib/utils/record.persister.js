"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var RecordPersister =
/*#__PURE__*/
function () {
  function RecordPersister(_ref) {
    var cls = _ref.cls,
        onSave = _ref.onSave,
        onRemove = _ref.onRemove;
    (0, _classCallCheck2.default)(this, RecordPersister);
    this.cls = cls;
    this.onSave = onSave;
    this.onRemove = onRemove;
  }

  (0, _createClass2.default)(RecordPersister, [{
    key: "remove",
    value: function remove(record) {
      return this.onRemove(record.toJS());
    }
  }, {
    key: "save",
    value: function save(record, options) {
      var _this = this;

      return new _promise.default(function (resolve, reject) {
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