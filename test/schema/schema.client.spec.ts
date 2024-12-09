import mongoose from 'mongoose';
import { MongoSchema, extractRelevantSchema } from 'src/schemas/mongo.schema';
import { Campaign } from '@domain/campaign/Campaign';

describe('MongoSchema for Campaign', () => {
    it('should generate a valid Mongoose schema for the Campaign class', () => {
        const schema = MongoSchema(Campaign);

        const expectedSchema = {
            "_id": { "type": "String" },
            "createdAt": { "type": "Date" },
            "updatedAt": { "type": "Date" },
            "name": { "type": "String" },
            "salesPackageId": { "type": "SchemaMixed" },
            "targetLeads": { "type": "SchemaMixed" },
            "workflowId": { "type": "SchemaMixed" },
            "campaignActivities": { "type": "SchemaMixed" },
            "startDate": { "type": "Date" },
            "endDate": { "type": "Date" },
            "status": {
                "type": "String",
                "enum": ["Planned", "Active", "Paused", "Completed", "Cancelled"]
            },
            "metrics": { "type": "Object" },
            "notes": { "type": "SchemaMixed" }
        };

        const extractedSchema = extractRelevantSchema(schema);

        expect(extractedSchema).toMatchObject(expectedSchema);

        // Ensure _id is correctly set to a UUID
        const idField = schema.path('_id') as mongoose.SchemaTypeOptions<any>;
        expect(idField).toHaveProperty('default');
        expect(typeof idField.default).toBe('function');
    });

    it('should correctly map embedded properties for notes', () => {
        const schema = MongoSchema(Campaign);
        const notesField = schema.path('notes');

        expect(notesField).toBeDefined();
        expect(notesField.instance).toBe('Mixed');
    });

    it('should correctly handle UniqueIdentifier for salesPackageId', () => {
        const schema = MongoSchema(Campaign);
        const salesPackageIdField = schema.path('salesPackageId');

        expect(salesPackageIdField).toBeDefined();
        expect(salesPackageIdField.instance).toBe("Mixed");
    });

    it('should correctly handle array of UniqueIdentifiers for targetLeads', () => {
        const schema = MongoSchema(Campaign);
        const targetLeadsField = schema.path('targetLeads');

        expect(targetLeadsField).toBeDefined();
        expect(targetLeadsField.instance).toBe("Mixed");
    });

    it('should correctly handle array of CampaignActivities', () => {
        const schema = MongoSchema(Campaign);
        const campaignActivitiesField = schema.path('campaignActivities');

        expect(campaignActivitiesField).toBeDefined();
        expect(campaignActivitiesField.instance).toBe("Mixed");
    });

    it('should validate enum for status field', () => {
        const schema = MongoSchema(Campaign);
        const statusField = schema.path('status');

        expect(statusField).toBeDefined();
        expect(statusField.enumValues).toEqual(["Planned", "Active", "Paused", "Completed", "Cancelled"]);
    });

    it('should correctly handle metrics as an embedded object', () => {
        const schema = MongoSchema(Campaign);
        const metricsField = schema.path('metrics');

        expect(metricsField).toBeDefined();
        expect(metricsField.instance).toBe('Mixed');
        expect(metricsField.options.type).toBeDefined();
        expect(metricsField.options.type).toBe('Object');
    });
});
