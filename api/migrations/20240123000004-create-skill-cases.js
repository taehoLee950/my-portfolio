/**
 * @file /migrations/20240123000004-create-skill-cases.js
 * @description Creates the 'skill_cases' table.
 * @date 2026-01-23
 * @version 1.0.0
 */
'use strict';
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('skill_cases', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM('Frontend', 'Backend', 'DevOps'),
        allowNull: false,
      },
      skill_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      content_ko: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      content_en: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      notion_link: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      reference_link: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('skill_cases');
  },
};
