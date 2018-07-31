
import {COLLABORATOR_TYPES, COLLABORATOR_SKILLS, COLLABORATOR_TYPES_TO_LABELS} from 'firstcut-enum';

export default function CollaboratorFactory(Base, schema) {
  class Collaborator extends Base {
    static get collection_name() { return 'players' }

    get displayName() { return `${this.fullName}`; }
    get fullName() { return (this.firstName || "") + " " + (this.lastName || "");}
    get typeLabel() { return COLLABORATOR_TYPES[this.type]; }
    getSkillLabel(skill) {
      return COLLABORATOR_SKILLS[skill];
    }
    get entireHistory() {
      return this.history.map(event => {
        if (event.gig_type && event.gig_id) {
          const gig = this.models[event.gig_type].fromId(event.gig_id);
          if (!gig) {
            return event;
          }
          const collaborator_label = COLLABORATOR_TYPES_TO_LABELS[event.collaborator_key];
          event.title = `Added to ${gig.displayName} as a ${collaborator_label}`;
          return event;
        }
        return event;
      });
    }
  }

  Collaborator.schema = schema;

  return Collaborator;
}
