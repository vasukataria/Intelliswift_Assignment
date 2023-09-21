import { ForbiddenError, BadRequestError } from '../entities/errors';

// Define the role type
type Role = 'SUPER_ADMIN' | 'EMPLOYEE';


const roleBasedAuthMiddleware = (roles: Role[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      throw new BadRequestError([
        {
          location: 'body',
          msg: `You are not authorize to access`,
          param: '',
          value: ``,
        },
      ]);
    }
    if (!roles.includes(req.user.empType)) {
      next( new ForbiddenError([
        {
          location: 'body',
          msg: 'Permisssion Denied',
          param: 'Forbidden',
          value: ``,
        },
      ]));
    }

    next();
  };
};

export default roleBasedAuthMiddleware;
