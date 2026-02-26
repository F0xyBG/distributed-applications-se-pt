import mysql from 'mysql2/promise';
import { isObject } from '../utils.js';

export const createNewConnection = async (dbConfig) => {
  if (!isObject(dbConfig)) throw new Error('❌ invalid database configuration: expected an object');

  const connection = await mysql.createConnection(dbConfig);
  console.log('✅ successfully connected to MySQL');

  return connection;
};

export const closeConnection = async (connection) => {
  if (connection) {
    await connection.end();
    console.log('🔌 disconnected from MySQL');
  }
};
