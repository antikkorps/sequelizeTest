import 'dotenv/config'
import db from './models'
import express from 'express'

const app = express()
const port = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test-db', async (req, res) => {
  try {
    await db.sequelize.authenticate()
    res.json({ message: 'Connexion à la base de données réussie!' })
  } catch (error) {
    res.status(500).json({ error: 'Erreur de connexion à la base de données' })
  }
})

const initializeDatabase = async () => {
  try {
    await db.sequelize.authenticate()
    console.log('✅ Connexion à la base de données établie avec succès.')

    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: true })
      console.log('✅ Modèles synchronisés avec la base de données')
    }
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:', error)
    process.exit(1)
  }
}

// Démarrage du serveur après l'initialisation de la base de données
const startServer = async () => {
  await initializeDatabase()

  app.listen(port, () => {
    console.log(`✅ Serveur démarré sur le port ${port}`)
  })
}

startServer()

export default app
