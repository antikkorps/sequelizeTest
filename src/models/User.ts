import { Model, DataTypes, Sequelize } from 'sequelize'
import bcrypt from 'bcrypt'

interface UserAttributes {
  id: number
  email: string
  name: string
  password?: string
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {
  password: string
}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number
  public email!: string
  public name!: string
  public password!: string

  // Timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Association methods
  public static associate(models: any) {
    // associations ici
    //example
    // User.hasMany(models.Task)
  }
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }

  public toJSON(): Omit<UserAttributes, 'password'> {
    const values = Object.assign({}, this.get())
    delete values.password
    return values
  }
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [6, 100],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: async (user: User) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
          }
        },
        beforeUpdate: async (user: User) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
          }
        },
      },
    }
  )

  return User
}
