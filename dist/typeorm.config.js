"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
(0, dotenv_1.config)({
    path: `.env.${process.env.NODE_ENV}`,
});
exports.default = new typeorm_1.DataSource({
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
//# sourceMappingURL=typeorm.config.js.map