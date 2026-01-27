import { Op } from 'sequelize';
import db from '../models/index.js';
const Inquiry = db.Inquiry;

const inquiryRepository = {
  // 모든 문의 조회
  findAll: async (options = {}) => {
    const { status, limit, offset } = options;
    const where = {};
    if (status) {
      where.status = status;
    }

    return await Inquiry.findAndCountAll({
      where,
      limit: limit || 50,
      offset: offset || 0,
      order: [['created_at', 'DESC']],
    });
  },

  // ID로 조회
  findById: async (id) => {
    return await Inquiry.findByPk(id);
  },

  // 문의 생성
  create: async (data, options = {}) => {
    return await Inquiry.create(data, options);
  },

  // 상태 업데이트
  updateStatus: async (id, status) => {
    return await Inquiry.update(
      { status },
      { where: { id } }
    );
  },

  // IP 주소로 최근 문의 확인 (스팸 방지)
  findRecentByIp: async (ipAddress, minutes = 5) => {
    const fiveMinutesAgo = new Date(Date.now() - minutes * 60 * 1000);
    return await Inquiry.findOne({
      where: {
        ip_address: ipAddress,
        created_at: {
          [Op.gte]: fiveMinutesAgo,
        },
      },
    });
  },
};

export default inquiryRepository;
