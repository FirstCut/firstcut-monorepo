
import { hasUserProfile } from 'firstcut-utils';

export default function ClientFactory(Base, schema) {
  class Client extends Base {

    constructor(props) {
      super(props);
      hasUserProfile.call({playerEmail: this.email}, (err, has_profile) => {
        this.hasUserProfile = has_profile;
      });
    }
    static get collection_name() { return 'clients'; }

    get displayName() { return `${this.fullName}`; }
    get fullName() { return (this.firstName || "") + " " + (this.lastName || ""); }
    get hasUserProfile() { return this._has_profile; }
    set hasUserProfile(has) { this._has_profile = has; }

    get company() { return this.companyService.fromId(this.companyId); }
    get companyDisplayName() { return (this.company)? this.company.displayName:""; }
  }

  Client.schema = schema;
  return Client;
}
