import { GlobalIdentifier } from '@vannatta-software/ts-domain';
import { ReflectionUtils, SchemaMetadataKey } from '@vannatta-software/ts-core';
import { v4 as uuid } from "uuid";
import mongoose from 'mongoose';
import 'reflect-metadata';

interface IMetaprop {
    propertyKey: string,
    type: any,
    embedded: boolean,
    items: any,
    enum: string[]
}

export function extractRelevantSchema(schema: any): Record<string, any> {
    if (!schema || !schema.obj) return {};

    const result: Record<string, any> = {};
    for (const [key, v] of Object.entries(schema.obj)) {
        const value: any = v;

        if (value instanceof mongoose.Schema) {
            // Recursively extract nested schemas
            result[key] = { type: 'Object', properties: extractRelevantSchema(value) };
        } else if (value instanceof Array) {
            // Handle arrays
            const itemType = value[0]?.type || 'Object';
            result[key] = {
                type: 'Array',
                items: { type: itemType, properties: extractRelevantSchema(value[0]) },
            };
        } else if ( value.type) {
            // Extract type and enum if present
            result[key] = {
                type: value.type.name || value.type,
                ...(value.enum ? { enum: value.enum } : {}),
            };
        } else {
            // Default to object for unknown types
            result[key] = { type: 'Object' };
        }
    }

    return result;
}


export function MongoSchema(targetClass: any, depth = 0): mongoose.Schema | any {
    if (!targetClass || depth > 5)
        return new mongoose.Schema({}, { _id: false });

    const props = ReflectionUtils.getOwnMetadata(SchemaMetadataKey, targetClass);
    const schemaDefinition = {};

    props.forEach((options: IMetaprop) => {
        const key = options.propertyKey;

        if (options.type === GlobalIdentifier) {
            if (key === "id") {
                schemaDefinition["_id"] = { type: String, default: uuid };
            } else {
                schemaDefinition[key] = {
                    type: String,
                };
            }
        } else if (Array.isArray(options.type)) {
            if (options.items === String) {
                // If the array contains simple strings, treat it as a simple array of strings
                schemaDefinition[key] = { type: [String] };
            } else {
                // Otherwise, handle embedded object arrays
                const itemType = options.type[0];
                schemaDefinition[key] = [
                    typeof itemType === 'function'
                        ? MongoSchema(itemType, ++depth)
                        : { type: itemType },
                ];
            }
        } else if (options.embedded) {
            // Embedded objects
            schemaDefinition[key] = {
                type: mongoose.Schema.Types.Mixed, // Mark as embedded explicitly
                properties: extractRelevantSchema(MongoSchema(options.type, ++depth)),
            };
        } else if (options.enum) {
            // Enums
            schemaDefinition[key] = {
                type: String,
                enum: options.enum,
            };
        } else {
            // Default type handlin
            schemaDefinition[key] = { type: options.type.name || options.type };
        }
    });

    return new mongoose.Schema(schemaDefinition, { _id: depth === 0 });
}
