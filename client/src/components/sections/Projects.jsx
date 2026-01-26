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

// 임~ 코멘트: assets/images 폴더 내의 이미지를 한 번에 불러오기
const projectImages = import.meta.glob("../../assets/images/*.{png,jpg,jpeg,webp}", { eager: true });

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

  return (
    <section id="projects" className="projects">
      <div className="projects__container">
        <header className="projects__header">
          <h2 className="projects__title neon-text" data-text={t("projects.title")}>
            {t("projects.title")}
          </h2>
          {isAuthenticated && (
            <div className="admin-actions">
              <button onClick={() => setIsFormModalOpen(true)} className="admin-button add-button">
                [+] NEW_PROJECT
              </button>
            </div>
          )}
        </header>

        <div className="projects__grid">
          {projects && projects.length > 0 ? (
            projects.map((project, index) => {
              const currentTitle = i18n.language === "ko" ? project.title_ko : project.title_en;
              
              /**
               * 임~ 코멘트: icemachine1~4.png 매핑 로직
               * 1. DB에 thumbnail 파일명이 있으면 그걸 사용
               * 2. 없으면 index를 활용해 순환 매칭 (1, 2, 3, 4, 1, 2...)
               */
              const imageNum = (index % 4) + 1; // 1부터 4까지 반복
              const fileName = project.thumbnail || `icemachine${imageNum}.png`;
              const imageSrc = projectImages[`../../assets/images/${fileName}`]?.default;

              return (
                <motion.div
                  key={project.id}
                  className="projects__card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="projects__card-image" onClick={() => setSelectedProject(project)}>
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
                      PROJ_{String(project.id).padStart(4, "0")} / v.{project.version}
                    </div>
                    <h3 className="projects__card-title">{currentTitle}</h3>
                    <p className="projects__card-description">
                      {i18n.language === "ko" ? project.role_summary : project.role_summary}
                    </p>

                    <div className="projects__card-tags">
                      {project.tech_stack?.map((tech) => (
                        <span key={tech} className="projects__card-tag">#{tech}</span>
                      ))}
                    </div>

                    <div className="projects__card-footer">
                      <button className="projects__card-button" onClick={() => setSelectedProject(project)}>
                        {t("projects.viewDetail")}
                      </button>

                      {isAuthenticated && (
                        <div className="admin-project-actions">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setProjectToEdit(project); setIsFormModalOpen(true); }} 
                            className="admin-button edit-button"
                          >
                            EDIT
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); dispatch(deleteProject(project.id)); }} 
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
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
        {isFormModalOpen && <ProjectFormModal project={projectToEdit} onClose={handleCloseFormModal} />}
      </AnimatePresence>
    </section>
  );
};

export default Projects;