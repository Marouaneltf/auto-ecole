import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class CmsPage extends Model {
  public id!: number;
  public slug!: string;
  public title!: string;
  public meta_description!: string;
  public status!: 'draft' | 'published';
  public published_at!: Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CmsPage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'draft',
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'cms_pages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default CmsPage;
