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
import { Terminal, Database, Activity, Box } from "lucide-react";
import "./Projects.scss";

const Projects = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    if (loading === "idle") {
      dispatch(fetchProjects());
    }
  }, [dispatch, loading]);

  const getImageUrl = (project) => {
    if (project.images && project.images.length > 0) {
      const path = project.images[0].image_url;
      return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    }
    return null;
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setProjectToEdit(null);
  };

  return (
    <section id="projects" className="projects">
      {/* 배경 장식 레이어 */}
      <div className="projects__cyber-bg">
        <div className="grid-lines"></div>
        <div className="moving-dots"></div>
      </div>

      <div className="projects__container">
        <header className="projects__header">
          <motion.div
            className="title-container"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2
              className="projects__title neon-text"
              data-text={t("projects.title")}
            >
              {t("projects.title")}
            </h2>
            <div className="system-path">
              <span className="blink">root@gemini:~/</span>
              <span>projects --all --visualize</span>
            </div>
          </motion.div>

          {isAuthenticated && (
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="admin-button add-button"
            >
              [+] ADD_DATA_NODE
            </button>
          )}
        </header>

        <div className="projects__scatter-grid">
          {projects && projects.length > 0 ? (
            projects.map((project, index) => {
              const currentTitle =
                i18n.language === "ko" ? project.title_ko : project.title_en;
              const imageSrc = getImageUrl(project);

              return (
                <motion.div
                  key={`proj-${project.id || index}`}
                  className={`projects__node node-${(index % 4) + 1}`}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="node-connector"></div>

                  <div
                    className="node-content"
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* 데이터 칩 느낌의 헤더 */}
                    <div className="node-header">
                      <Box size={14} />
                      <span className="node-id">
                        NODE_{String(project.id).padStart(3, "0")}
                      </span>
                      <div className="status-dot"></div>
                    </div>

                    <div className="node-image-wrapper">
                      <div className="glitch-overlay"></div>
                      {imageSrc ? (
                        <img src={imageSrc} alt={currentTitle} />
                      ) : (
                        <div className="no-image">
                          <Database />
                        </div>
                      )}
                    </div>

                    <div className="node-info">
                      <h3 className="node-title">{currentTitle}</h3>
                      <div className="node-footer">
                        <span className="access-btn">ACCESS_DATA</span>
                        <div className="version">
                          V.{project.version || "1.0"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isAuthenticated && (
                    <div className="node-admin">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToEdit(project);
                          setIsFormModalOpen(true);
                        }}
                      >
                        EDIT
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("RM?"))
                            dispatch(deleteProject(project.id));
                        }}
                      >
                        RM
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="projects__empty">NO_DATA_FOUND_IN_SECTOR</div>
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
