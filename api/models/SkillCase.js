const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SkillCase = sequelize.define(
  'SkillCase',
  {
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
  },
  {
    tableName: 'skill_cases',
    timestamps: true,
    underscored: true,
  }
);

module.exports = SkillCase;
