const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'admin123!',
      10
    );

    await queryInterface.bulkInsert('admins', [
      {
        admin_id: process.env.ADMIN_ID || 'admin',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('admins', {
      admin_id: process.env.ADMIN_ID || 'admin',
    });
  },
};
