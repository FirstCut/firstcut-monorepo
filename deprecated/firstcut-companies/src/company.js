

import { createFirstCutModel } from 'firstcut-model-base';
import CompanySchema from './companies.schema';

const Base = createFirstCutModel(CompanySchema);

class Company extends Base {
  static get collectionName() { return 'companies'; }

  static get schema() { return CompanySchema; }

  filesRoot(field) {
    return `branding/${this.displayName}_${this._id}`;
  }

  get hasBrandIntro() { return this.brandIntroId != null; }

  get displayName() { return `${this.name}`; }
}

export default Company;
