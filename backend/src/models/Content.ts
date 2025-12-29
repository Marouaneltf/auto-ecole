import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Content extends Model {
  public id!: number;
  public page_name!: string;
  public section_name!: string;
  public content_type!: string;
  public content!: string;
  public metadata!: any;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Content.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    page_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content_type: {
      type: DataTypes.STRING,
      defaultValue: 'text',
    },
    content: {
      type: DataTypes.TEXT,
    },
    metadata: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    tableName: 'content',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['page_name', 'section_name'],
      },
    ],
  }
);

export default Content;
