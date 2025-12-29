import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class ContactMessage extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public message!: string;
  public is_read!: boolean;
  public readonly created_at!: Date;
}

ContactMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'contact_messages',
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
  }
);

export default ContactMessage;
