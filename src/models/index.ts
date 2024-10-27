import { Sequelize, Model, DataTypes } from 'sequelize'
import fs from 'fs'
import path from 'path'
import process from 'process'
import config from '../config/database'

const env = process.env.NODE_ENV || 'development'
const dbConfig = config[env as keyof typeof config]

interface DB {
  sequelize: Sequelize
  Sequelize: typeof Sequelize
  [key: string]: any
}

const db: DB = {
  sequelize: new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  ),
  Sequelize: Sequelize,
}

const basename = path.basename(__filename)
const modelFiles = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    (file.slice(-3) === '.ts' || file.slice(-3) === '.js')
  )
})

// Chargement des modèles
for (const file of modelFiles) {
  const model = require(path.join(__dirname, file)).default(
    db.sequelize,
    DataTypes
  )
  db[model.name] = model
}

// Association des modèles
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

export default db
