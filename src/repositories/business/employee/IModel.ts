import * as mongoose from 'mongoose';

export default interface IEmployeeModel extends mongoose.Document {
    id: string;
    name: string;
    email: string;
    empType: string;
    originalId: string;
    password: string;
    deletedAt: Date;
}