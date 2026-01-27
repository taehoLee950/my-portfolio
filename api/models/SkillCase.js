'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class SkillCase extends Model {
    static associate(models) {
      // associations can be defined here
    }
  }

  SkillCase.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.ENUM('Frontend', 'Backend', 'DevOps', 'JavaScript (ES6+)', 'CSS & UI/UX', 'PWA', 'API Documentation', 'Backend (Node.js/Express)', 'Backend (MySQL/Sequelize)', 'Utility & Export', 'Test-Driven Development'),
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
    content_ko: { // Reverted from description
      type: DataTypes.TEXT,
      allowNull: false, // Assuming not null based on original
      validate: {
        notEmpty: true,
      },
    },
    content_en: { // Reverted from description
      type: DataTypes.TEXT,
      allowNull: false, // Assuming not null based on original
      validate: {
        notEmpty: true,
      },
    },
    notion_link: { // Reverted from notionUrl
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
