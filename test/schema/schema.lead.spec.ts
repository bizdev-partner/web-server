import mongoose from 'mongoose';
import { MongoSchema, extractRelevantSchema } from 'src/schemas/mongo.schema';
import { Lead } from '@domain/lead/Lead';

describe('MongoSchema for Lead', () => {
    it('should generate a valid Mongoose schema for the Lead class', () => {
        const schema = MongoSchema(Lead);

        const expectedSchema = {
            "_id": { "type": "String" },
            "createdAt": { "type": "Date" },
            "updatedAt": { "type": "Date" },
            "name": {
                "type": "SchemaMixed" // Mixed to represent the embedded `Name` value object
            },
            "contactInfo": {
                "type": "SchemaMixed" // Mixed to represent the embedded `ContactInfo` value object
            },
            "status": {
                "type": "String",
                "enum": ["Known", "Pursued", "Unqualified", "Lost", "Won"]
            },
            "notes": { "type": "SchemaMixed" }, // Mixed to represent an array of embedded `Note` objects
            "tags": { "type":  "Array" },
            "groups": { "type":  "Array" },
        };

        const extractedSchema = extractRelevantSchema(schema);

        expect(extractedSchema).toMatchObject(expectedSchema);

        // Ensure _id is correctly set to a UUID
        const idField = schema.path('_id') as mongoose.SchemaTypeOptions<any>;
        expect(idField).toHaveProperty('default');
        expect(typeof idField.default).toBe('function');
    });

    it('should correctly map embedded properties for name', () => {
        const schema = MongoSchema(Lead);
        const nameField = schema.path('name');

        expect(nameField).toBeDefined();
        expect(nameField.instance).toBe('Mixed'); // `Name` is embedded as a value object
    });

    it('should correctly map embedded properties for contactInfo', () => {
        const schema = MongoSchema(Lead);
        const contactInfoField = schema.path('contactInfo');

        expect(contactInfoField).toBeDefined();
        expect(contactInfoField.instance).toBe('Mixed'); // `ContactInfo` is embedded as a value object
    });

    it('should correctly handle the enumeration for status', () => {
        const schema = MongoSchema(Lead);
        const statusField = schema.path('status');

        expect(statusField).toBeDefined();
        expect(statusField.enumValues).toEqual(["Known", "Pursued", "Unqualified", "Lost", "Won"]);
    });

    it('should correctly handle tags as an optional array of strings', () => {
        const schema = MongoSchema(Lead);
        const tagsField = schema.path('tags');

        expect(tagsField).toBeDefined();
        expect(tagsField.instance).toBe('Array');
    });

    it('should correctly map embedded properties for notes', () => {
        const schema = MongoSchema(Lead);
        const notesField = schema.path('notes');

        expect(notesField).toBeDefined();
        expect(notesField.instance).toBe('Mixed'); // `Note` objects embedded
    });
});
