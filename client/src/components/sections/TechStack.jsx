import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import "./TechStack.scss";

const TechStack = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");

  const techStackData = t("techStack", { returnObjects: true });
  const categories = useMemo(
    () =>
      Object.keys(techStackData).filter(
        (key) => key !== "title" && key !== "summary",
      ),
    [techStackData],
  );

  return (
    <section id="tech-stack" className="tech-stack scanline">
      <div className="tech-stack__container">
        <motion.h2
          className="tech-stack__title neon-text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {techStackData.title}
        </motion.h2>
        <p className="tech-stack__summary">{techStackData.summary}</p>

        {/* 필터 탭 추가 (정신없는 느낌을 줄여줍니다) */}
        <div
          className="tech-stack__tabs"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginBottom: "40px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setActiveTab("all")}
            style={{
              background: "transparent",
              border: `1px solid ${activeTab === "all" ? "#00f3ff" : "#333"}`,
              color: activeTab === "all" ? "#00f3ff" : "#666",
              padding: "5px 15px",
              cursor: "pointer",
              fontFamily: "Courier New",
            }}
          >
            [ ALL_UNITS ]
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                background: "transparent",
                border: `1px solid ${activeTab === cat ? "#00f3ff" : "#333"}`,
                color: activeTab === cat ? "#00f3ff" : "#666",
                padding: "5px 15px",
                cursor: "pointer",
                fontFamily: "Courier New",
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
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
