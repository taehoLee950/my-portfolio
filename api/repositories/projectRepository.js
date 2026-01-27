import db from '../models/index.js';
const { Project, ProjectImage } = db;

const projectRepository = {
  // 모든 프로젝트 조회 (내림차순 정렬)
  findAll: async () => {
    return await Project.findAll({
      order: [['period', 'DESC']],
      include: [
        {
          model: ProjectImage,
          as: 'images',
          required: false,
          order: [['sort_order', 'ASC']],
        },
      ],
    });
  },

  // Slug로 조회
  findBySlug: async (slug) => {
    return await Project.findOne({
      where: { slug },
      include: [
        {
          model: ProjectImage,
          as: 'images',
          required: false,
          order: [['sort_order', 'ASC']],
        },
      ],
    });
  },

  // ID로 조회
  findById: async (id) => {
    return await Project.findByPk(id, {
      include: [
        {
          model: ProjectImage,
          as: 'images',
          required: false,
          order: [['sort_order', 'ASC']],
        },
      ],
    });
  },

  // 프로젝트 생성
  create: async (data) => {
    return await Project.create(data);
  },

  // 프로젝트 수정 (낙관적 락 적용)
  update: async (id, data, currentVersion) => {
    const [affectedRows] = await Project.update(
      { ...data, version: currentVersion + 1 },
      {
        where: {
          id,
          version: currentVersion, // 버전 체크
        },
      }
    );
    return affectedRows > 0;
  },

  // 프로젝트 삭제
  delete: async (id) => {
    return await Project.destroy({ where: { id } });
  },

  // 이미지 추가
  addImage: async (projectId, imageData) => {
    return await ProjectImage.create({
      project_id: projectId,
      ...imageData,
    });
  },

  // 이미지 삭제
  deleteImage: async (imageId) => {
    return await ProjectImage.destroy({ where: { id: imageId } });
  },
};

export default projectRepository;
