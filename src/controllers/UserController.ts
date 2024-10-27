// src/controllers/UserController.ts
import { Request, Response } from 'express'
import db from '../models'

export class UserController {
  /**
   * Inscrit un nouvel utilisateur
   */
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({
          error: 'Tous les champs sont requis',
        })
      }

      // Vérifier si l'email existe déjà
      const existingUser = await db.User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(400).json({
          error: 'Un utilisateur avec cet email existe déjà',
        })
      }

      const user = await db.User.create({
        name,
        email,
        password,
      })

      return res.status(201).json(user)
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      return res.status(500).json({
        error: "Une erreur est survenue lors de l'inscription",
      })
    }
  }

  /**
   * Authentifie un utilisateur
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({
          error: 'Email et mot de passe requis',
        })
      }

      const user = await db.User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({
          error: 'Email ou mot de passe incorrect',
        })
      }

      const validPassword = await user.validatePassword(password)
      if (!validPassword) {
        return res.status(401).json({
          error: 'Email ou mot de passe incorrect',
        })
      }

      return res.status(200).json(user)
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      return res.status(500).json({
        error: 'Une erreur est survenue lors de la connexion',
      })
    }
  }

  /**
   * Récupère tous les utilisateurs
   */
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await db.User.findAll({
        attributes: { exclude: ['password'] },
      })
      return res.json(users)
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      return res.status(500).json({
        error:
          'Une erreur est survenue lors de la récupération des utilisateurs',
      })
    }
  }

  /**
   * Récupère un utilisateur par son ID
   */
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const user = await db.User.findByPk(id)
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé',
        })
      }

      return res.json(user)
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error)
      return res.status(500).json({
        error:
          "Une erreur est survenue lors de la récupération de l'utilisateur",
      })
    }
  }

  /**
   * Met à jour un utilisateur
   */
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, email } = req.body

      const user = await db.User.findByPk(id)
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé',
        })
      }

      if (email && email !== user.email) {
        const existingUser = await db.User.findOne({ where: { email } })
        if (existingUser) {
          return res.status(400).json({
            error: 'Cet email est déjà utilisé',
          })
        }
      }

      await user.update({
        name,
        email,
      })

      return res.json(user)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      return res.status(500).json({
        error: 'Une erreur est survenue lors de la mise à jour',
      })
    }
  }

  /**
   * Change le mot de passe d'un utilisateur
   */
  static async changePassword(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { currentPassword, newPassword } = req.body

      const user = await db.User.findByPk(id)
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé',
        })
      }

      const validPassword = await user.validatePassword(currentPassword)
      if (!validPassword) {
        return res.status(401).json({
          error: 'Mot de passe actuel incorrect',
        })
      }

      await user.update({ password: newPassword })

      return res.json({
        message: 'Mot de passe modifié avec succès',
      })
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      return res.status(500).json({
        error: 'Une erreur est survenue lors du changement de mot de passe',
      })
    }
  }

  /**
   * Supprime un utilisateur
   */
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params

      const user = await db.User.findByPk(id)
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé',
        })
      }

      await user.destroy()

      return res.json({
        message: 'Utilisateur supprimé avec succès',
      })
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      return res.status(500).json({
        error: 'Une erreur est survenue lors de la suppression',
      })
    }
  }
}
