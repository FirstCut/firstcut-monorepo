
import ClientSchema from './clients.schema';
import { createFirstCutModel } from '/imports/api/model-base';

const Base = createFirstCutModel(ClientSchema);

class Client extends Base {
  static get collectionName() { return 'clients'; }

  static get schema() { return ClientSchema; }

  hasBeenInvitedToPlatform() { return this.eventsInHistory.includes('send_invite_link'); }

  get displayName() { return `${this.fullName}`; }

  get fullName() { return `${this.firstName || ''} ${this.lastName || ''}`; }

  get company() { return this.companyService.fromId(this.companyId); }

  get companyDisplayName() { return (this.company) ? this.company.displayName : ''; }
}

export default Client;
