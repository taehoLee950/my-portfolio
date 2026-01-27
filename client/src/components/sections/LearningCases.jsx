import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSkillCases,
  deleteSkillCase,
} from "../../store/slices/skillCaseSlice.js";
import SkillCaseFormModal from "../admin/SkillCaseFormModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { ExternalLink, Terminal, ShieldAlert, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./LearningCases.scss";

const LearningCases = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { skillCases, loading, error } = useSelector(
    (state) => state.skillCases,
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [typedTexts, setTypedTexts] = useState({});
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [skillCaseToEdit, setSkillCaseToEdit] = useState(null);

  useEffect(() => {
    if (loading === "idle") dispatch(fetchSkillCases());
  }, [dispatch, loading]);

  useEffect(() => {
    skillCases.forEach((caseItem) => {
      const content =
        i18n.language === "ko" ? caseItem.content_ko : caseItem.content_en;
      if (!typedTexts[caseItem.id] || typedTexts[caseItem.id] !== content) {
        typeText(caseItem.id, content);
      }
    });
  }, [skillCases, i18n.language]);

  const typeText = (id, text) => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setTypedTexts((prev) => ({
          ...prev,
          [id]: text.substring(0, currentIndex),
        }));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  };

  const handleOpenAddModal = () => {
    setIsFormModalOpen(true);
    setSkillCaseToEdit(null);
  };
  const handleOpenEditModal = (item) => {
    setIsFormModalOpen(true);
    setSkillCaseToEdit(item);
  };
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    dispatch(fetchSkillCases());
  };

  const handleDeleteSkillCase = (id) => {
    if (window.confirm("PROTOCOL: DELETE_CASE_CONFIRMATION?")) {
      dispatch(deleteSkillCase(id))
        .unwrap()
        .catch((err) => alert(`SYSTEM_ERROR: ${err}`));
    }
  };

  if (loading === "pending")
    return <div className="learning__loading">ACCESSING_DATABASE...</div>;

  return (
    <section id="learning" className="learning">
      <div className="learning__scanline" />
      <div className="learning__container">
        <header className="learning__header">
          <motion.h2
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="learning__title neon-text"
          >
            {t("learning.title")}
          </motion.h2>
          <p className="learning__subtitle">
            <Terminal size={14} inline /> {t("learning.subtitle")}
          </p>

          {isAuthenticated && (
            <div className="admin-actions">
              <button
                onClick={handleOpenAddModal}
                className="admin-button add-button"
              >
                + NEW_DATA_ENTRY
              </button>
            </div>
          )}
        </header>

        <div className="learning__slider-wrapper">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="learning__swiper"
          >
            {skillCases && skillCases.length > 0 ? (
              skillCases.map((caseItem) => {
                const status = caseItem.metadata?.status || "STABLE";
                return (
                  <SwiperSlide key={caseItem.id} className="learning__slide">
                    <div className="learning__card learning__card--crt">
                      <div className="learning__card-header">
                        <div className="title-group">
                          <Cpu size={16} className="icon-pulse" />
                          <h3 className="learning__card-title">
                            {caseItem.skill_name}
                          </h3>
                        </div>
                        <div
                          className={`learning__card-status status-${status.toLowerCase()}`}
                        >
                          {status}
                        </div>
                      </div>

                      <div className="learning__card-body">
                        <p className="learning__card-description">
                          <span className="prompt">{">"}</span>{" "}
                          {typedTexts[caseItem.id] || ""}
                          <span className="cursor">_</span>
                        </p>
                      </div>

                      <div className="learning__card-footer">
                        {caseItem.notion_link && (
                          <a
                            href={caseItem.notion_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="notion-btn"
                          >
                            <span className="btn-glitch"></span>
                            <ExternalLink size={14} />{" "}
                            {t("learning.viewNotion")}
                          </a>
                        )}

                        {isAuthenticated && (
                          <div className="admin-skill-actions">
                            <button
                              onClick={() => handleOpenEditModal(caseItem)}
                              className="edit-btn"
                            >
                              FIX
                            </button>
                            <button
                              onClick={() => handleDeleteSkillCase(caseItem.id)}
                              className="del-btn"
                            >
                              DEL
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })
            ) : (
              <div className="learning__empty">DATABASE_EMPTY</div>
            )}
          </Swiper>
        </div>
      </div>
      {isFormModalOpen && (
        <SkillCaseFormModal
          skillCase={skillCaseToEdit}
          onClose={handleCloseFormModal}
        />
      )}
    </section>
  );
};

export default LearningCases;
