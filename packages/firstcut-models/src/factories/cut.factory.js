import {CUT_TYPES, EVENTS} from 'firstcut-enum';

export default function CutFactory(Base, schema) {
  class Cut extends Base {

    static get collection_name() {
      return 'cuts';
    }

    filesRoot(field) {
      return this.projectDirectory + 'cuts';
    }

    get projectDirectory() {
      if (!this.project) {
        throw new Meteor.Error('requirements-not-fulfilled', 'Project is required in order to upload files for this document');
      }
      return this.project.projectDirectory;
    }

    get hasFile() {
      return this.fileId || this.fileUrl;
    }
    get brandIntroId() {
      return (this.company)
        ? this.company.brandIntroId
        : '';
    }

    get displayName() {
      return `${this.deliverableDisplayName} (${this.typeLabel})`;
    }
    get typeLabel() {
      return CUT_TYPES[this.type];
    }

    get deliverable() {
      return (this.deliverableId)
        ? this.deliverableService.fromId(this.deliverableId)
        : null;
    }
    get deliverableDisplayName() {
      return (this.deliverable)
        ? this.deliverable.displayName
        : '';
    }

    get postpoOwnerDisplayName() {
      return (this.postpoOwner)
        ? this.postpoOwner.displayName
        : '';
    }
    get adminOwnerDisplayName() {
      return (this.adminOwner)
        ? this.adminOwner.displayName
        : '';
    }

    get postpoOwner() {
      return (this.deliverable)
        ? this.deliverable.postpoOwner
        : null;
    }
    get adminOwner() {
      return (this.deliverable)
        ? this.deliverable.adminOwner
        : null;
    }
    get clientOwner() {
      return (this.deliverable)
        ? this.deliverable.clientOwner
        : null;
    }
    get project() {
      return (this.deliverable)
        ? this.deliverable.project
        : null;
    }
    get company() {
      return (this.project)
        ? this.project.company
        : null;
    }

    get versionDisplayName() {
      return `v${this.version}`;
    }

    get isSnippet() {
      return this.type == 'SNIPPET';
    }
    get hasBrandIntro() {
      return (this.company)
        ? this.company.hasBrandIntro
        : false;
    }
    get hasBeenVerified() {
      return this.eventsInHistory.includes(EVENTS.has_been_sent_to_client);
    }
    get hasBeenApprovedByClient() {
      return this.eventsInHistory.includes(EVENTS.cut_approved_by_client);
    }
    get cutHasBeenSentToClient() {
      return this.eventsInHistory.includes(EVENTS.send_cut_to_client);
    }
    get hasVerifiedRevisions() {
      return this.eventsInHistory.includes(EVENTS.revisions_sent);
    }
    get clientHasSubmittedFeedback() {
      return this.eventsInHistory.includes(EVENTS.feedback_submitted_by_client) || this.hasVerifiedRevisions;
    }
    get clientSubmittedFeedbackEvent() {
      return _.first(this.getEventsOfType(EVENTS.feedback_submitted_by_client));
    }
  }

  Cut.schema = schema;
  return Cut;
}
