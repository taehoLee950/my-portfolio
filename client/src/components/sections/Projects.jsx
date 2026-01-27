import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchProjects,
  deleteProject,
} from "../../store/slices/projectSlice.js";
import ProjectModal from "../common/ProjectModal";
import ProjectFormModal from "../admin/ProjectFormModal";
import "./Projects.scss";

const projectImages = import.meta.glob(
  "../../assets/images/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

const Projects = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  useEffect(() => {
    if (loading === "idle") {
      dispatch(fetchProjects());
    }
  }, [dispatch, loading]);

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setProjectToEdit(null);
  };

  const safeParseTechStack = (techStack) => {
    if (Array.isArray(techStack)) return techStack;
    if (typeof techStack === "string") {
      try {
        const parsed = JSON.parse(techStack);
        return Array.isArray(parsed) ? parsed : [techStack];
      } catch (e) {
        return techStack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

  return (
    <section id="projects" className="projects">
      <div className="projects__container">
        <header className="projects__header">
          <h2
            className="projects__title neon-text"
            data-text={t("projects.title")}
          >
            {t("projects.title")}
          </h2>
          {isAuthenticated && (
            <div className="admin-actions">
              <button
                onClick={() => setIsFormModalOpen(true)}
                className="admin-button add-button"
              >
                [+] NEW_PROJECT
              </button>
            </div>
          )}
        </header>

        <div className="projects__grid">
          {projects && projects.length > 0 ? (
            projects.map((project, index) => {
              const currentTitle =
                i18n.language === "ko" ? project.title_ko : project.title_en;
              const imageNum = (index % 4) + 1;
              const fileName = project.thumbnail || `icemachine${imageNum}.png`;
              const imageSrc =
                projectImages[`../../assets/images/${fileName}`]?.default;
              const techStacks = safeParseTechStack(project.tech_stack);

              return (
                <motion.div
                  // 임~ 코멘트: 중복 키 방지를 위해 ID와 인덱스 조합
                  key={`proj-card-${project.id || index}`}
                  className="projects__card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className="projects__card-image"
                    onClick={() => setSelectedProject(project)}
                  >
                    {imageSrc ? (
                      <img src={imageSrc} alt={currentTitle} loading="lazy" />
                    ) : (
                      <div className="projects__card-placeholder">NO_IMAGE</div>
                    )}
                    <div className="projects__card-overlay">
                      <span className="view-text">VIEW_SYSTEM_DATA</span>
                    </div>
                  </div>

                  <div className="projects__card-content">
                    <div className="projects__card-serial">
                      PROJ_{String(project.id || index).padStart(4, "0")} / v.
                      {project.version || 0}
                    </div>
                    <h3 className="projects__card-title">{currentTitle}</h3>
                    <p className="projects__card-description">
                      {project.role_summary}
                    </p>

                    <div className="projects__card-tags">
                      {techStacks.map((tech, idx) => (
                        <span
                          key={`tag-${project.id}-${idx}`}
                          className="projects__card-tag"
                        >
                          #{tech}
                        </span>
                      ))}
                    </div>

                    <div className="projects__card-footer">
                      <button
                        className="projects__card-button"
                        onClick={() => setSelectedProject(project)}
                      >
                        {t("projects.viewDetail")}
                      </button>

                      {isAuthenticated && (
                        <div className="admin-project-actions">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectToEdit(project);
                              setIsFormModalOpen(true);
                            }}
                            className="admin-button edit-button"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm("정말 삭제하시겠습니까?"))
                                dispatch(deleteProject(project.id));
                            }}
                            className="admin-button delete-button"
                          >
                            DEL
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="projects__empty">NO_PROJECTS_FOUND</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
        {isFormModalOpen && (
          <ProjectFormModal
            project={projectToEdit}
            onClose={handleCloseFormModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
