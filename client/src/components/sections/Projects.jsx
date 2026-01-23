import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectModal from '../common/ProjectModal';
import './Projects.scss';

const Projects = () => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);

  // 추후 API에서 가져올 데이터 구조
  const projects = [
    {
      id: 1,
      title: '2차 프로젝트',
      description: '프로젝트 설명',
      image: '',
      technologies: ['React', 'Node.js', 'MySQL'],
      troubleshooting: '문제 해결 내용',
      improvement: '개선 사항',
      serial: 'ID: PROJECT-2024-001',
    },
    {
      id: 2,
      title: '포트폴리오 웹사이트',
      description: '현재 프로젝트',
      image: '',
      technologies: ['React', 'Vite', 'Redux Toolkit'],
      troubleshooting: '',
      improvement: '',
      serial: 'ID: PROJECT-2024-002',
    },
  ];

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="projects">
      <div className="projects__container">
        <h2 className="projects__title neon-text">{t('projects.title')}</h2>
        <div className="projects__grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="projects__card"
              onClick={() => handleProjectClick(project)}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`projects__card-image ${
                  hoveredProject === project.id ? 'projects__card-image--hover' : ''
                }`}
              >
                {project.image ? (
                  <img src={project.image} alt={project.title} />
                ) : (
                  <div className="projects__card-placeholder">
                    <span className="projects__card-placeholder-text">
                      IMAGE_DATA_LOADING...
                    </span>
                  </div>
                )}
              </div>
              <div className="projects__card-content">
                <div className="projects__card-serial">{project.serial}</div>
                <h3 className="projects__card-title">{project.title}</h3>
                <p className="projects__card-description">{project.description}</p>
                <div className="projects__card-tags">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="projects__card-tag">
                      [{tech}]
                    </span>
                  ))}
                </div>
                <button className="projects__card-button">
                  {t('projects.viewDetail')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
