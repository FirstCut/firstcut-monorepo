
import schedule from 'node-schedule';
import { Map } from 'immutable';
import { PubSub } from 'pubsub-js';
import { createFirstCutModel } from 'firstcut-model-base';
import { JOBS } from './jobs.enum';
import JobSchema from './jobs.schema';

const Base = createFirstCutModel(JobSchema);

class Job extends Base {
  static get collectionName() { return 'jobs'; }

  static get schema() { return JobSchema; }

  static getExistingJobId({ record_id, key }) {
    const jobRecord = this.findOne({ key, 'event_data.record_id': record_id });
    return (jobRecord) ? jobRecord._id : null;
  }

  get cron() { return this.get('cron'); }

  execute() {
    JOBS[this.jobName](this.toJS());
  }
}

class Tracker {
  static cancelJob(id) {
    const running = this.runningJobs.get(id);
    if (running) {
      running.cancel();
      this.runningJobs = this.runningJobs.delete(id);
    }
  }

  static addToRunningJobs({ id, runningJob }) {
    if (!this.runningJobs) {
      this.runningJobs = new Map({});
    }
    this.runningJobs = this.runningJobs.set(id, runningJob);
  }

  static getRunningJob(id) { return this.runningJobs.get(id); }

  static rescheduleJob({ id, cron }) {
    const job = this.getRunningJob(id);
    if (job) {
      job.reschedule(cron);
    }
  }

  static scheduleJob(job) {
    const scheduled = schedule.scheduleJob(job.cron, Meteor.bindEnvironment(() => {
      try {
        job.execute();
        if (!job.isRecurring) {
          job.remove();
        }
      } catch (e) {
        PubSub.publish('error', e);
      }
    }));
    this.addToRunningJobs({ id: job._id, runningJob: scheduled });
  }
}

function subscribeToDatabaseChanges() {
  console.log('SUBSCRIBING');
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
}

Job.onInit = subscribeToDatabaseChanges;
export default Job;
