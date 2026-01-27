/**
 * @file /migrations/20240123000002-create-inquiries.js
 * @description Creates the 'inquiries' table.
 * @date 2026-01-23
 * @version 1.0.0
 */
'use strict';
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inquiries', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('unseen', 'seen', 'replied'),
        allowNull: false,
        defaultValue: 'unseen',
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: false,
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
    await queryInterface.dropTable('inquiries');
  },
};
