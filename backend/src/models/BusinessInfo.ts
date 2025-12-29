import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class BusinessInfo extends Model {
  public id!: number;
  public name!: string;
  public address!: string;
  public phone!: string;
  public email!: string;
  public description!: string;
  public siret!: string;
  public insurance_info!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

BusinessInfo.init(
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
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    siret: {
      type: DataTypes.STRING,
    },
    insurance_info: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'business_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default BusinessInfo;
