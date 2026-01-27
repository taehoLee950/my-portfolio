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
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
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
    // 한국어 데이터 적용
    if (d.id === 1) {
      for (let i = 1; i <= 5; i++) images.push(`daeguWeather${i}.png`);
    } else if (d.id === 2) {
      for (let i = 1; i <= 4; i++) images.push(`icemachine${i}.png`);
    }
    if (d.images && Array.isArray(d.images)) {
      d.images.forEach((img) => {
        if (img.image_url) images.push(img.image_url);
      });
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
    if (fullPath) return assetImages[fullPath].default;
    return fileName.startsWith("http") || fileName.startsWith("/assets")
      ? fileName
      : `${import.meta.env.VITE_API_URL || ""}${fileName}`;
  };

  const navigateImage = (direction) => {
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
                      alt="Project View"
                      className="project-modal__main-image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
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
                      onClick={() => navigateImage(-1)}
                    >
                      ‹
                    </button>
                    <button
                      className="project-modal__nav project-modal__nav--next"
                      onClick={() => navigateImage(1)}
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
                    <span
                      key={`modal-tech-${idx}`}
                      className="project-modal__tag"
                    >
                      [{tech}]
                    </span>
                  ))}
                </div>

                {currentMyTasks && (
                  <div
                    className={`project-modal__section ${isFocused ? "project-modal__section--focused" : ""}`}
                    onMouseEnter={() => setIsFocused(true)}
                    onMouseLeave={() => setIsFocused(false)}
                  >
                    <h3>TASK_DETAILS</h3>
                    <div className="project-modal__task-wrapper">
                      <p className="project-modal__task-text">
                        {currentMyTasks}
                      </p>
                      <div className="project-modal__input-border"></div>
                    </div>
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
