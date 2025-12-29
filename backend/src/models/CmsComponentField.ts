import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import CmsComponent from './CmsComponent';

class CmsComponentField extends Model {
  public id!: number;
  public component_id!: number;
  public field_name!: string;
  public field_type!: string;
  public field_value!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CmsComponentField.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    component_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CmsComponent,
        key: 'id',
      },
    },
    field_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    field_type: {
      type: DataTypes.STRING,
      allowNull: false,
      // e.g., 'text', 'rich_text', 'image', 'number', 'boolean'
    },
    field_value: {
      type: DataTypes.TEXT, // Using TEXT for flexibility
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'cms_component_fields',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['component_id', 'field_name'],
      },
    ],
  }
);

CmsComponent.hasMany(CmsComponentField, { foreignKey: 'component_id', as: 'fields' });
CmsComponentField.belongsTo(CmsComponent, { foreignKey: 'component_id', as: 'component' });

export default CmsComponentField;
