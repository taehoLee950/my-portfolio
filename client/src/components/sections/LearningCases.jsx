import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSkillCases } from '../../store/slices/skillCaseSlice.js';
import './LearningCases.scss';

const LearningCases = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { skillCases, loading, error } = useSelector((state) => state.skillCases);
  const [typedTexts, setTypedTexts] = useState({});

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(fetchSkillCases());
    }
  }, [dispatch, loading]);

  useEffect(() => {
    skillCases.forEach((caseItem) => {
      if (!typedTexts[caseItem.id]) {
        const content = i18n.language === 'ko' ? caseItem.content_ko : caseItem.content_en;
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
    }, 30);
  };

  // 로딩 중 UI
  if (loading === 'pending') {
    return (
      <section id="learning" className="learning">
        <div className="learning__container">
          <h2 className="learning__title neon-text">{t('learning.title')}</h2>
          <div className="learning__loading">
            <span className="learning__loading-text">LOADING SKILL CASES...</span>
          </div>
        </div>
      </section>
    );
  }

  // 에러 발생 UI
  if (error) {
    return (
      <section id="learning" className="learning">
        <div className="learning__container">
          <h2 className="learning__title neon-text">{t('learning.title')}</h2>
          <div className="learning__error">
            <span className="learning__error-text">ERROR: {error}</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="learning" className="learning">
      <div className="learning__container">
        <h2 className="learning__title neon-text">{t('learning.title')}</h2>
        <p className="learning__subtitle">{t('learning.subtitle')}</p>
        <div className="learning__grid">
          {skillCases && skillCases.length > 0 ? (
            skillCases.map((caseItem) => {
              const content = i18n.language === 'ko' ? caseItem.content_ko : caseItem.content_en;
              const status = caseItem.metadata?.status || 'STABLE';
              const statusColor = status === 'CRITICAL' ? 'red' : 'green';

              return (
            <div key={caseItem.id} className="learning__card learning__card--crt">
              <div className="learning__card-header">
                <h3 className="learning__card-title">{caseItem.skill_name}</h3>
                <div
                  className={`learning__card-status learning__card-status--${statusColor}`}
                >
                  STATUS: {status}
                </div>
              </div>
              <p className="learning__card-description">
                {i18n.language === 'ko' ? caseItem.content_ko : caseItem.content_en}
              </p>
              <div className="learning__card-terminal">
                <div className="learning__card-terminal-header">
                  <span className="learning__card-terminal-title">TERMINAL</span>
                  <div className="learning__card-terminal-controls">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="learning__card-code">
                  <pre>
                    <code>{typedTexts[caseItem.id] || ''}</code>
                    <span className="learning__card-cursor">_</span>
                  </pre>
                </div>
              </div>
            </div>
              );
            })
          ) : (
            <div className="learning__empty">
              <span className="learning__empty-text">NO SKILL CASES FOUND</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LearningCases;
