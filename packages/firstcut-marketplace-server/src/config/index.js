import ProductionConfig from './production';
import DevelopmentConfig from './development';
import TestingConfig from './testing';

const env = process.env.NODE_ENV || 'development';

switch (env) {
  case 'production':
    module.exports = ProductionConfig;
    break;
  case 'development':
    module.exports = DevelopmentConfig;
    break;
  case 'testing':
    module.exports = TestingConfig;
    break;
  default:
    throw new Error(`config not defined for environment ${env}`);
}
