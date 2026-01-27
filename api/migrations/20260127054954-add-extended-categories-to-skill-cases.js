"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("skill_cases", "category", {
      type: Sequelize.ENUM(
        "Frontend",
        "Backend",
        "DevOps",
        "JavaScript (ES6+)",
        "CSS & UI/UX",
        "PWA",
        "API Documentation",
        "Backend (Node.js/Express)",
        "Backend (MySQL/Sequelize)",
        "Utility & Export",
        "Test-Driven Development",
      ),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // 롤백 시 원래 있었던 3가지 타입으로 다시 축소 (주의: 다른 데이터가 있으면 에러 발생 가능)
    await queryInterface.changeColumn("skill_cases", "category", {
      type: Sequelize.ENUM("Frontend", "Backend", "DevOps"),
      allowNull: false,
    });
  },
};
