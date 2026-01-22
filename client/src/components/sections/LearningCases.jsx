import React from 'react';
import { useTranslation } from 'react-i18next';
import './LearningCases.scss';

const LearningCases = () => {
  const { t } = useTranslation();

  // 추후 API에서 가져올 데이터 구조
  const learningCases = [
    {
      id: 1,
      title: '개선 로직 1',
      description: '설명 내용',
      code: '// 코드 예시',
    },
    {
      id: 2,
      title: '개선 로직 2',
      description: '설명 내용',
      code: '// 코드 예시',
    },
    {
      id: 3,
      title: '개선 로직 3',
      description: '설명 내용',
      code: '// 코드 예시',
    },
  ];

  return (
    <section id="learning" className="learning">
      <div className="learning__container">
        <h2 className="learning__title">{t('learning.title')}</h2>
        <p className="learning__subtitle">{t('learning.subtitle')}</p>
        <div className="learning__grid">
          {learningCases.map((caseItem) => (
            <div key={caseItem.id} className="learning__card">
              <h3 className="learning__card-title">{caseItem.title}</h3>
              <p className="learning__card-description">{caseItem.description}</p>
              <div className="learning__card-code">
                <pre>
                  <code>{caseItem.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningCases;
