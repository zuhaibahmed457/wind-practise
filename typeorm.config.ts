import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

config({
  path: `.env.${process.env.NODE_ENV}`, // Adjust the path to your .env file
});

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrations: ['migrations/**/*.{js,ts}'],
  entities: ['dist/src/**/*.entity.{js,ts}'],
  synchronize: false,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
});
