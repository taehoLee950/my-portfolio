import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProjects, deleteProject } from '../../store/slices/projectSlice.js';
import { logout } from '../../store/slices/authSlice'; // Import logout if needed for testing
import ProjectModal from '../common/ProjectModal';
import ProjectFormModal from '../admin/ProjectFormModal'; // Import the new form modal
import './Projects.scss';

const Projects = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);
  const { isAuthenticated } = useSelector((state) => state.auth); // Get auth status

  const [selectedProject, setSelectedProject] = useState(null); // For view modal
  const [hoveredProject, setHoveredProject] = useState(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // For form modal visibility
  const [projectToEdit, setProjectToEdit] = useState(null); // For passing project data to form modal

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(fetchProjects());
    }
  }, [dispatch, loading]);

  const handleProjectClick = (project) => {
    setSelectedProject(project); // Open view modal
  };

  const handleCloseViewModal = () => {
    setSelectedProject(null);
  };

  const handleOpenAddModal = () => {
    setProjectToEdit(null); // No project to edit, it's a new one
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setProjectToEdit(project); // Pass project data for editing
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setProjectToEdit(null); // Clear project to edit
    dispatch(fetchProjects()); // Refresh projects after form submission
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(id))
        .unwrap()
        .then(() => alert('Project deleted successfully!'))
        .catch((err) => alert(`Failed to delete project: ${err}`));
    }
  };

  // 로딩 중 UI
  if (loading === 'pending') {
    return (
      <section id="projects" className="projects">
        <div className="projects__container">
          <h2 className="projects__title neon-text">{t('projects.title')}</h2>
          <div className="projects__loading">
            <span className="projects__loading-text">LOADING PROJECTS...</span>
          </div>
        </div>
      </section>
    );
  }

  // 에러 발생 UI
  if (error) {
    return (
      <section id="projects" className="projects">
        <div className="projects__container">
          <h2 className="projects__title neon-text">{t('projects.title')}</h2>
          <div className="projects__error">
            <span className="projects__error-text">ERROR: {error}</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="projects">
      <div className="projects__container">
        <h2 className="projects__title neon-text">{t('projects.title')}</h2>
        {isAuthenticated && (
          <div className="admin-actions">
            <button onClick={handleOpenAddModal} className="admin-button add-button">
              Add New Project
            </button>
            {/* <button onClick={() => dispatch(logout())} className="admin-button logout-button">Logout</button> */}
          </div>
        )}
        <div className="projects__grid">
          {projects && projects.length > 0 ? (
            projects.map((project, index) => {
              const serial = `ID: PROJECT-${String(project.id).padStart(6, '0')}`;
              const techStack = project.tech_stack || [];
              const firstImage = project.images && project.images.length > 0 
                ? project.images[0].image_url 
                : null;

              return (
            <motion.div
              key={project.id}
              className="projects__card"
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
                onClick={() => handleProjectClick(project)} // View modal on image click
              >
                {firstImage ? (
                  <img 
                    src={firstImage.startsWith('http') ? firstImage : `http://localhost:3000${firstImage}`} 
                    alt={project.title_ko || project.title} 
                  />
                ) : (
                  <div className="projects__card-placeholder">
                    <span className="projects__card-placeholder-text">
                      IMAGE_DATA_LOADING...
                    </span>
                  </div>
                )}
              </div>
              <div className="projects__card-content">
                <div className="projects__card-serial">{serial}</div>
                <h3 className="projects__card-title">
                  {project.title_ko || project.title}
                </h3>
                <p className="projects__card-description">
                  {project.role_summary || project.description}
                </p>
                <div className="projects__card-tags">
                  {techStack.map((tech) => (
                    <span key={tech} className="projects__card-tag">
                      [{tech}]
                    </span>
                  ))}
                </div>
                <button className="projects__card-button" onClick={() => handleProjectClick(project)}>
                  {t('projects.viewDetail')}
                </button>

                {isAuthenticated && (
                  <div className="admin-project-actions">
                    <button onClick={(e) => { e.stopPropagation(); handleOpenEditModal(project); }} className="admin-button edit-button">Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }} className="admin-button delete-button">Delete</button>
                  </div>
                )}
              </div>
            </motion.div>
              );
            })
          ) : (
            <div className="projects__empty">
              <span className="projects__empty-text">NO PROJECTS FOUND</span>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={handleCloseViewModal} />
        )}
        {isFormModalOpen && (
          <ProjectFormModal project={projectToEdit} onClose={handleCloseFormModal} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
