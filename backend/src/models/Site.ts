import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

class Site extends Model {
  public id!: number;
  public name!: string;
  public layout!: Array<{
    type: string;
    props: Record<string, any>;
    id: number;
    layout?: {
      width?: string;
      newRow?: boolean;
      padding?: number;
    };
  }>;
  public userId!: number;
  public isPublished!: boolean;
  public buildPath?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Site.init(
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
    layout: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    buildPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Site',
  }
);

// Relacionamento com User
Site.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Site, { foreignKey: 'userId' });

export default Site; 