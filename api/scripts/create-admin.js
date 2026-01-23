require('dotenv').config();
const bcrypt = require('bcrypt');
const adminRepository = require('../repositories/adminRepository');

const createAdmin = async () => {
  const args = process.argv.slice(2);
  const adminId = args[0] || process.env.ADMIN_ID || 'admin';
  const password = args[1] || process.env.ADMIN_PASSWORD || 'admin123!';

  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // 기존 관리자 확인
    const existing = await Admin.findOne({ where: { admin_id: adminId } });
    if (existing) {
      console.log('Admin already exists with ID:', adminId);
      process.exit(0);
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 관리자 생성
    await Admin.create({
      admin_id: adminId,
      password: hashedPassword,
    });

    console.log('\n✅ Admin created successfully!');
    console.log('📝 Admin ID:', adminId);
    console.log('🔑 Password:', password);
    console.log('\n⚠️  Please save these credentials securely!');
    console.log('\n💡 Add to .env file:');
    console.log(`ADMIN_ID=${adminId}`);
    console.log(`ADMIN_PASSWORD=${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
