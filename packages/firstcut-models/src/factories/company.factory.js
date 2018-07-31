

export default function CompanyFactory(Base, schema) {
  class Company extends Base {

    static get collection_name() { return 'companies'; }

    filesRoot(field) {
      return `branding/${this.displayName}_${this._id}`;
    }

    get hasBrandIntro() { return this.brandIntroId != null; }
    get displayName() { return `${this.name}`; }
  }

  Company.schema = schema;
  return Company;
}
