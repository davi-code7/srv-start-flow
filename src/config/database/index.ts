import { Sequelize } from 'sequelize';

const connection: Sequelize = new Sequelize(
  process.env.SEQUELIZE_DATABASE,
  process.env.SEQUELIZE_USERNAME,
  process.env.SEQUELIZE_PASSWORD,
  {
    host: process.env.SEQUELIZE_HOST,
    port: 5432,
    logging: console.log,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.SEQUELIZE_DIALECT_OPTIONS,
    },
    pool: { max: 5, idle: 30 },
    ssl: true,
    define: {
      timestamps: false,
      underscored: true,
    },
  },
);

export default connection;
