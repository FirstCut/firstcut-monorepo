
import schedule from 'node-schedule';
import { PubSub } from 'pubsub-js';
import { Map } from 'immutable';

const JOBS = {
  scheduled_event(job) {
    PubSub.publish(job.event_data.event, job.event_data);
  },
  verify_google_credentials() {
    Meteor.call('checkOauthCredentials', (err) => {
      if (err) {
        PubSub.publish('error', { 'error retrieving refresh token': err });
      } else {
        console.log('success');
      }
    });
  },
};

export default function JobFactory(Base, schema) {
  class Job extends Base {
    static get collection_name() { return 'jobs'; }

    // static get model_name() { return 'jobs'; }
    static getExistingJobId({ record_id, key }) {
      const job_record = this.findOne({ key, 'event_data.record_id': record_id });
      return (job_record) ? job_record._id : null;
    }

    constructor(properties) {
      super(properties);
    }

    get cron() { return this.get('cron'); }

    get execute() { return JOBS[this.jobName]; }
  }

  class Tracker {
    static cancelJob(id) {
      const running = this.running_jobs.get(id);
      if (running) {
        running.cancel();
        this.running_jobs = this.running_jobs.delete(id);
      }
    }

    static addToRunningJobs({ id, running_job }) {
      if (!this.running_jobs) {
        this.running_jobs = new Map({});
      }
      this.running_jobs = this.running_jobs.set(id, running_job);
    }

    static getRunningJob(id) { return this.running_jobs.get(id); }

    static rescheduleJob({ id, cron }) {
      const job = this.getRunningJob(id);
      if (job) {
        job.reschedule(cron);
      }
    }

    static scheduleJob(job) {
      const scheduled = schedule.scheduleJob(job.cron, Meteor.bindEnvironment(() => {
        try {
          job.execute(job.toJS());
          if (!job.isRecurring) {
            job.remove();
          }
        } catch (e) {
          throw new Meteor.Error('job-error', e);
        }
      }));
      this.addToRunningJobs({ id: job._id, running_job: scheduled });
    }
  }

  if (Meteor.isServer) {
    Meteor.startup(() => {
      // Job.collection.remove({});
      // Meteor.setInterval(JOBS['verify_google_credentials'], 12000);
      Job.collection.find({}).observe({
        added(doc) {
          const job = new Job(doc);
          Tracker.scheduleJob(job);
        },
        changed(fields, prev_fields) {
          Tracker.rescheduleJob({ id: fields._id, cron: fields.cron });
        },
        removed(id) {
          Tracker.cancelJob(id);
        },
      });
    });
  }

  Job.schema = schema;
  console.log(Job);
  return Job;
}
