import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import CmsPage from './CmsPage';

class CmsComponent extends Model {
  public id!: number;
  public page_id!: number;
  public type!: string;
  public name!: string;
  public sort_order!: number;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CmsComponent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    page_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CmsPage,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'cms_components',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

CmsPage.hasMany(CmsComponent, { foreignKey: 'page_id', as: 'components' });
CmsComponent.belongsTo(CmsPage, { foreignKey: 'page_id', as: 'page' });

export default CmsComponent;
