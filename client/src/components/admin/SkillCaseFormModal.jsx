import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSkillCase, updateSkillCase, clearError } from '../../store/slices/skillCaseSlice';
import { useTranslation } from 'react-i18next';
import Portal from '../common/Portal';
import './SkillCaseFormModal.scss';

const SkillCaseFormModal = ({ skillCase, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.skillCases);

  const isEditing = !!skillCase; // skillCase prop이 있으면 수정 모드
  const [formData, setFormData] = useState({
    category: skillCase?.category || 'Frontend', // Default category
    skill_name: skillCase?.skill_name || '',
    content_ko: skillCase?.content_ko || '', // Changed from description
    content_en: skillCase?.content_en || '', // Added content_en
    notion_link: skillCase?.notion_link || '', // Changed from notionUrl
    reference_link: skillCase?.reference_link || '',
    metadata: skillCase?.metadata ? JSON.stringify(skillCase.metadata, null, 2) : '',
  });

  // Categories defined in api/models/SkillCase.js (ENUM)
  const categories = ['Frontend', 'Backend', 'DevOps', 'JavaScript (ES6+)', 'CSS & UI/UX', 'PWA', 'API Documentation', 'Backend (Node.js/Express)', 'Backend (MySQL/Sequelize)', 'Utility & Export', 'Test-Driven Development'];


  useEffect(() => {
    if (error) {
      alert(`Error: ${error}`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      metadata: formData.metadata ? JSON.parse(formData.metadata) : null,
    };

    if (isEditing) {
      // Update SkillCase
      dispatch(updateSkillCase({ id: skillCase.id, data: dataToSend }))
        .unwrap()
        .then(() => {
          alert('Skill Case updated successfully!');
          onClose();
        })
        .catch((err) => console.error('Failed to update skill case:', err));
    } else {
      // Create SkillCase
      dispatch(createSkillCase(dataToSend))
        .unwrap()
        .then(() => {
          alert('Skill Case created successfully!');
          onClose();
        })
        .catch((err) => console.error('Failed to create skill case:', err));
    }
  };

  return (
    <Portal>
      <div className="skill-case-form-modal__overlay">
        <div className="skill-case-form-modal__content">
        <button className="skill-case-form-modal__close" onClick={onClose}>
          ×
        </button>
        <h2>{isEditing ? 'Edit Skill Case' : 'Add New Skill Case'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} required>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="skill_name">Skill Name</label>
            <input type="text" id="skill_name" name="skill_name" value={formData.skill_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="content_ko">Content (Korean)</label>
            <textarea id="content_ko" name="content_ko" value={formData.content_ko} onChange={handleChange} required></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="content_en">Content (English)</label>
            <textarea id="content_en" name="content_en" value={formData.content_en} onChange={handleChange} required></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="notion_link">Notion Link</label>
            <input type="url" id="notion_link" name="notion_link" value={formData.notion_link} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="reference_link">Reference Link</label>
            <input type="url" id="reference_link" name="reference_link" value={formData.reference_link} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="metadata">Metadata (JSON)</label>
            <textarea id="metadata" name="metadata" value={formData.metadata} onChange={handleChange} rows="5"></textarea>
          </div>
          
          <button type="submit" disabled={loading === 'pending'}>
            {loading === 'pending' ? 'Processing...' : (isEditing ? 'Update Skill Case' : 'Create Skill Case')}
          </button>
        </form>
        </div>
      </div>
    </Portal>
  );
};

export default SkillCaseFormModal;