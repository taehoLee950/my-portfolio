import "dotenv/config";

/** @type {import('sequelize-cli').Migration} */
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
        "Utility & Export", // New category
        "Test-Driven Development", // New category
      ),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // 롤백 시 원래 ENUM 값으로 되돌립니다.
    // 주의: 원래 ENUM 값 목록을 정확히 알아야 합니다.
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
      ),
      allowNull: false,
    });
  },
};
