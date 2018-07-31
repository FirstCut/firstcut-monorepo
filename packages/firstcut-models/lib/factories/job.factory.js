"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = JobFactory;

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

var _pubsubJs = require("pubsub-js");

var _immutable = require("immutable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var JOBS = {
  'scheduled_event': function scheduled_event(job) {
    _pubsubJs.PubSub.publish(job.event_data.event, job.event_data);
  },
  'verify_google_credentials': function verify_google_credentials() {
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
    _inherits(Job, _Base);

    _createClass(Job, null, [{
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
      _classCallCheck(this, Job);

      return _possibleConstructorReturn(this, _getPrototypeOf(Job).call(this, properties));
    }

    _createClass(Job, [{
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
      _classCallCheck(this, Tracker);
    }

    _createClass(Tracker, null, [{
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