import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import socketIo from 'socket.io';
import admin from 'firebase-admin';
import { config } from '../config/config.core';
import Logger from '../libs/logger';
import EmpRepository from '../repositories/business/employee/Repository';
import { BCRYPT_SALT_ROUNDS, SERVICE_NAME } from '../libs/constants';
import { DuplicateKeyError, UnAuthorizedError, BadRequestError } from '../entities/errors';



const logger = new Logger();


export default class EmpService {

  private _empRepository: EmpRepository;
  constructor() {
    this._empRepository = new EmpRepository();
  }

  public async createUser(data) {
    try {
      logger.info(`${JSON.stringify({
        api: 'api/employees', custom: {
          component: SERVICE_NAME,
          service: 'createUser',
          functionParms: { ...data },
        },
      })}`);
      const { name, email, password, empType } = data;
      const checkUserExist = await this._empRepository.findOneByQuery({ email });
      if (checkUserExist) {
        throw new DuplicateKeyError('service', '');
      }
      const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      const userdata = { name, email, password: hash, empType };
      const startTime = Date.now();
      const user = await this._empRepository.create(userdata);
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'api/employees', custom: { component: SERVICE_NAME, service: 'createUser', timeElapsed } })}`);
      return user;
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'api/employees', custom: { component: SERVICE_NAME, service: 'createUser', error } })}}`);
      throw error;
    }
  }

  public async userUpdate(data, id, role, originalId) {
    try {
      logger.info(`${JSON.stringify({
        api: 'api/employees/{id}', custom: {
          component: SERVICE_NAME,
          service: 'userUpdate',
          functionParms: { ...data },
        },
      })}`);
      const { name, email, password, empType } = data;
      if ((empType === config.empDetails.empType && role !== config.empDetails.empType || id !== originalId)) {
        throw new BadRequestError([
          {
            location: 'body',
            msg: `You are not authorize to access`,
            param: '',
            value: ``,
          },
        ]);
      }
      const checkUserExist = await this._empRepository.get(id);
      if (!checkUserExist) {
        throw new BadRequestError([
          {
            location: 'body',
            msg: `user is not exist in db`,
            param: '',
            value: ``,
          },
        ]);
      }
      const userdata = {
        ...{ name } && name ? { name } : {},
        ...email && email ? { email } : {},
        ...password && password ? { password: await bcrypt.hash(password, BCRYPT_SALT_ROUNDS) } : {},
        ...empType && empType ? { empType } : {},
        originalId: id
      };
      const startTime = Date.now();
      const user = await this._empRepository.update(userdata);
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'api/employees/{id}', custom: { component: SERVICE_NAME, service: 'userUpdate', timeElapsed } })}`);
      return user;
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'api/employees/{id}', custom: { component: SERVICE_NAME, service: 'userUpdate', error } })}}`);
      throw error;
    }
  }

  public async userDelete(id, originalId, empType) {
    try {
      logger.info(`${JSON.stringify({
        api: 'api/employees', custom: {
          component: SERVICE_NAME,
          service: 'userDelete',
          functionParms: { id },
        },
      })}`);
      if (empType === config.empDetails.empType || id !== originalId) {
        throw new BadRequestError([
          {
            location: 'body',
            msg: `You are not authorize to delete`,
            param: '',
            value: ``,
          },
        ]);
      }
      const startTime = Date.now();
      await this._empRepository.delete(id);
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'api/employees', custom: { component: SERVICE_NAME, service: 'userDelete', timeElapsed } })}`);
      return 'User deleted successfully';
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'api/employees', custom: { component: SERVICE_NAME, service: 'userDelete', error } })}}`);
      throw error;
    }
  }

  public async getUser(id, originalId, empType) {
    try {
      logger.info(`${JSON.stringify({
        api: 'api/employees/{id}', custom: {
          component: SERVICE_NAME,
          service: 'getUser',
          functionParms: { id },
        },
      })}`);
      if (id !== originalId && empType !== config.empDetails.empType) {
        throw new BadRequestError([
          {
            location: 'body',
            msg: `You are not authorize to access`,
            param: '',
            value: ``,
          },
        ]);
      }
      const startTime = Date.now();
      const pipline = [
        { $match: { originalId: id, deletedAt: null } },
        { $sort: { createdAt: -1 } },
        { $project: { _id: 0, name: 1, email: 1, originalId: 1, createdAt: 1 } }
      ];
      const user = await this._empRepository.getAllAggregation(pipline);
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'api/employees/{id}', custom: { component: SERVICE_NAME, service: 'getUser', timeElapsed } })}`);
      return user;
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'api/employees/{id}', custom: { component: SERVICE_NAME, service: 'getUser', error } })}}`);
      throw error;
    }
  }

  public async getAllUsers(limit, skip, sort, empType) {
    try {
      logger.info(`${JSON.stringify({
        api: 'api/employees', custom: {
          component: SERVICE_NAME,
          service: 'getAllUsers',
          functionParms: { limit, skip, sort },
        },
      })}`);
      if (empType !== config.empDetails.empType) {
        throw new BadRequestError([
          {
            location: 'body',
            msg: `You are not authorize to access`,
            param: '',
            value: ``,
          },
        ]);
      }
      const startTime = Date.now();
      const pipeline = [
        { $match: { deletedAt: null } },
        { $sort: { createdAt: sort === 'asc' ? -1 : 1 } },
        { $skip: skip },
        { $limit: limit },
        { $project: { _id: 0, name: 1, email: 1, originalId: 1, createdAt: 1 } }
      ];
      const user = await this._empRepository.getAllAggregation(pipeline);
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'api/employees', custom: { component: SERVICE_NAME, service: 'getAllUsers', timeElapsed } })}`);
      return user;
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'api/employees', custom: { component: SERVICE_NAME, service: 'getAllUsers', error } })}}`);
      throw error;
    }
  }

  public async login(email, password) {
    try {
      logger.info(`${JSON.stringify({
        api: 'api/employees/login', custom: {
          component: SERVICE_NAME,
          service: 'login',
          functionParms: { email, password },
        },
      })}`);
      const startTime = Date.now();
      const pipeline = [
        { $match: { email, deletedAt: null } },
        { $limit: 1 }
      ];
      const checkUserExist = await this._empRepository.getAllAggregation(pipeline);
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'api/employees/login', custom: { component: SERVICE_NAME, service: 'login', timeElapsed } })}`);
      let token;
      if (checkUserExist && checkUserExist.length !==0) {
        const validPassword = await bcrypt.compare(password, checkUserExist[0].password);
        if (validPassword) {
          token = token = jwt.sign({ email: checkUserExist[0].email, empType: checkUserExist[0].empType, originalId: checkUserExist[0].originalId }, config.secret, { expiresIn: '1d' });
          const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
          const { name, empType, originalId } = checkUserExist[0];
          const userdata = { name, email, password: hash, empType, originalId };
          if (checkUserExist[0].deletedAt) {
            const startTime1 = Date.now();
            await this._empRepository.update(userdata);
            const endTime1 = Date.now();
            const timeElapsed1 = `${endTime1 - startTime1} ms`;
            logger.debug(`${JSON.stringify({ api: 'api/employees/login', custom: { component: SERVICE_NAME, service: 'login', timeElapsed1 } })}`);
          }
        } else {
          throw new UnAuthorizedError('service', 'UnAuthorized');
        }
      } else {
        throw new UnAuthorizedError('service', 'UnAuthorized');
      }
      return `Bearer ${token}`;
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'api/employees/login', custom: { component: SERVICE_NAME, service: 'login', error } })}}`);
      throw error;
    }
  }

}

