import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Project from './Project.js';

const ProjectImage = sequelize.define(
  'ProjectImage',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Project,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
        isUrl: {
          msg: 'Invalid URL format',
        },
      },
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'project_images',
    timestamps: true,
    underscored: true,
  }
);

// Associations
ProjectImage.belongsTo(Project, { foreignKey: 'project_id' });
Project.hasMany(ProjectImage, { foreignKey: 'project_id', as: 'images' });

export default ProjectImage;
