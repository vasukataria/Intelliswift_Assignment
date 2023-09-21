import { SERVICE_NAME } from '../../libs/constants';
import Logger from '../../libs/logger';
import EmpService from '../../service/empService';

const logger = new Logger();

class Employee {

  private empService: any;
  constructor() {
    this.empService = new EmpService();
  }

  public async getUserById(
    { params: { id },
      user: { originalId, empType },
    }
      : { params: any, user: any }
  ) {
    try {
      logger.info(`${JSON.stringify({
        api: 'api/employees/{id}', custom: {
          component: SERVICE_NAME,
          controller: 'get',
          reqParams: { id },
        },
      })}`);
      const startTime = Date.now();
      const result = this.empService.getUser(id, originalId, empType);
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'api/employees/{id}', custom: { component: SERVICE_NAME, controller: 'get', timeElapsed } })}`);
      return result;
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'api/employees/{id}', custom: { component: SERVICE_NAME, controller: 'get', error: `${error}` } })}`);
      throw error;
    }
  }

  public async getUsers(
    {
      query: { limit = 10, skip = 0, sort = 'asc' },
      user: { empType },
    }
      : {
        query: { limit: number, skip: number, sort: string },
        user: any,
      }
  ) {
    try {
      logger.info(`${JSON.stringify({
        api: 'api/employees', custom: {
          component: SERVICE_NAME,
          controller: 'get',
          reqQuery: { limit, skip, sort },
        },
      })}`);
      const startTime = Date.now();
      const result = this.empService.getAllUsers(limit, skip, sort, empType);
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'api/employees', custom: { component: SERVICE_NAME, controller: 'getUsers', timeElapsed } })}`);
      return result;
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'api/employees', custom: { component: SERVICE_NAME, controller: 'getUsers', error: `${error}` } })}`);
      throw error;
    }
  }

  public async addUser({
    body: { name, email, empType, password },
  }: {
    body: any;
  }) {
    try {
      logger.info(`${JSON.stringify({
        api: 'api/employees', custom: {
          component: SERVICE_NAME,
          controller: 'addUser',
          reqBody: { name, email, password, empType },
        },
      })}`);
      const startTime = Date.now();
      const result = this.empService.createUser({ name, email, password, empType });
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'api/employees', custom: { component: SERVICE_NAME, controller: 'addUser', timeElapsed } })}`);
      return result;
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'api/employees', custom: { component: SERVICE_NAME, controller: 'addUser', error } })}}`);
      throw error;
    }
  }

  public async updateUser({
    body: { name, email, empType, password },
    user: { originalId, empType: role },
    params: { id }
  }: {
    body: any;
    user: { originalId: string, empType: string },
    params: { id: string }
  }) {
    try {
      logger.info(`${JSON.stringify({
        api: 'api/employees/{id}', custom: {
          component: SERVICE_NAME,
          controller: 'updateUser',
          reqBody: { name, email, password, empType },
          reqParams: { id }
        },
      })}`);
      const startTime = Date.now();
      const result = this.empService.userUpdate({ name, email, password, empType }, id, role, originalId);
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'api/employees/{id}', custom: { component: SERVICE_NAME, controller: 'updateUser', timeElapsed } })}`);
      return result;
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'api/employees/{id}', custom: { component: SERVICE_NAME, controller: 'updateUser', error } })}}`);
      throw error;
    }
  }

  public async deleteUser({
    params: { id },
    user: { originalId, empType }
  }: {
    user: any;
    params: { id: string }
  }) {
    try {
      logger.info(`${JSON.stringify({
        api: 'api/employees/list', custom: {
          component: SERVICE_NAME,
          controller: 'list',
          reqParams: { id },
        },
      })}`);
      const startTime = Date.now();
      const result = this.empService.userDelete(id, originalId, empType);
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'api/employees/list', custom: { component: SERVICE_NAME, controller: 'list', timeElapsed } })}`);
      return result;
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'api/employees/list', custom: { component: SERVICE_NAME, controller: 'list', error } })}}`);
      throw error;
    }
  }


  public async loginUser({
    body: { email, password },
  }: {
    body: { email: string, password: string };
  }) {
    try {
      logger.info(`${JSON.stringify({
        api: 'api/employees/login', custom: {
          component: SERVICE_NAME,
          controller: 'list',
          reqBody: { email, password },
        },
      })}`);
      const startTime = Date.now();
      const result = await this.empService.login(email, password);
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'api/employees/login', custom: { component: SERVICE_NAME, controller: 'list', timeElapsed } })}`);
      return result;
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'api/employees/login', custom: { component: SERVICE_NAME, controller: 'list', error } })}}`);
      throw error;
    }
  }

}

export default new Employee();