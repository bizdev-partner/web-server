require('dotenv').config({ path: '../../.env' });
import * as dotenv from 'dotenv';
dotenv.config();

const mongoose = require('mongoose');
const mongo = {
    url: process.env.MONGO_CONNECTION.replace("mongodb://", ""),
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    dbName: process.env.MONGO_INITDB_DATABASE,
}

export const initializeTests = async () => {
  await mongoose.connect(`mongodb://${mongo.user}:${mongo.pass}@${mongo.url}/${mongo.dbName}?authSource=admin`);
}

export const cleanupTests = async () => {
  await mongoose.disconnect(); // Ensure you disconnect after tests
  await mongoose.connection.close();
};