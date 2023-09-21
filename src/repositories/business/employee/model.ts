import * as mongoose from 'mongoose';
import EmployeeSchema from './Schema';
import IEmployeeModel from './IModel';

export const employeeSchema = new EmployeeSchema({
    collection: 'Employee',
});

export const employeeModel: mongoose.Model<IEmployeeModel> = mongoose.model<IEmployeeModel>
(
    'Employee',
    employeeSchema
);