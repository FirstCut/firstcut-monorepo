
import { createFirstCutModel } from 'firstcut-model-base';
import RequestSchema from './request.schema';

const Base = createFirstCutModel(RequestSchema);

class Request extends Base {
  static get collectionName() { return 'landingpagerequests'; }

  static get schema() { return RequestSchema; }
}

export default Request;
