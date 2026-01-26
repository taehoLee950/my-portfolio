import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject, updateProject, clearError, addProjectImage } from '../../store/slices/projectSlice';
import { useTranslation } from 'react-i18next';
import './ProjectFormModal.scss';

const ProjectFormModal = ({ project, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.projects);

  const isEditing = !!project; // project prop이 있으면 수정 모드
  const [formData, setFormData] = useState({
    slug: project?.slug || '',
    title_ko: project?.title_ko || '',
    title_en: project?.title_en || '',
    period: project?.period || '',
    role_summary: project?.role_summary || '',
    my_tasks_ko: project?.my_tasks_ko || '',
    my_tasks_en: project?.my_tasks_en || '',
    tech_stack: project?.tech_stack?.join(', ') || '', // 배열을 콤마 구분 문자열로
    github_url: project?.github_url || '',
    reference_link: project?.reference_link || '',
    metadata: project?.metadata ? JSON.stringify(project.metadata, null, 2) : '',
    version: project?.version || 0, // Optimistic locking
  });
  const [coverImage, setCoverImage] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);


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

  const handleImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      tech_stack: formData.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
      metadata: formData.metadata ? JSON.parse(formData.metadata) : null,
    };

    if (isEditing) {
      // Update Project
      dispatch(updateProject({ id: project.id, data: dataToSend, version: formData.version }))
        .unwrap()
        .then(() => {
          alert('Project updated successfully!');
          onClose();
        })
        .catch((err) => console.error('Failed to update project:', err));
    } else {
      // Create Project
      dispatch(createProject(dataToSend))
        .unwrap()
        .then(newProject => {
          alert('Project created successfully!');
          // If there's a cover image, upload it
          if (coverImage) {
            setImageUploadLoading(true);
            dispatch(addProjectImage({ projectId: newProject.id, imageFile: coverImage }))
              .unwrap()
              .then(() => alert('Cover image uploaded successfully!'))
              .catch(imgErr => {
                setImageUploadError(imgErr);
                alert(`Image upload failed: ${imgErr}`);
              })
              .finally(() => setImageUploadLoading(false));
          }
          onClose();
        })
        .catch((err) => console.error('Failed to create project:', err));
    }
  };

  return (
    <div className="project-form-modal__overlay">
      <div className="project-form-modal__content">
        <button className="project-form-modal__close" onClick={onClose}>
          ×
        </button>
        <h2>{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title_ko">Title (Korean)</label>
            <input type="text" id="title_ko" name="title_ko" value={formData.title_ko} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="title_en">Title (English)</label>
            <input type="text" id="title_en" name="title_en" value={formData.title_en} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="period">Period</label>
            <input type="text" id="period" name="period" value={formData.period} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="role_summary">Role Summary</label>
            <input type="text" id="role_summary" name="role_summary" value={formData.role_summary} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="my_tasks_ko">My Tasks (Korean)</label>
            <textarea id="my_tasks_ko" name="my_tasks_ko" value={formData.my_tasks_ko} onChange={handleChange} required></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="my_tasks_en">My Tasks (English)</label>
            <textarea id="my_tasks_en" name="my_tasks_en" value={formData.my_tasks_en} onChange={handleChange} required></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="tech_stack">Tech Stack (comma-separated)</label>
            <input type="text" id="tech_stack" name="tech_stack" value={formData.tech_stack} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="github_url">GitHub URL</label>
            <input type="url" id="github_url" name="github_url" value={formData.github_url} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="reference_link">Reference Link</label>
            <input type="url" id="reference_link" name="reference_link" value={formData.reference_link} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="metadata">Metadata (JSON)</label>
            <textarea id="metadata" name="metadata" value={formData.metadata} onChange={handleChange} rows="5"></textarea>
          </div>
          {!isEditing && ( // Only show image upload for new projects initially
            <div className="form-group">
              <label htmlFor="coverImage">Cover Image</label>
              <input type="file" id="coverImage" name="coverImage" accept="image/*" onChange={handleImageChange} />
            </div>
          )}
          {imageUploadLoading && <p>Uploading image...</p>}
          {imageUploadError && <p className="error-message">{imageUploadError}</p>}
          
          <button type="submit" disabled={loading === 'pending' || imageUploadLoading}>
            {loading === 'pending' || imageUploadLoading ? 'Processing...' : (isEditing ? 'Update Project' : 'Create Project')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;