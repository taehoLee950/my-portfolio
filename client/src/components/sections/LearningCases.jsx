import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LearningCases.scss';

const LearningCases = () => {
  const { t } = useTranslation();
  const [typedTexts, setTypedTexts] = useState({});

  // 추후 API에서 가져올 데이터 구조
  const learningCases = [
    {
      id: 1,
      title: '개선 로직 1',
      description: '설명 내용',
      code: `// 동시성 제어 개선\nconst transaction = await sequelize.transaction();\ntry {\n  await Model.update(data, { transaction });\n  await transaction.commit();\n} catch (error) {\n  await transaction.rollback();\n}`,
      status: 'STABLE',
      statusColor: 'green',
    },
    {
      id: 2,
      title: '개선 로직 2',
      description: '설명 내용',
      code: `// 상태 관리 개선\nconst dispatch = useDispatch();\ndispatch(fetchDataAsync());`,
      status: 'STABLE',
      statusColor: 'green',
    },
    {
      id: 3,
      title: '개선 로직 3',
      description: '설명 내용',
      code: `// 에러 핸들링 개선\ntry {\n  // code\n} catch (error) {\n  Sentry.captureException(error);\n}`,
      status: 'CRITICAL',
      statusColor: 'red',
    },
  ];

  useEffect(() => {
    learningCases.forEach((caseItem) => {
      if (!typedTexts[caseItem.id]) {
        typeText(caseItem.id, caseItem.code);
      }
    });
  }, []);

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

  return (
    <section id="learning" className="learning">
      <div className="learning__container">
        <h2 className="learning__title neon-text">{t('learning.title')}</h2>
        <p className="learning__subtitle">{t('learning.subtitle')}</p>
        <div className="learning__grid">
          {learningCases.map((caseItem) => (
            <div key={caseItem.id} className="learning__card learning__card--crt">
              <div className="learning__card-header">
                <h3 className="learning__card-title">{caseItem.title}</h3>
                <div
                  className={`learning__card-status learning__card-status--${caseItem.statusColor}`}
                >
                  STATUS: {caseItem.status}
                </div>
              </div>
              <p className="learning__card-description">{caseItem.description}</p>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningCases;
