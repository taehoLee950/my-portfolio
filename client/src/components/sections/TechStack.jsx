import React from 'react';
import { useTranslation } from 'react-i18next';
import './TechStack.scss';

const TechStack = () => {
  const { t } = useTranslation();

  const techCategories = [
    {
      key: 'backend',
      title: t('techStack.backend.title'),
      description: t('techStack.backend.description'),
      technologies: [
        { name: 'Node.js', level: 85 },
        { name: 'Express', level: 80 },
        { name: 'Sequelize', level: 75 },
        { name: 'MySQL', level: 70 },
        { name: 'Redis', level: 60 },
      ],
    },
    {
      key: 'frontend',
      title: t('techStack.frontend.title'),
      description: t('techStack.frontend.description'),
      technologies: [
        { name: 'React', level: 90 },
        { name: 'Redux Toolkit', level: 85 },
        { name: 'SCSS', level: 80 },
        { name: 'Vite', level: 75 },
      ],
    },
    {
      key: 'database',
      title: t('techStack.database.title'),
      description: t('techStack.database.description'),
      technologies: [
        { name: 'MySQL', level: 75 },
        { name: 'Redis', level: 65 },
      ],
    },
  ];

  return (
    <section id="tech-stack" className="tech-stack scanline">
      <div className="tech-stack__container">
        <h2 className="tech-stack__title neon-text">{t('techStack.title')}</h2>
        <div className="tech-stack__grid">
          {techCategories.map((category) => (
            <div key={category.key} className="tech-stack__card">
              <div className="tech-stack__card-corner tech-stack__card-corner--top-right"></div>
              <div className="tech-stack__card-corner tech-stack__card-corner--bottom-left"></div>
              <h3 className="tech-stack__card-title">{category.title}</h3>
              <p className="tech-stack__card-description">{category.description}</p>
              <div className="tech-stack__technologies">
                {category.technologies.map((tech) => (
                  <div key={tech.name} className="tech-stack__tech-item">
                    <div className="tech-stack__tech-header">
                      <span className="tech-stack__tech-name">{tech.name}</span>
                      <span className="tech-stack__tech-level">{tech.level}%</span>
                    </div>
                    <div className="tech-stack__gauge">
                      <div
                        className="tech-stack__gauge-fill"
                        style={{ width: `${tech.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
