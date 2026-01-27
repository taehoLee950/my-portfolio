import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Portal from "./Portal";
import "./ProjectModal.scss";

// [제거] 로컬 자산 glob 설정은 더 이상 사용하지 않습니다.
// const assetImages = import.meta.glob(...)

const ProjectModal = ({ project, onClose }) => {
  const { i18n } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // API 서버 주소 설정
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    setCurrentImageIndex(0);
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, [project]);

  // 데이터 안전 추출
  const d = useMemo(() => {
    if (!project) return null;
    return project.data && typeof project.data === "object"
      ? project.data
      : project;
  }, [project]);

  // 기술 스택 파싱 로직
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

  /**
   * [수정] 갤러리에 표시할 이미지 URL 배열 생성
   * project_images 테이블에서 온 images 배열을 활용합니다.
   */
  const displayImages = useMemo(() => {
    if (!d) return [];

    const imageUrls = [];

    // 1. project_images 테이블의 데이터를 우선적으로 담음
    if (d.images && Array.isArray(d.images)) {
      d.images.forEach((img) => {
        if (img.image_url) {
          // 서버 주소가 포함되지 않은 상대 경로일 경우 결합
          const fullPath = img.image_url.startsWith("http")
            ? img.image_url
            : `${API_BASE_URL}${img.image_url}`;
          imageUrls.push(fullPath);
        }
      });
    }

    // 2. 만약 images 배열이 비어있고 레거시 thumbnail 필드가 있다면 추가
    if (imageUrls.length === 0 && d.thumbnail) {
      const thumbPath = d.thumbnail.startsWith("http")
        ? d.thumbnail
        : `${API_BASE_URL}${d.thumbnail}`;
      imageUrls.push(thumbPath);
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
                      src={displayImages[currentImageIndex]} // [수정] 직접 URL 할당
                      className="project-modal__main-image"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
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
                    {/* 현재 슬라이드 위치 표시 */}
                    <div className="project-modal__counter">
                      {currentImageIndex + 1} / {displayImages.length}
                    </div>
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
