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
      technologies: ['Node.js', 'Express', 'Sequelize', 'MySQL', 'Redis'],
    },
    {
      key: 'frontend',
      title: t('techStack.frontend.title'),
      description: t('techStack.frontend.description'),
      technologies: ['React', 'Redux Toolkit', 'SCSS', 'Vite'],
    },
    {
      key: 'database',
      title: t('techStack.database.title'),
      description: t('techStack.database.description'),
      technologies: ['MySQL', 'Redis'],
    },
  ];

  return (
    <section id="tech-stack" className="tech-stack">
      <div className="tech-stack__container">
        <h2 className="tech-stack__title">{t('techStack.title')}</h2>
        <div className="tech-stack__grid">
          {techCategories.map((category) => (
            <div key={category.key} className="tech-stack__card">
              <h3 className="tech-stack__card-title">{category.title}</h3>
              <p className="tech-stack__card-description">{category.description}</p>
              <div className="tech-stack__tags">
                {category.technologies.map((tech) => (
                  <span key={tech} className="tech-stack__tag">
                    {tech}
                  </span>
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
