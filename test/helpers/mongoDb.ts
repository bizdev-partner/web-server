import { diff } from "deep-object-diff"; 
import mongoose from "mongoose";

const mongo = {
    url: "localhost:27017",
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    dbName: process.env.MONGO_INITDB_DATABASE,
}
export const mongoDbConnection = `mongodb://${mongo.user}:${mongo.pass}@${mongo.url}/${mongo.dbName}?authSource=admin`;
