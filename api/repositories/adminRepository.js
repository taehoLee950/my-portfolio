import db from '../models/index.js';
const Admin = db.Admin;

const adminRepository = {
  // 관리자 ID로 조회
  findByAdminId: async (adminId) => {
    return await Admin.findOne({ where: { admin_id: adminId } });
  },

  // ID로 조회
  findById: async (id) => {
    return await Admin.findByPk(id);
  },

  // 관리자 생성
  create: async (data) => {
    return await Admin.create(data);
  },

  // Refresh Token 업데이트
  updateRefreshToken: async (id, refreshToken) => {
    return await Admin.update(
      { refresh_token: refreshToken },
      { where: { id } }
    );
  },

  // Push Subscription 업데이트
  updatePushSubscription: async (id, subscription) => {
    return await Admin.update(
      { push_subscription: subscription },
      { where: { id } }
    );
  },

  // 비밀번호 업데이트
  updatePassword: async (id, hashedPassword) => {
    return await Admin.update(
      { password: hashedPassword },
      { where: { id } }
    );
  },

  // 모든 관리자 조회 (푸시 알림용)
  findAll: async () => {
    return await Admin.findAll({
      attributes: ['id', 'push_subscription'],
    });
  },
};

export default adminRepository;
