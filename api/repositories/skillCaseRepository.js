import db from '../models/index.js';
const SkillCase = db.SkillCase;

const skillCaseRepository = {
  // 모든 사례 조회
  findAll: async (options = {}) => {
    const { category } = options;
    const where = {};
    if (category) {
      where.category = category;
    }

    return await SkillCase.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
  },

  // ID로 조회
  findById: async (id) => {
    return await SkillCase.findByPk(id);
  },

  // 사례 생성
  create: async (data) => {
    return await SkillCase.create(data);
  },

  // 사례 수정
  update: async (id, data) => {
    return await SkillCase.update(data, { where: { id } });
  },

  // 사례 삭제
  delete: async (id) => {
    return await SkillCase.destroy({ where: { id } });
  },
};

export default skillCaseRepository;
