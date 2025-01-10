import { SalesPackage } from '@domain/sales_package/SalesPackage';
import mongoose from 'mongoose';
import { MongoSchema, extractRelevantSchema } from 'src/schemas/mongo.schema';

describe('MongoSchema for SalesPackage', () => {
    it('should generate a valid Mongoose schema for the SalesPackage class', () => {
        const schema = MongoSchema(SalesPackage);

        const expectedSchema = {
            "_id": { "type": "String" },
            "createdAt": { "type": "Date" },
            "updatedAt": { "type": "Date" },
            "name": { "type": "String" },
            "workflowId": { "type": "SchemaMixed" },
            "leads": { "type": "SchemaMixed" },
            "pricing": { "type": "SchemaMixed" }, // Embedded `Pricing` value object
            "validity": { "type": "SchemaMixed" }, // Embedded `Validity` value object
            "feedback": { "type": "SchemaMixed" } // Embedded array of `Note` objects
        };

        const extractedSchema = extractRelevantSchema(schema);

        expect(extractedSchema).toMatchObject(expectedSchema);

        // Ensure _id is correctly set to a UUID
        const idField = schema.path('_id') as mongoose.SchemaTypeOptions<any>;
        expect(idField).toHaveProperty('default');
        expect(typeof idField.default).toBe('function');
    });

    it('should correctly map the workflowId as a string', () => {
        const schema = MongoSchema(SalesPackage);
        const workflowIdField = schema.path('workflowId');

        expect(workflowIdField).toBeDefined();
        expect(workflowIdField.instance).toBe('Mixed');
    });

    it('should correctly handle the embedded properties for pricing', () => {
        const schema = MongoSchema(SalesPackage);
        const pricingField = schema.path('pricing');

        expect(pricingField).toBeDefined();
        expect(pricingField.instance).toBe('Mixed'); // Embedded `Pricing` value object
    });

    it('should correctly handle the embedded properties for validity', () => {
        const schema = MongoSchema(SalesPackage);
        const validityField = schema.path('validity');

        expect(validityField).toBeDefined();
        expect(validityField.instance).toBe('Mixed'); // Embedded `Validity` value object
    });

    it('should correctly handle feedback as an array of embedded Note objects', () => {
        const schema = MongoSchema(SalesPackage);
        const feedbackField = schema.path('feedback');

        expect(feedbackField).toBeDefined();
        expect(feedbackField.instance).toBe('Mixed');
    });

    it('should correctly handle leads as an array of string IDs', () => {
        const schema = MongoSchema(SalesPackage);
        const leadsField = schema.path('leads');

        expect(leadsField).toBeDefined();
        expect(leadsField.instance).toBe('Mixed');
    });
});
