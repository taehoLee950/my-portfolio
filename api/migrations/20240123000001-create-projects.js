/**
 * @file /migrations/20240123000001-create-projects.js
 * @description Creates the 'projects' table.
 * @date 2026-01-23
 * @version 1.0.0
 */
'use strict';
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      title_ko: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      title_en: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      period: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      role_summary: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      my_tasks_ko: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      my_tasks_en: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      tech_stack: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      github_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.addIndex('projects', ['slug']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
  },
};
