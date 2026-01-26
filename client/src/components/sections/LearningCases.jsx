import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSkillCases, deleteSkillCase } from '../../store/slices/skillCaseSlice.js';
import SkillCaseFormModal from '../admin/SkillCaseFormModal'; // Import the new form modal
import './LearningCases.scss';

const LearningCases = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { skillCases, loading, error } = useSelector((state) => state.skillCases);
  const { isAuthenticated } = useSelector((state) => state.auth); // Get auth status

  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // For form modal visibility
  const [skillCaseToEdit, setSkillCaseToEdit] = useState(null); // For passing skillCase data to form modal

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(fetchSkillCases());
    }
  }, [dispatch, loading]);

  const handleOpenAddModal = () => {
    setSkillCaseToEdit(null); // No skillCase to edit, it's a new one
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (skillCase) => {
    setSkillCaseToEdit(skillCase); // Pass skillCase data for editing
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSkillCaseToEdit(null); // Clear skillCase to edit
    dispatch(fetchSkillCases()); // Refresh skill cases after form submission
  };

  const handleDeleteSkillCase = (id) => {
    if (window.confirm('Are you sure you want to delete this skill case?')) {
      dispatch(deleteSkillCase(id))
        .unwrap()
        .then(() => alert('Skill Case deleted successfully!'))
        .catch((err) => alert(`Failed to delete skill case: ${err}`));
    }
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
        {isAuthenticated && (
          <div className="admin-actions">
            <button onClick={handleOpenAddModal} className="admin-button add-button">
              Add New Skill Case
            </button>
          </div>
        )}
        <p className="learning__subtitle">{t('learning.subtitle')}</p>
        <div className="learning__grid">
          {skillCases && skillCases.length > 0 ? (
            skillCases.map((caseItem) => {
              // const content = i18n.language === 'ko' ? caseItem.content_ko : caseItem.content_en; // Old content fields
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
                {caseItem.description} {/* Use the new description field */}
              </p>
              {caseItem.notionUrl && (
                <div className="learning__card-link">
                  <a href={caseItem.notionUrl} target="_blank" rel="noopener noreferrer">
                    {t('learning.viewNotion')}
                  </a>
                </div>
              )}
              {caseItem.reference_link && (
                <div className="learning__card-link">
                  <a href={caseItem.reference_link} target="_blank" rel="noopener noreferrer">
                    {t('learning.viewReference')}
                  </a>
                </div>
              )}

              {isAuthenticated && (
                <div className="admin-skill-actions">
                  <button onClick={(e) => { e.stopPropagation(); handleOpenEditModal(caseItem); }} className="admin-button edit-button">Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteSkillCase(caseItem.id); }} className="admin-button delete-button">Delete</button>
                </div>
              )}

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
      {isFormModalOpen && (
        <SkillCaseFormModal skillCase={skillCaseToEdit} onClose={handleCloseFormModal} />
      )}
    </section>
  );
};

export default LearningCases;
