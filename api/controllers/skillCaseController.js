import asyncHandler from '../utils/asyncHandler.js';
import skillCaseService from '../services/skillCaseService.js';

const skillCaseController = {
  // 모든 사례 조회
  getAllSkillCases: asyncHandler(async (req, res, next) => {
    const { category } = req.query;
    const cases = await skillCaseService.getAllSkillCases({ category });

    res.status(200).json({
      status: 'success',
      data: cases,
    });
  }),

  // 사례 상세 조회
  getSkillCaseById: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const skillCase = await skillCaseService.getSkillCaseById(id);

    res.status(200).json({
      status: 'success',
      data: skillCase,
    });
  }),

  // 사례 생성 (관리자용)
  createSkillCase: asyncHandler(async (req, res, next) => {
    const skillCase = await skillCaseService.createSkillCase(req.body);

    res.status(201).json({
      status: 'success',
      data: skillCase,
    });
  }),

  // 사례 수정 (관리자용)
  updateSkillCase: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const skillCase = await skillCaseService.updateSkillCase(id, req.body);

    res.status(200).json({
      status: 'success',
      data: skillCase,
    });
  }),

  // 사례 삭제 (관리자용)
  deleteSkillCase: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await skillCaseService.deleteSkillCase(id);

    res.status(200).json({
      status: 'success',
      message: 'Skill case deleted successfully',
    });
  }),
};

export default skillCaseController;
