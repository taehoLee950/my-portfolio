import React, { useState, useMemo } from "react";
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

  // 데이터 가드: project.data 형태든 일반 객체 형태든 대응
  const d = useMemo(() => {
    if (!project) return null;
    // Prioritize project.data if it exists and is an object, otherwise use project itself.
    // This directly addresses the "Data Depth Mismatch" by ensuring the correct data path.
    return (project.data && typeof project.data === 'object') ? project.data : project;
  }, [project]);

  // 이미지 리스트 생성
  const displayImages = useMemo(() => {
    if (!d) return [];
    const images = [];

    // 1. 로컬 이미지 (ID 1, 2 대응)
    if (d.id === 1) {
      for (let i = 1; i <= 5; i++) images.push(`daeguWeather${i}.png`);
    } else if (d.id === 2) {
      for (let i = 1; i <= 4; i++) images.push(`icemachine${i}.png`);
    }

    // 2. 서버 DB 이미지 추가
    if (d.images && Array.isArray(d.images)) {
      d.images.forEach((img) => {
        if (img.image_url) images.push(img.image_url);
      });
    }

    if (images.length === 0 && d.thumbnail) images.push(d.thumbnail);
    return images;
  }, [d]);

  if (!d) return null;

  const currentTitle = i18n.language === "ko" ? d.title_ko : d.title_en;
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
      {/* 핵심 수정: 
        SCSS에서 .project-modal { &__overlay { ... } } 구조이므로 
        최상위 div에 project-modal 클래스를 명시해야 스타일이 적용됩니다.
      */}
      <div className="project-modal">
        <motion.div
          className="project-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="project-modal__content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="project-modal__close" onClick={onClose}>
              ×
            </button>

            <div className="project-modal__header">
              <h2 className="project-modal__title">{currentTitle}</h2>
              <p className="project-modal__period">LOG_DATE: {d.period}</p>
            </div>

            <div className="project-modal__body">
              <div className="project-modal__image-gallery">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={getAssetUrl(displayImages[currentImageIndex])}
                    alt="Project View"
                    className="project-modal__main-image"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  />
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
                  {d.tech_stack?.map((tech) => (
                    <span key={tech} className="project-modal__tag">
                      [{tech}]
                    </span>
                  ))}
                </div>

                {currentMyTasks && (
                  <div className="project-modal__section">
                    <h3>TASK_DETAILS</h3>
                    <p>{currentMyTasks}</p>
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
