import dotenv from 'dotenv';
dotenv.config();
import { ConnectionOptions } from 'typeorm';
const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  database: 'juber',
  synchronize: true,
  logging: false,
  entities: ['entities/**/*.*'],
  host: process.env.DB_ENDPOINT,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
};

export default connectionOptions;
