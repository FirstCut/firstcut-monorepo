"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = JobFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

var _pubsubJs = require("pubsub-js");

var _immutable = require("immutable");

var JOBS = {
  scheduled_event: function scheduled_event(job) {
    _pubsubJs.PubSub.publish(job.event_data.event, job.event_data);
  },
  verify_google_credentials: function verify_google_credentials() {
    Meteor.call('checkOauthCredentials', function (err) {
      if (err) {
        _pubsubJs.PubSub.publish('error', {
          'error retrieving refresh token': err
        });
      } else {
        console.log('success');
      }
    });
  }
};

function JobFactory(Base, schema) {
  var Job =
  /*#__PURE__*/
  function (_Base) {
    (0, _inherits2.default)(Job, _Base);
    (0, _createClass2.default)(Job, null, [{
      key: "getExistingJobId",
      // static get model_name() { return 'jobs'; }
      value: function getExistingJobId(_ref) {
        var record_id = _ref.record_id,
            key = _ref.key;
        var job_record = this.findOne({
          key: key,
          'event_data.record_id': record_id
        });
        return job_record ? job_record._id : null;
      }
    }, {
      key: "collection_name",
      get: function get() {
        return 'jobs';
      }
    }]);

    function Job(properties) {
      (0, _classCallCheck2.default)(this, Job);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Job).call(this, properties));
    }

    (0, _createClass2.default)(Job, [{
      key: "cron",
      get: function get() {
        return this.get('cron');
      }
    }, {
      key: "execute",
      get: function get() {
        return JOBS[this.jobName];
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
        var running = this.running_jobs.get(id);

        if (running) {
          running.cancel();
          this.running_jobs = this.running_jobs.delete(id);
        }
      }
    }, {
      key: "addToRunningJobs",
      value: function addToRunningJobs(_ref2) {
        var id = _ref2.id,
            running_job = _ref2.running_job;

        if (!this.running_jobs) {
          this.running_jobs = new _immutable.Map({});
        }

        this.running_jobs = this.running_jobs.set(id, running_job);
      }
    }, {
      key: "getRunningJob",
      value: function getRunningJob(id) {
        return this.running_jobs.get(id);
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
            job.execute(job.toJS());

            if (!job.isRecurring) {
              job.remove();
            }
          } catch (e) {
            throw new Meteor.Error('job-error', e);
          }
        }));

        this.addToRunningJobs({
          id: job._id,
          running_job: scheduled
        });
      }
    }]);
    return Tracker;
  }();

  if (Meteor.isServer) {
    Meteor.startup(function () {
      // Job.collection.remove({});
      // Meteor.setInterval(JOBS['verify_google_credentials'], 12000);
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
    });
  }

  Job.schema = schema;
  console.log(Job);
  return Job;
}