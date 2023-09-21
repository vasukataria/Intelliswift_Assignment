import VersionableSchema from '../../versionable/VersionableSchema';

class EmployeeSchema extends VersionableSchema {

    constructor(collections: any) {
        const baseSchema = Object.assign({
            _id: String,
            name: String,
            email: String,
            empType: String,
            password: String
        });
        super(baseSchema, collections);
    }
}
export default EmployeeSchema;