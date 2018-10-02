
import { _ } from 'lodash';
import { COLLABORATOR_TYPES, COLLABORATOR_SKILLS } from './collaborators.enum';
import { COLLABORATOR_TYPES_TO_LABELS } from 'firstcut-pipeline-consts';
import CollaboratorSchema from './collaborators.schema';
import { createFirstCutModel } from 'firstcut-model-base';

const Base = createFirstCutModel(CollaboratorSchema);

class Collaborator extends Base {
  static get collectionName() { return 'players'; }

  static get schema() { return CollaboratorSchema; }

  get displayName() { return `${this.fullName}`; }

  get fullName() { return `${this.firstName || ''} ${this.lastName || ''}`; }

  get typeLabel() { return COLLABORATOR_TYPES[this.type]; }

  get paymentMethodAsString() {
    return _.map(this.paymentMethod, method => `${method.type}: ${method.accountEmail}`);
  }

  hasQualifiedSkill(skill) {
    const qualifiedSkills = this.skills.filter(s => s.isQualified);
    const skillNames = qualifiedSkills.map(s => s.type);
    return skillNames.includes(skill);
  }

  isQualifiedVideographer() {
    return this.hasQualifiedSkill('CORPORATE_VIDEOGRAPHY');
  }

  getSkillLabel(skill) {
    return COLLABORATOR_SKILLS[skill];
  }

  get completeRecordAndChildrenHistory() {
    return this.history.map((e) => {
      const event = e;
      if (event.gig_type && event.gig_id) {
        const gig = this.models[event.gig_type].fromId(event.gig_id);
        if (!gig) {
          return event;
        }
        const collaboratorLabel = COLLABORATOR_TYPES_TO_LABELS[event.collaborator_key];
        event.title = `Added to ${gig.displayName} as a ${collaboratorLabel}`;
        return event;
      }
      return event;
    });
  }

  static getKrizaProfile() {
    return this.createNew({ email: 'kriza@firstcut.io', firstName: 'Kriza', slackHandle: '<@UBD403R9B>' });
  }

  static getNicoleProfile() {
    return this.createNew({ email: 'nicole@firstcut.io', firstName: 'Nicole', slackHandle: '<@UCFJTCQGH>' });
  }

  static getRobertProfile() {
    return this.createNew({ email: 'robert@firstcut.io', firstName: 'Robert', slackHandle: '<@U9K0UBP8C>' });
  }

  static getJorgeProfile() {
    return this.createNew({ email: 'jorge@firstcut.io', firstName: 'Jorge', slackHandle: '<@U40M4TR7S>' });
  }

  static getBillingProfile() {
    return this.createNew({
      firstName: 'Firstcut Billing',
      email: 'payments@firstcut.io',
    });
  }
}


export default Collaborator;
