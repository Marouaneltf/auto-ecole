import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import ServiceCategory from './ServiceCategory';

class Service extends Model {
  public id!: number;
  public category_id!: number;
  public name!: string;
  public slug!: string;
  public description!: string;
  public price!: number;
  public duration!: string;
  public is_active!: boolean;
  public icon!: string;
  public sort_order!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Service.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ServiceCategory,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    duration: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    icon: {
      type: DataTypes.STRING,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'services',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Define relationship
Service.belongsTo(ServiceCategory, { foreignKey: 'category_id', as: 'category' });
ServiceCategory.hasMany(Service, { foreignKey: 'category_id', as: 'services' });

export default Service;
