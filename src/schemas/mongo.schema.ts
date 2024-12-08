import { GlobalIdentifier } from '@vannatta-software/ts-domain';
import { ReflectionUtils, SchemaMetadataKey } from '@vannatta-software/ts-core';
import { v4 as uuid } from "uuid";
import mongoose from 'mongoose';
import 'reflect-metadata';

interface IMetaprop {
    propertyKey: string,
    type: any,
    embedded: boolean,
    enumeration: boolean
}

export function MongoSchema(targetClass: any, depth = 0): mongoose.Schema | any {
    if (!targetClass || depth > 5 )
        return new mongoose.Schema({}, { _id: false });

    const props = ReflectionUtils.getOwnMetadata(SchemaMetadataKey, targetClass)
    const schemaDefinition = {};

    props.forEach((options: IMetaprop) => {
        const key = options.propertyKey;

        if (options.type === GlobalIdentifier) {
            if (key == "id")
                schemaDefinition["_id"] = { type: String, default: uuid }; 
            else  
                schemaDefinition[key] = MongoSchema(options.type, ++depth); 
        } else if (options.embedded) {
            if (Array.isArray(options.type)) {
                const itemSchema = MongoSchema(options.type[0], ++depth); // Assuming the first item in the array is the class
                schemaDefinition[key] = [itemSchema];
            } else {
                schemaDefinition[key] = MongoSchema(options.type, ++depth);
            }
        } else if (options.enumeration) {
            schemaDefinition[key] = MongoSchema(options.type, ++depth);
        } else {
            schemaDefinition[key] = options.type;
        }

    })

    return new mongoose.Schema(schemaDefinition, { _id: depth == 0 });
}