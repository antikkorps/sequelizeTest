import { Dialect } from 'sequelize'

interface DatabaseConfig {
  username: string
  password: string
  database: string
  host: string
  dialect: Dialect
  logging: boolean | ((sql: string) => void)
}

interface Config {
  development: DatabaseConfig
  test: DatabaseConfig
  production: DatabaseConfig
}

const config: Config = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'database_development',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: console.log,
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'database_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    dialect: 'mysql',
    logging: false,
  },
}

export default config
