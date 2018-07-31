
import {SHOOT_STAGES, CAMERAS, EVENTS} from 'firstcut-enum';
import {getHeadshotURL, getScreenshotURL} from 'firstcut-retrieve-url';
import {SHOOT_BLUEPRINTS} from 'firstcut-blueprints';
import moment from 'moment';

export default function ShootFactory(Base, schema) {
  class Shoot extends Base {

    static get collection_name() {
      return 'shoots'
    }

    static headshotURL(filename) {
      return getHeadshotURL(filename);
    }
    static screenshotURL(filename) {
      return getScreenshotURL(filename);
    }

    filesRoot(field) {
      if (field == 'footageFiles') {
        const folder_name = this.generateFootageFolderName();
        return Meteor.settings.public.footage_folder + '/' + folder_name;
      } else {
        return '';
      }
    }

    newInvoice() {
      return this.invoiceService.createNew({gigId: this._id, type: 'SHOOT'});
    }

    generateDependentRecords() {
      if (this.isDummy || this.project.isDummy || !this.videographerId) {
        return [];
      }
      if (this.videographerId) {
        let booking_invoice = this.newInvoice();
        booking_invoice = booking_invoice.set('payeeId', this.videographerId);
        booking_invoice = booking_invoice.set('note', 'Booking fee');
        booking_invoice = booking_invoice.set('amount', 125);

        let hourly_invoice = this.newInvoice();
        hourly_invoice = hourly_invoice.set('payeeId', this.videographerId);
        hourly_invoice = hourly_invoice.set('note', 'Hourly');
        return [hourly_invoice, booking_invoice];
      } else {
        return [];
      }
    }

    screenshotCollaborator(screenshot) {
      const user = Meteor.users.findOne(screenshot.userId);
      let collaborator = (user && user.profile.playerId)
        ? this.collaboratorService.fromId(user.profile.playerId)
        : null;
      //if that didn't work, perhaps the screenshot's userId is a collaborator Id, so try to get a collaborator directly
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
    screenshotRejected(s) {
      return s.notes != null;
    }
    screenshotApproved(s) {
      return s.approved === true;
    }
    getScreenshotApprovalDisplayString(s) {
      if (this.screenshotRejected(s)) {
        return 'Rejected';
      } else if (this.screenshotApproved(s)) {
        return 'Approved';
      } else {
        return '';
      }
    }
    getScreenshotDisplayString(s) {
      return `${this.getCameraDisplayString(s)} -- ${this.getVersionDisplayString(s)}`;
    }
    getVersionDisplayString(s) {
      const human_version = s.version + 1;
      return `Version ${human_version}`
    }
    getCameraDisplayString(s) {
      return CAMERAS[s.cameraId];
    }
    generateFootageFolderName() {
      return `footage - ${this.projectDisplayName} - ${this._id}/`
    }

    get latestCheckin() {
      return _.last(_.sortBy(this.checkins.toArray(), ['timestamp']));
    }
    get latestCheckout() {
      return _.last(_.sortBy(this.checkouts.toArray(), ['timestamp']));
    }
    get endDatetime() {
      return moment(this.date).add(this.duration, 'hours').toDate()
    }

    get displayName() {
      return `${this.projectDisplayName} at ${this.location.name}`;
    }
    get timezone() {
      return (this.location)
        ? this.location.timezone
        : null;
    }
    // get calendarEventId() {
    //   const date_changed_events = this.history.toArray().filter(event => event.event == 'shoot_event_updated');
    //   const with_event_id = _.first(date_changed_events.filter(event => event.event_id != null));
    //   return (with_event_id)
    //     ? with_event_id.event_id
    //     : null;
    // }
    //
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
        : ""
    }
    get videographerDisplayName() {
      return (this.videographer)
        ? this.videographer.displayName
        : ""
    }
    get interviewerDisplayName() {
      return (this.interviewer)
        ? this.interviewer.displayName
        : ""
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
    get stageLabel() {
      return (this.stage)
        ? SHOOT_STAGES[this.stage]
        : "";
    }
    get hasVerifiedFootage() {
      return this.eventsInHistory.includes(EVENTS.footage_verified);
    }
    get preproHasBeenKickedOff() {
      return this.eventsInHistory.includes(EVENTS.preproduction_kickoff);
    }
  }

  Shoot.schema = schema;
  Shoot.available_blueprints = SHOOT_BLUEPRINTS;
  return Shoot;
}
