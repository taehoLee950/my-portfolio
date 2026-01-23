'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class SkillCase extends Model {
    static associate(models) {
      // define association here
    }
  }

  SkillCase.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.ENUM('Frontend', 'Backend', 'DevOps'),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    skill_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    content_ko: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    content_en: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    notion_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Invalid URL format',
        },
      },
    },
    reference_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Invalid URL format',
        },
      },
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'SkillCase',
    tableName: 'skill_cases',
    timestamps: true,
    underscored: true,
  });

  return SkillCase;
};
