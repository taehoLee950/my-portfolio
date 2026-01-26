import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './ProjectModal.scss';

const ProjectModal = ({ project, onClose }) => {
  const { t } = useTranslation();

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
  };

  return (
    <motion.div
      className="project-modal__overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="project-modal__content"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="project-modal__close" onClick={onClose}>
          ×
        </button>
        <div className="project-modal__header">
          <h2 className="project-modal__title">
            {project.title_ko || project.title}
          </h2>
        </div>
        <div className="project-modal__body">
          <p className="project-modal__description">
            {project.role_summary || project.description}
          </p>
          <div className="project-modal__technologies">
            <h3>사용 기술</h3>
            <div className="project-modal__tags">
              {(project.tech_stack || project.technologies || []).map((tech) => (
                <span key={tech} className="project-modal__tag">
                  [{tech}]
                </span>
              ))}
            </div>
          </div>
          {project.my_tasks_ko && (
            <div className="project-modal__section">
              <h3>담당 업무</h3>
              <p>{project.my_tasks_ko}</p>
            </div>
          )}
          {project.github_url && (
            <div className="project-modal__section">
              <h3>GitHub</h3>
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal__link"
              >
                {project.github_url}
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;
