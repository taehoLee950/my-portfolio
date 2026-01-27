import 'dotenv/config';
import bcrypt from 'bcrypt';
import sequelize from '../config/sequelize.js';
import Admin from '../models/Admin.js';

const resetPassword = async () => {
  const args = process.argv.slice(2);
  const adminId = args[0] || process.env.ADMIN_ID || 'admin';
  const newPassword = args[1];

  if (!newPassword) {
    console.error('❌ Usage: node scripts/reset-admin-password.js <adminId> <newPassword>');
    process.exit(1);
  }

  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    const admin = await Admin.findOne({ where: { admin_id: adminId } });
    if (!admin) {
      console.error('❌ Admin not found with ID:', adminId);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Admin.update(
      { password: hashedPassword },
      { where: { id: admin.id } }
    );

    console.log('\n✅ Password reset successfully!');
    console.log('📝 Admin ID:', adminId);
    console.log('🔑 New Password:', newPassword);
    console.log('\n💡 Update .env file:');
    console.log(`ADMIN_PASSWORD=${newPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    process.exit(1);
  }
};

await resetPassword();
