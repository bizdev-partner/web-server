import mongoose from 'mongoose';
import { MongoSchema, extractRelevantSchema } from 'src/schemas/mongo.schema';
import { Activity } from '@domain/activity/Activity';

describe('MongoSchema for Activity', () => {
    it('should generate a valid Mongoose schema for the Activity class', () => {
        const schema = MongoSchema(Activity);

        const expectedSchema = {
            "_id": { "type": "String" },
            "createdAt": { "type": "Date" },
            "updatedAt": { "type": "Date" },
            "type": {
              "type": "String",
              "enum": [
                "Email Outreach",
                "Phone Call",
                "In-Person Meeting",
                "Product Demo",
                "Networking Event",
                "Social Media Engagement",
                "Proposal Submission",
                "Follow-Up",
                "Contract Negotiation",
                "Closing"
              ]
            },
            "priority": { "type": "String", "enum": ["High", "Medium", "Low"] },
            "outcome": { "type": "SchemaMixed" }, 
            "status": {
              "type": "String",
              "enum": ["Open", "InProgress", "Complete", "Cancelled"]
            },
            "scheduledDate": { "type": "Date" },
            "completionDate": { "type": "Date" },
            "notes": { "type": "SchemaMixed" }, 
            "leadId": { "type": "SchemaMixed" } 
        };
        
    
        const extractedSchema = extractRelevantSchema(schema);

        expect(extractedSchema).toMatchObject(expectedSchema);

        // Ensure _id is correctly set to a UUID
        const idField = schema.path('_id') as mongoose.SchemaTypeOptions<any>;
        expect(idField).toHaveProperty('default');
        expect(typeof idField.default).toBe('function');
    });

    it('should correctly map embedded properties for notes', () => {
        const schema = MongoSchema(Activity);
        const notesField = schema.path('notes');

        expect(notesField).toBeDefined();
        expect(notesField.instance).toBe('Mixed');
    });

    it('should correctly handle UniqueIdentifier for leadId', () => {
        const schema = MongoSchema(Activity);
        const leadIdField = schema.path('leadId');

        expect(leadIdField).toBeDefined();
        expect(leadIdField.instance).toBe("Mixed");
    });
});
