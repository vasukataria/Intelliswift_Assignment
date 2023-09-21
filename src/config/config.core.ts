import dotenv = require('dotenv');
import { EnvVars } from '../libs/constants';
import ICoreConfig from './ICoreConfig';

dotenv.config();

export const config: ICoreConfig = {
  apiPrefix: process.env.API_PREFIX || '/api',
  corsOrigin: 'http://localhost',
  mongoDBName: process.env.MONGODB_DATABASE || 'Intelliswift',
  mongoDbConnectionString: process.env.MONGODB_CONNECTION_STRING ? process.env.MONGODB_CONNECTION_STRING : '',
  debug: process.env.DEBUG === 'true',
  nodeEnv: process.env.NODE_ENV || 'local',
  port: process.env.PORT || 9000,
  envName: process.env.ENV_NAME || 'local',
  timeoutIntervalInSec: process.env.TIMEOUT_INTERVAL_INSEC || '120s',
  secret: process.env.JWTSECRET,
  empDetails: {
    name: process.env.NAME,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    empType: process.env.EMPTYPE,
  },
  empTypeValues: process.env.empTypeVALUES || 'SUPER_ADMIN, USER',
};
