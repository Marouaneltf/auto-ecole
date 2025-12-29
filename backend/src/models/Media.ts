import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Media extends Model {
  public id!: number;
  public filename!: string;
  public original_name!: string;
  public mime_type!: string;
  public file_size!: number;
  public path!: string;
  public alt_text!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Media.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    original_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alt_text: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'media',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Media;
