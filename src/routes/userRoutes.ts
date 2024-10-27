// src/routes/userRoutes.ts
import express from 'express'
import { UserController } from '../controllers/UserController'

const router = express.Router()

// Routes d'authentification
router.post('/register', async (req, res, next) => {
  try {
    await UserController.register(req, res)
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    await UserController.login(req, res)
  } catch (error) {
    next(error)
  }
})

// Routes CRUD
router.get('/', async (req, res, next) => {
  try {
    await UserController.getAllUsers(req, res)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    await UserController.getUserById(req, res)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    await UserController.updateUser(req, res)
  } catch (error) {
    next(error)
  }
})

router.put('/:id/password', async (req, res, next) => {
  try {
    await UserController.changePassword(req, res)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await UserController.deleteUser(req, res)
  } catch (error) {
    next(error)
  }
})

export default router
