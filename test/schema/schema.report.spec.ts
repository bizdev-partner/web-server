import mongoose from 'mongoose';
import { MongoSchema, extractRelevantSchema } from 'src/schemas/mongo.schema';
import { Report } from '@domain/report/Report';

describe('MongoSchema for Report', () => {
    it('should generate a valid Mongoose schema for the Report class', () => {
        const schema = MongoSchema(Report);

        const expectedSchema = {
            "_id": { "type": "String" },
            "createdAt": { "type": "Date" },
            "updatedAt": { "type": "Date" },
            "title": { "type": "String" },
            "description": { "type": "String" },
            "type": {
                "type": "String",
                "enum": ["ActivitySummary", "LeadStatusChanges", "WonLeads"]
            },
            "format": {
                "type": "String",
                "enum": ["PDF", "Excel", "HTML", "Dashboard"]
            },
            "status": {
                "type": "String",
                "enum": ["Pending", "InProgress", "Completed", "Failed"]
            },
            "generatedDate": { "type": "Date" },
            "data": { "type": "Object" }, 
            "requestedBy": { "type": "SchemaMixed" },
            "parameters": {
                "type": "SchemaMixed"
            }
        };

        const extractedSchema = extractRelevantSchema(schema);

        expect(extractedSchema).toMatchObject(expectedSchema);

        // Ensure _id is correctly set to a UUID
        const idField = schema.path('_id') as mongoose.SchemaTypeOptions<any>;
        expect(idField).toHaveProperty('default');
        expect(typeof idField.default).toBe('function');
    });

    it('should correctly handle embedded properties for parameters', () => {
        const schema = MongoSchema(Report);
        const parametersField = schema.path('parameters');

        expect(parametersField).toBeDefined();
        expect(parametersField.instance).toBe('Mixed');
    });

    it('should correctly map requestedBy as UniqueIdentifier', () => {
        const schema = MongoSchema(Report);
        const requestedByField = schema.path('requestedBy');

        expect(requestedByField).toBeDefined();
        expect(requestedByField.instance).toBe("Mixed");
    });

    it('should correctly handle data as a mixed type', () => {
        const schema = MongoSchema(Report);
        const dataField = schema.path('data');

        expect(dataField).toBeDefined();
        expect(dataField.instance).toBe('Mixed');
    });
});
