import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  updateProject,
  clearError,
} from "../../store/slices/projectSlice";
import { useTranslation } from "react-i18next";
import Portal from "../common/Portal";
import "./ProjectFormModal.scss";

const ProjectFormModal = ({ project, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.projects);

  const isEditing = !!project;
  const [formData, setFormData] = useState({
    slug: project?.slug || "",
    title_ko: project?.title_ko || "",
    title_en: project?.title_en || "",
    period: project?.period || "",
    role_summary: project?.role_summary || "",
    my_tasks_ko: project?.my_tasks_ko || "",
    my_tasks_en: project?.my_tasks_en || "",
    tech_stack: project?.tech_stack
      ? Array.isArray(project.tech_stack)
        ? project.tech_stack.join(", ")
        : project.tech_stack
      : "",
    github_url: project?.github_url || "",
    reference_link: project?.reference_link || "",
    metadata: project?.metadata
      ? JSON.stringify(project.metadata, null, 2)
      : "",
    version: project?.version || 0,
  });
  const [coverImage, setCoverImage] = useState(null);

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
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();

    dataToSend.append("title_ko", formData.title_ko);
    dataToSend.append("title_en", formData.title_en);
    dataToSend.append("slug", formData.slug || `project-${Date.now()}`);
    dataToSend.append("period", formData.period);
    dataToSend.append("role_summary", formData.role_summary);
    dataToSend.append("my_tasks_ko", formData.my_tasks_ko);
    dataToSend.append("my_tasks_en", formData.my_tasks_en);
    dataToSend.append("github_url", formData.github_url);
    dataToSend.append("reference_link", formData.reference_link);
    dataToSend.append("version", formData.version);

    const techArray = formData.tech_stack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    dataToSend.append("tech_stack", JSON.stringify(techArray));

    if (formData.metadata) {
      try {
        dataToSend.append(
          "metadata",
          JSON.stringify(JSON.parse(formData.metadata)),
        );
      } catch (e) {
        console.error("Invalid JSON in metadata");
      }
    }

    if (coverImage) {
      dataToSend.append("image", coverImage);
    }

    if (isEditing) {
      dispatch(
        updateProject({
          id: project.id,
          data: dataToSend,
          version: formData.version,
        }),
      )
        .unwrap()
        .then(() => {
          alert("Project updated successfully!");
          onClose();
        })
        .catch((err) => console.error("Failed to update project:", err));
    } else {
      dispatch(createProject(dataToSend))
        .unwrap()
        .then(() => {
          alert("Project created successfully!");
          onClose();
        })
        .catch((err) => console.error("Failed to create project:", err));
    }
  };

  return (
    <Portal>
      <div className="project-form-modal__overlay">
        <div className="project-form-modal__content cyber-border">
          <button className="project-form-modal__close" onClick={onClose}>
            [×]
          </button>
          <h2 className="cyber-glitch-text">
            {isEditing ? "EDIT_EXISTING_DATA" : "ADD_NEW_SYSTEM_PROJECT"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="slug">
                SLUG <span className="required">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g. portfolio-system-2026"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title_ko">
                  TITLE_KO <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title_ko"
                  name="title_ko"
                  value={formData.title_ko}
                  onChange={handleChange}
                  placeholder="예: 포트폴리오 시스템"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="title_en">
                  TITLE_EN <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title_en"
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleChange}
                  placeholder="e.g. Portfolio System"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="period">
                PERIOD <span className="required">*</span>
              </label>
              <input
                type="text"
                id="period"
                name="period"
                value={formData.period}
                onChange={handleChange}
                placeholder="e.g. 2025.12 - 2026.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role_summary">
                ROLE_SUMMARY <span className="required">*</span>
              </label>
              <input
                type="text"
                id="role_summary"
                name="role_summary"
                value={formData.role_summary}
                onChange={handleChange}
                placeholder="e.g. Lead Developer / Full-stack"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="my_tasks_ko">
                TASKS_KO <span className="required">*</span>
              </label>
              <textarea
                id="my_tasks_ko"
                name="my_tasks_ko"
                value={formData.my_tasks_ko}
                onChange={handleChange}
                placeholder="• React를 이용한 프론트엔드 구축&#10;• Node.js API 설계"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="my_tasks_en">
                TASKS_EN <span className="required">*</span>
              </label>
              <textarea
                id="my_tasks_en"
                name="my_tasks_en"
                value={formData.my_tasks_en}
                onChange={handleChange}
                placeholder="• Built frontend using React&#10;• Designed Node.js APIs"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="tech_stack">
                TECH_STACK <span className="required">*</span>
              </label>
              <input
                type="text"
                id="tech_stack"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                placeholder="React, Node.js, MySQL, Docker"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="github_url">
                  GITHUB_URL <span className="required">*</span>
                </label>
                <input
                  type="url"
                  id="github_url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reference_link">
                  REF_LINK <span className="required">*</span>
                </label>
                <input
                  type="url"
                  id="reference_link"
                  name="reference_link"
                  value={formData.reference_link}
                  onChange={handleChange}
                  placeholder="https://demo.com/..."
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="metadata">METADATA (JSON)</label>
              <textarea
                id="metadata"
                name="metadata"
                value={formData.metadata}
                onChange={handleChange}
                rows="3"
                placeholder='{ "status": "stable", "priority": 1 }'
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="coverImage">SYSTEM_IMAGE</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              {isEditing && (
                <p className="help-text">UPLOAD NEW FILE ONLY TO OVERWRITE</p>
              )}
            </div>

            <button
              type="submit"
              className="cyber-button"
              disabled={loading === "pending"}
            >
              <span className="button__text">
                {loading === "pending"
                  ? "UPLOADING..."
                  : isEditing
                    ? "UPDATE_DATA"
                    : "INITIALIZE_PROJECT"}
              </span>
              <span className="button__glitch"></span>
            </button>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default ProjectFormModal;
