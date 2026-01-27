import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSkillCases,
  deleteSkillCase,
} from "../../store/slices/skillCaseSlice.js";
import SkillCaseFormModal from "../admin/SkillCaseFormModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { ExternalLink, Terminal, Cpu } from "lucide-react";
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
  const { skillCases, loading } = useSelector((state) => state.skillCases);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [typedTexts, setTypedTexts] = useState({});
  const [glitchActive, setGlitchActive] = useState({}); // 각 카드별 글리치 상태
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [skillCaseToEdit, setSkillCaseToEdit] = useState(null);

  useEffect(() => {
    if (loading === "idle") dispatch(fetchSkillCases());
  }, [dispatch, loading]);

  // 지지직거리는 타이핑 로직
  const typeText = useCallback((id, text) => {
    let currentIndex = 0;
    const noiseChars = "!<>-_\\/[]{}—=+*^?#________";

    // 이전 타이머가 있다면 초기화 (중복 방지)
    setTypedTexts((prev) => ({ ...prev, [id]: "" }));

    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        // 현재 글자 뒤에 랜덤 노이즈 문자 하나를 붙여 지지직거리는 느낌 연출
        const randomChar =
          noiseChars[Math.floor(Math.random() * noiseChars.length)];
        const isLast = currentIndex === text.length;

        setTypedTexts((prev) => ({
          ...prev,
          [id]: text.substring(0, currentIndex) + (isLast ? "" : randomChar),
        }));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  }, []);

  // 슬라이드가 바뀔 때마다 지지직 효과 트리거
  const handleSlideChange = (swiper) => {
    const activeIndex = swiper.realIndex;
    const currentCase = skillCases[activeIndex];

    if (currentCase) {
      // 1. 카드 전체 지지직 효과 활성화 (0.4초)
      setGlitchActive({ [currentCase.id]: true });
      setTimeout(() => setGlitchActive({}), 400);

      // 2. 텍스트 타이핑 다시 시작
      const content =
        i18n.language === "ko"
          ? currentCase.content_ko
          : currentCase.content_en;
      typeText(currentCase.id, content);
    }
  };

  // 초기 로드 시 첫 번째 슬라이드 타이핑
  useEffect(() => {
    if (skillCases.length > 0 && Object.keys(typedTexts).length === 0) {
      const first = skillCases[0];
      const content =
        i18n.language === "ko" ? first.content_ko : first.content_en;
      typeText(first.id, content);
    }
  }, [skillCases, i18n.language, typeText, typedTexts]);

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
            initial={{ y: 30, opacity: 0, filter: "blur(10px)" }}
            whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8 }}
            className="learning__title neon-text"
            data-text={t("learning.title")}
          >
            {t("learning.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="learning__subtitle"
          >
            <Terminal size={14} style={{ marginRight: "8px" }} />{" "}
            {t("learning.subtitle")}
          </motion.p>

          {isAuthenticated && (
            <div className="admin-actions">
              <button
                onClick={handleOpenAddModal}
                className="admin-button add-btn-main"
              >
                <span className="btn-bracket">[</span>
                <span className="btn-text">+ NEW_DATA_ENTRY</span>
                <span className="btn-bracket">]</span>
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
            onSlideChange={handleSlideChange}
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 150,
              modifier: 1,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="learning__swiper"
          >
            {skillCases.map((caseItem) => {
              const status = caseItem.metadata?.status || "STABLE";
              const isGlitching = glitchActive[caseItem.id];

              return (
                <SwiperSlide key={caseItem.id} className="learning__slide">
                  <div
                    className={`learning__card learning__card--crt ${isGlitching ? "glitch-mode" : ""}`}
                  >
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
                        <span className="text-content">
                          {typedTexts[caseItem.id] || ""}
                        </span>
                        <span className="cursor">█</span>
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
                          <ExternalLink size={14} /> {t("learning.viewNotion")}
                        </a>
                      )}

                      {isAuthenticated && (
                        <div className="admin-skill-actions">
                          <button
                            onClick={() => handleOpenEditModal(caseItem)}
                            className="admin-edit-btn"
                          >
                            FIX
                          </button>
                          <button
                            onClick={() => handleDeleteSkillCase(caseItem.id)}
                            className="admin-del-btn"
                          >
                            DEL
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
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
