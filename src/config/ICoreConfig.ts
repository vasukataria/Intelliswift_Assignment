import { IEmpConfig } from './IEmpConfig';
export default interface ICoreConfig {
  apiPrefix: string;
  corsOrigin: string;
  mongoDbConnectionString: string;
  debug: boolean;
  mongoDBName: string;
  nodeEnv: string;
  port: string | number;
  envName: string;
  timeoutIntervalInSec?: string;
  secret: string;
  empDetails: IEmpConfig;
  empTypeValues: string
}
