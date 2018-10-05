"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

var _immutable = require("immutable");

var _pubsubJs = require("pubsub-js");

var _firstcutModelBase = require("firstcut-model-base");

var _jobs = require("./jobs.enum");

var _jobs2 = _interopRequireDefault(require("./jobs.schema"));

var Base = (0, _firstcutModelBase.createFirstCutModel)(_jobs2.default);

var Job =
/*#__PURE__*/
function (_Base) {
  (0, _inherits2.default)(Job, _Base);

  function Job() {
    (0, _classCallCheck2.default)(this, Job);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Job).apply(this, arguments));
  }

  (0, _createClass2.default)(Job, [{
    key: "execute",
    value: function execute() {
      _jobs.JOBS[this.jobName](this.toJS());
    }
  }, {
    key: "cron",
    get: function get() {
      return this.get('cron');
    }
  }], [{
    key: "getExistingJobId",
    value: function getExistingJobId(_ref) {
      var record_id = _ref.record_id,
          key = _ref.key;
      var jobRecord = this.findOne({
        key: key,
        'event_data.record_id': record_id
      });
      return jobRecord ? jobRecord._id : null;
    }
  }, {
    key: "collectionName",
    get: function get() {
      return 'jobs';
    }
  }, {
    key: "schema",
    get: function get() {
      return _jobs2.default;
    }
  }]);
  return Job;
}(Base);

var Tracker =
/*#__PURE__*/
function () {
  function Tracker() {
    (0, _classCallCheck2.default)(this, Tracker);
  }

  (0, _createClass2.default)(Tracker, null, [{
    key: "cancelJob",
    value: function cancelJob(id) {
      var running = this.runningJobs.get(id);

      if (running) {
        running.cancel();
        this.runningJobs = this.runningJobs.delete(id);
      }
    }
  }, {
    key: "addToRunningJobs",
    value: function addToRunningJobs(_ref2) {
      var id = _ref2.id,
          runningJob = _ref2.runningJob;

      if (!this.runningJobs) {
        this.runningJobs = new _immutable.Map({});
      }

      this.runningJobs = this.runningJobs.set(id, runningJob);
    }
  }, {
    key: "getRunningJob",
    value: function getRunningJob(id) {
      return this.runningJobs.get(id);
    }
  }, {
    key: "rescheduleJob",
    value: function rescheduleJob(_ref3) {
      var id = _ref3.id,
          cron = _ref3.cron;
      var job = this.getRunningJob(id);

      if (job) {
        job.reschedule(cron);
      }
    }
  }, {
    key: "scheduleJob",
    value: function scheduleJob(job) {
      var scheduled = _nodeSchedule.default.scheduleJob(job.cron, Meteor.bindEnvironment(function () {
        try {
          job.execute();

          if (!job.isRecurring) {
            job.remove();
          }
        } catch (e) {
          _pubsubJs.PubSub.publish('error', e);
        }
      }));

      this.addToRunningJobs({
        id: job._id,
        runningJob: scheduled
      });
    }
  }]);
  return Tracker;
}();

function subscribeToDatabaseChanges() {
  Job.collection.find({}).observe({
    added: function added(doc) {
      var job = new Job(doc);
      Tracker.scheduleJob(job);
    },
    changed: function changed(fields, prev_fields) {
      Tracker.rescheduleJob({
        id: fields._id,
        cron: fields.cron
      });
    },
    removed: function removed(id) {
      Tracker.cancelJob(id);
    }
  });
}

Job.onInit = subscribeToDatabaseChanges;
var _default = Job;
exports.default = _default;