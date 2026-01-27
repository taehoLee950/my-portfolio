import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import "./TechStack.scss";

const TechStack = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const { isAuthenticated } = useSelector((state) => state.auth);

  const techStackData = t("techStack", { returnObjects: true });
  const categories = useMemo(
    () =>
      Object.keys(techStackData).filter(
        (key) => key !== "title" && key !== "summary",
      ),
    [techStackData],
  );

  // 대제목 및 요약글 스크롤 애니메이션
  const headerVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section id="tech-stack" className="tech-stack scanline">
      <div className="tech-stack__container">
        <header className="tech-stack__header">
          {/* 스크롤 감지 애니메이션 적용 */}
          <motion.div
            className="title-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            variants={headerVariants}
          >
            <h2
              className="tech-stack__title neon-text"
              data-text={techStackData.title}
            >
              {techStackData.title}
            </h2>
            <p className="tech-stack__summary">{techStackData.summary}</p>

            {/* 관리자 버튼: 헤더 내부 중앙 배치 */}
            {isAuthenticated && (
              <div className="admin-actions">
                <button className="admin-button add-button">
                  [+] NEW_DATA_ENTRY
                </button>
              </div>
            )}
          </motion.div>
        </header>

        {/* 탭 메뉴 */}
        <div className="tech-stack__tabs">
          <button
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "active" : ""}
          >
            [ ALL_UNITS ]
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={activeTab === cat ? "active" : ""}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 기술 카드 그리드 */}
        <motion.div layout className="tech-stack__grid">
          <AnimatePresence mode="popLayout">
            {categories
              .filter((cat) => activeTab === "all" || activeTab === cat)
              .map((categoryKey) => {
                const category = techStackData[categoryKey];
                const skills = category.skills
                  ? category.skills.split(",").map((s) => s.trim())
                  : [];

                return (
                  <motion.div
                    key={categoryKey}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="tech-stack__card"
                  >
                    <div className="tech-stack__card-corner tech-stack__card-corner--top-right"></div>
                    <div className="tech-stack__card-corner tech-stack__card-corner--bottom-left"></div>

                    <h3 className="tech-stack__card-title">{category.title}</h3>
                    <p className="tech-stack__card-description">
                      {category.description}
                    </p>
                    <div className="tech-stack__skills-list">
                      {skills.map((skill) => (
                        <span key={skill} className="tech-stack__skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
