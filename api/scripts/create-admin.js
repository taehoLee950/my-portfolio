import 'dotenv/config';
import bcrypt from 'bcrypt';

import sequelize from '../config/sequelize.js';
import Admin from '../models/Admin.js';

const createAdmin = async () => {
  const args = process.argv.slice(2);
  const adminId = args[0] || process.env.ADMIN_ID || 'admin';
  const password = args[1] || process.env.ADMIN_PASSWORD || 'admin123!';

  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    const existing = await Admin.findOne({ where: { admin_id: adminId } });
    if (existing) {
      console.log('Admin already exists with ID:', adminId);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ admin_id: adminId, password: hashedPassword });

    console.log('\n✅ Admin created successfully!');
    console.log('📝 Admin ID:', adminId);
    console.log('🔑 Password:', password);
    console.log('\n💡 Save to api/.env:');
    console.log(`ADMIN_ID=${adminId}`);
    console.log(`ADMIN_PASSWORD=${password}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

await createAdmin();
