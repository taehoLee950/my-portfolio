import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectBySlug,
  clearCurrentProject,
} from "../../store/slices/projectSlice";
import Portal from "./Portal";
import "./ProjectModal.scss";

const ProjectModal = ({ project: initialProject, onClose }) => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Redux에서 최신 상세 데이터를 가져옴
  const { currentProject, loading } = useSelector((state) => state.projects);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // 1. 모달이 열릴 때 상세 데이터 요청
  useEffect(() => {
    if (initialProject?.slug) {
      dispatch(fetchProjectBySlug(initialProject.slug));
    }
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
      dispatch(clearCurrentProject()); // 닫힐 때 데이터 초기화
    };
  }, [initialProject, dispatch]);

  // 2. 표시할 데이터 결정 (상세 데이터가 오면 그것을 사용, 아니면 초기 전달값 사용)
  const d = useMemo(() => {
    return currentProject || initialProject;
  }, [currentProject, initialProject]);

  // [수정] 에러 방지 및 파싱 로직 강화
  const techStacks = useMemo(() => {
    if (!d?.tech_stack) return [];
    let stack = d.tech_stack;

    if (typeof stack === "string") {
      try {
        const parsed = JSON.parse(stack);
        stack = Array.isArray(parsed) ? parsed : [stack];
      } catch {
        stack = stack.split(",").map((t) => t.trim());
      }
    }

    if (Array.isArray(stack)) {
      return stack
        .map((t) => String(t).replace(/[\\"]/g, "").trim())
        .filter(Boolean); // 배열 끝에서 필터링하여 TypeError 방지
    }
    return [];
  }, [d]);

  const displayImages = useMemo(() => {
    if (!d) return [];
    const imageUrls = [];
    if (d.images && Array.isArray(d.images)) {
      d.images.forEach((img) => {
        if (img.image_url) {
          const fullPath = img.image_url.startsWith("http")
            ? img.image_url
            : `${API_BASE_URL}${img.image_url}`;
          imageUrls.push(fullPath);
        }
      });
    }
    return imageUrls;
  }, [d, API_BASE_URL]);

  if (!d) return null;

  const currentTitle =
    i18n.language === "ko" ? d.title_ko || d.title : d.title_en || d.title;
  const currentMyTasks = i18n.language === "ko" ? d.my_tasks_ko : d.my_tasks_en;

  const navigateImage = (e, direction) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) =>
        (prev + direction + displayImages.length) % displayImages.length,
    );
  };

  return (
    <Portal>
      <div className="project-modal-container">
        <motion.div
          className="project-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="project-modal__content"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {loading === "pending" && (
              <div className="modal-loader">LOADING_SYSTEM_DATA...</div>
            )}

            <button className="project-modal__close" onClick={onClose}>
              ×
            </button>

            <div className="project-modal__header">
              <h2 className="project-modal__title">{currentTitle}</h2>
              <p className="project-modal__period">
                LOG_DATE: {d.period || "UNDEFINED"}
              </p>
            </div>

            <div className="project-modal__body">
              <div className="project-modal__image-gallery">
                <AnimatePresence mode="wait">
                  {displayImages.length > 0 ? (
                    <motion.img
                      key={displayImages[currentImageIndex]}
                      src={displayImages[currentImageIndex]}
                      className="project-modal__main-image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  ) : (
                    <div className="project-modal__no-image">
                      NO_SYSTEM_IMAGE
                    </div>
                  )}
                </AnimatePresence>
                {displayImages.length > 1 && (
                  <>
                    <button
                      className="project-modal__nav project-modal__nav--prev"
                      onClick={(e) => navigateImage(e, -1)}
                    >
                      ‹
                    </button>
                    <button
                      className="project-modal__nav project-modal__nav--next"
                      onClick={(e) => navigateImage(e, 1)}
                    >
                      ›
                    </button>
                    <div className="project-modal__counter">
                      {currentImageIndex + 1} / {displayImages.length}
                    </div>
                  </>
                )}
              </div>

              <div className="project-modal__info">
                <div className="project-modal__section">
                  <h3>ROLE_SUMMARY</h3>
                  <p className="project-modal__description">{d.role_summary}</p>
                </div>

                <div className="project-modal__section">
                  <h3>TECH_STACK</h3>
                  <div className="project-modal__tags">
                    {techStacks.map((tech, idx) => (
                      <span key={idx} className="project-modal__tag">
                        [{tech}]
                      </span>
                    ))}
                  </div>
                </div>

                {currentMyTasks && (
                  <div className="project-modal__section">
                    <h3>TASK_DETAILS</h3>
                    <div className="project-modal__task-text">
                      {currentMyTasks.split("\n").map((line, i) => (
                        <p key={i} style={{ marginBottom: "8px" }}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className="project-modal__section"
                  style={{
                    borderTop: "1px solid rgba(0, 243, 255, 0.2)",
                    marginTop: "20px",
                  }}
                >
                  <h3>SYSTEM_ACCESS</h3>
                  <div
                    style={{ display: "flex", gap: "20px", marginTop: "10px" }}
                  >
                    {d.github_url && (
                      <a
                        href={d.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-modal__link-btn github"
                        style={{
                          color: "#00f3ff",
                          textDecoration: "none",
                          border: "1px solid #00f3ff",
                          padding: "5px 15px",
                          fontSize: "0.8rem",
                        }}
                      >
                        GITHUB_REPO
                      </a>
                    )}
                    {d.reference_link && (
                      <a
                        href={d.reference_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-modal__link-btn live"
                        style={{
                          color: "#ff00ff",
                          textDecoration: "none",
                          border: "1px solid #ff00ff",
                          padding: "5px 15px",
                          fontSize: "0.8rem",
                        }}
                      >
                        Notion_navigate
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Portal>
  );
};

export default ProjectModal;
