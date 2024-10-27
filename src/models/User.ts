import { Model, DataTypes, Sequelize } from 'sequelize'

interface UserAttributes {
  id: number
  email: string
  name: string
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number
  public email!: string
  public name!: string

  // Timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Association methods
  public static associate(models: any) {
    // associations ici
    //example
    // User.hasMany(models.Task)
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
    },
    {
      sequelize,
      modelName: 'User',
    }
  )

  return User
}
