const AppError = require('../utils/appError');
const skillCaseRepository = require('../repositories/skillCaseRepository');

const skillCaseService = {
  // 모든 사례 조회
  getAllSkillCases: async (options = {}) => {
    try {
      const cases = await skillCaseRepository.findAll(options);
      return cases;
    } catch (error) {
      throw new AppError('Failed to fetch skill cases', 500, 'FETCH_ERROR');
    }
  },

  // 사례 상세 조회
  getSkillCaseById: async (id) => {
    const skillCase = await skillCaseRepository.findById(id);
    if (!skillCase) {
      throw new AppError('Skill case not found', 404, 'SKILL_CASE_NOT_FOUND');
    }
    return skillCase;
  },

  // 사례 생성
  createSkillCase: async (data) => {
    try {
      const skillCase = await skillCaseRepository.create(data);
      return skillCase;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create skill case', 500, 'CREATE_ERROR');
    }
  },

  // 사례 수정
  updateSkillCase: async (id, data) => {
    const skillCase = await skillCaseRepository.findById(id);
    if (!skillCase) {
      throw new AppError('Skill case not found', 404, 'SKILL_CASE_NOT_FOUND');
    }

    await skillCaseRepository.update(id, data);
    return await skillCaseRepository.findById(id);
  },

  // 사례 삭제
  deleteSkillCase: async (id) => {
    const skillCase = await skillCaseRepository.findById(id);
    if (!skillCase) {
      throw new AppError('Skill case not found', 404, 'SKILL_CASE_NOT_FOUND');
    }

    await skillCaseRepository.delete(id);
    return { message: 'Skill case deleted successfully' };
  },
};

module.exports = skillCaseService;
