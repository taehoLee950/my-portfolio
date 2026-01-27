/**
 * @file seeders/20260123000000-create-admin.js
 * @description 'admins' 테이블 초기 데이터 생성 (환경 변수 기반)
 */
import bcrypt from "bcrypt";
import "dotenv/config";

const tableName = "admins";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const adminId = process.env.ADMIN_ID;
    const rawPassword = process.env.ADMIN_PASSWORD;

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await queryInterface.bulkInsert(tableName, [
      {
        admin_id: adminId,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, {
      admin_id: process.env.ADMIN_ID || "admin",
    });
  },
};
