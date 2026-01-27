import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Portal from "./Portal";
import "./ProjectModal.scss";

const assetImages = import.meta.glob(
  "../../assets/images/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

const ProjectModal = ({ project, onClose }) => {
  const { i18n } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
    // 모달 오픈 시 스크롤 방지
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, [project]);

  const d = useMemo(() => {
    if (!project) return null;
    return project.data && typeof project.data === "object"
      ? project.data
      : project;
  }, [project]);

  const techStacks = useMemo(() => {
    if (!d?.tech_stack) return [];
    if (Array.isArray(d.tech_stack)) return d.tech_stack;
    if (typeof d.tech_stack === "string") {
      try {
        const parsed = JSON.parse(d.tech_stack);
        return Array.isArray(parsed) ? parsed : [d.tech_stack];
      } catch (e) {
        return d.tech_stack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }
    return [];
  }, [d]);

  const displayImages = useMemo(() => {
    if (!d) return [];
    const images = [];
    if (d.images && Array.isArray(d.images)) {
      d.images.forEach((img) => img.image_url && images.push(img.image_url));
    }
    if (images.length === 0 && d.thumbnail) images.push(d.thumbnail);
    return images;
  }, [d]);

  if (!d) return null;

  const currentTitle =
    i18n.language === "ko" ? d.title_ko || d.title : d.title_en || d.title;
  const currentMyTasks = i18n.language === "ko" ? d.my_tasks_ko : d.my_tasks_en;

  const getAssetUrl = (fileName) => {
    if (!fileName) return "";
    const fullPath = Object.keys(assetImages).find((key) =>
      key.endsWith(`/${fileName}`),
    );
    return fullPath ? assetImages[fullPath].default : fileName;
  };

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
                      src={getAssetUrl(displayImages[currentImageIndex])}
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
                  </>
                )}
              </div>

              <div className="project-modal__info">
                <p className="project-modal__description">{d.role_summary}</p>
                <div className="project-modal__tags">
                  {techStacks.map((tech, idx) => (
                    <span key={idx} className="project-modal__tag">
                      [{tech}]
                    </span>
                  ))}
                </div>

                {currentMyTasks && (
                  <div className="project-modal__section">
                    <h3>TASK_DETAILS</h3>
                    <p className="project-modal__task-text">{currentMyTasks}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Portal>
  );
};

export default ProjectModal;
