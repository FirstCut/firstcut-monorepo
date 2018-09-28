
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { _ } from 'lodash';
import { STAGES, CAMERAS } from './shoots.enum';
import { EVENTS } from 'firstcut-pipeline-consts';
import { getHeadshotURL, getScreenshotURL } from 'firstcut-retrieve-url';
import SHOOT_BLUEPRINTS from './shoots.blueprints';
import ShootSchema from './shoots.schema';
import { createFirstCutModel } from '/imports/api/model-base';

const Base = createFirstCutModel(ShootSchema);

class Shoot extends Base {
  static get collectionName() {
    return 'shoots';
  }

  static get schema() {
    return ShootSchema;
  }

  static headshotURL(filename) {
    return getHeadshotURL(filename);
  }

  static screenshotURL(filename) {
    return getScreenshotURL(filename);
  }

  filesRoot(field) {
    if (field === 'footageFiles') {
      const folderName = this.generateFootageFolderName();
      return `${Meteor.settings.public.footage_folder}/${folderName}`;
    }
    return '';
  }

  newInvoice(props = {}) {
    return this.invoiceService.createNew({ gigId: this._id, type: 'SHOOT', ...props });
  }

  isBookingFeeInvoice() {
    return this.invoiceService.find({ gigId: this._id, note: { $regex: /[Bb]ooking/ } });
  }

  getBookingFeeInvoices() {
    return this.invoiceService.find({ gigId: this._id, note: { $regex: /[Bb]ooking/ } });
  }

  meetsRequirementsForGeneratedInvoices() {
    if (this.isDummy || this.project.isDummy || !this.videographerId) {
      return false;
    }
    return true;
  }

  getBehindTheScenesShots() {
    return this.screenshots.filter(s => isBehindTheScenesCamId(s.cameraId));
  }

  getFramingShots() {
    return this.screenshots.filter(s => !isBehindTheScenesCamId(s.cameraId));
  }

  generateHourlyInvoice(collaborator) {
    if (!this.meetsRequirementsForGeneratedInvoices()) {
      return null;
    }
    return this.newInvoice({
      payeeId: collaborator._id,
      note: 'Hourly',
    });
  }

  generateBookingInvoice(collaborator) {
    if (!this.meetsRequirementsForGeneratedInvoices()) {
      return null;
    }
    return this.newInvoice({
      payeeId: collaborator._id,
      note: 'Booking fee',
      amount: 125,
    });
  }

  screenshotCollaborator(screenshot) {
    const user = Meteor.users.findOne(screenshot.userId);
    let collaborator = (user && user.profile.playerId)
      ? this.collaboratorService.fromId(user.profile.playerId)
      : null;
      // if that didn't work, perhaps the screenshot's userId is a
      // collaborator Id, so try to get a collaborator directly
    if (!user) {
      collaborator = this.collaboratorService.fromId(screenshot.userId);
    }
    return collaborator;
  }

  headshotURL(filename) {
    return this.constructor.headshotURL(filename);
  }

  screenshotURL(filename) {
    return this.constructor.screenshotURL(filename);
  }

  static screenshotRejected(s) {
    return s.notes != null;
  }

  static screenshotApproved(s) {
    return s.approved === true;
  }

  getScreenshotApprovalDisplayString(s) {
    if (this.constructor.screenshotRejected(s)) {
      return 'Rejected';
    } if (this.constructor.screenshotApproved(s)) {
      return 'Approved';
    }
    return '';
  }

  static getScreenshotDisplayString(s) {
    return `${this.getCameraDisplayString(s)} -- ${this.getVersionDisplayString(s)}`;
  }

  static getVersionDisplayString(s) {
    const humanVersion = s.version + 1;
    return `Version ${humanVersion}`;
  }

  static getCameraDisplayString(s) {
    return CAMERAS[s.cameraId];
  }

  generateFootageFolderName() {
    return `footage - ${this.projectDisplayName} - ${this._id}/`;
  }

  get latestCheckin() {
    return _.last(_.sortBy(this.checkins.toArray(), ['timestamp']));
  }

  get latestCheckout() {
    return _.last(_.sortBy(this.checkouts.toArray(), ['timestamp']));
  }

  get endDatetime() {
    return moment(this.date).add(this.duration, 'hours').toDate();
  }

  get displayName() {
    let name = this.projectDisplayName;
    if (this.location.name) {
      name += ` at ${this.location.name}`;
    }
    return name;
  }

  get timezone() {
    return (this.location)
      ? this.location.timezone
      : null;
  }

  get project() {
    return this.projectService.fromId(this.projectId);
  }

  get videographer() {
    return this.collaboratorService.fromId(this.videographerId);
  }

  get interviewer() {
    return this.collaboratorService.fromId(this.interviewerId);
  }

  get company() {
    return (this.project)
      ? this.project.company
      : null;
  }

  get adminOwner() {
    return (this.project)
      ? this.project.adminOwner
      : null;
  }

  get clientOwner() {
    return (this.project)
      ? this.project.clientOwner
      : null;
  }

  get adminOwnerDisplayName() {
    return (this.adminOwner)
      ? this.adminOwner.displayName
      : '';
  }

  get videographerDisplayName() {
    return (this.videographer)
      ? this.videographer.displayName
      : '';
  }

  get interviewerDisplayName() {
    return (this.interviewer)
      ? this.interviewer.displayName
      : '';
  }

  get videographerSlackHandle() {
    if (!this.videographer) {
      return '';
    }
    return (this.videographer.slackHandle)
      ? this.videographer.slackHandle
      : this.videographer.firstName;
  }

  get interviewerSlackHandle() {
    if (!this.interviewer) {
      return '';
    }
    return (this.interviewer.slackHandle)
      ? this.interviewer.slackHandle
      : this.interviewer.firstName;
  }

  get latestKeyEventLabel() {
    return (this.stage)
      ? STAGES[this.stage]
      : '';
  }

  get hasVerifiedFootage() {
    return this.eventsInHistory.includes(EVENTS.footage_verified);
  }

  get preproHasBeenKickedOff() {
    return this.eventsInHistory.includes(EVENTS.preproduction_kickoff);
  }
}

function isBehindTheScenesCamId(id) {
  console.log(id);
  return id && id.match(/behindTheScenes/) != null;
}

Shoot.availableBlueprints = SHOOT_BLUEPRINTS;
export default Shoot;
