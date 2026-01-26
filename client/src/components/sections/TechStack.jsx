import React from 'react';
import { useTranslation } from 'react-i18next';
import './TechStack.scss';

const TechStack = () => {
  const { t } = useTranslation();

  // Dynamically get tech categories from i18n data
  const techStackData = t('techStack', { returnObjects: true });
  const categories = Object.keys(techStackData).filter(key => key !== 'title' && key !== 'summary');

  return (
    <section id="tech-stack" className="tech-stack scanline">
      <div className="tech-stack__container">
        <h2 className="tech-stack__title neon-text">{techStackData.title}</h2>
        <p className="tech-stack__summary">{techStackData.summary}</p> {/* Display the summary */}
        <div className="tech-stack__grid">
          {categories.map((categoryKey) => {
            const category = techStackData[categoryKey];
            const skills = category.skills ? category.skills.split(',').map(s => s.trim()) : [];

            return (
              <div key={categoryKey} className="tech-stack__card">
                <div className="tech-stack__card-corner tech-stack__card-corner--top-right"></div>
                <div className="tech-stack__card-corner tech-stack__card-corner--bottom-left"></div>
                <h3 className="tech-stack__card-title">{category.title}</h3>
                <p className="tech-stack__card-description">{category.description}</p>
                <div className="tech-stack__skills-list">
                  {skills.map((skill) => (
                    <span key={skill} className="tech-stack__skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStack;

