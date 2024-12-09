import mongoose from 'mongoose';
import { MongoSchema, extractRelevantSchema } from 'src/schemas/mongo.schema';
import { Workflow } from '@domain/workflow/Workflow';

describe('MongoSchema for Workflow', () => {
    it('should generate a valid Mongoose schema for the Workflow class', () => {
        const schema = MongoSchema(Workflow);

        const expectedSchema = {
            "_id": { "type": "String" },
            "createdAt": { "type": "Date" },
            "updatedAt": { "type": "Date" },
            "name": { "type": "String" },
            "description": { "type": "String" },
            "status": {
                "type": "String",
                "enum": ["Draft", "Active", "Paused", "Archived"]
            },
            "tags": { "type": "Array" },
            "category": { "type": "String" },
            "activities": { "type": "SchemaMixed" },
            "ownerId": { "type": "SchemaMixed" }
        };

        const extractedSchema = extractRelevantSchema(schema);

        expect(extractedSchema).toMatchObject(expectedSchema);

        // Ensure _id is correctly set to a UUID
        const idField = schema.path('_id') as mongoose.SchemaTypeOptions<any>;
        expect(idField).toHaveProperty('default');
        expect(typeof idField.default).toBe('function');
    });

    it('should correctly map embedded properties for activities', () => {
        const schema = MongoSchema(Workflow);
        const activitiesField = schema.path('activities');

        expect(activitiesField).toBeDefined();
        expect(activitiesField.instance).toBe('Mixed');
    });

    it('should correctly handle UniqueIdentifier for ownerId', () => {
        const schema = MongoSchema(Workflow);
        const ownerIdField = schema.path('ownerId');

        expect(ownerIdField).toBeDefined();
        expect(ownerIdField.instance).toBe("Mixed");
    });
});
