import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { inquiryService } from '../../api/services/inquiryService';
import './Contact.scss';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({ type: 'error', message: '모든 필드를 입력해주세요.' });
      return;
    }

    if (!validateEmail(formData.email)) {
      setSubmitStatus({ type: 'error', message: '올바른 이메일 형식을 입력해주세요.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await inquiryService.createInquiry(formData);
      setSubmitStatus({ type: 'success', message: t('contact.success') });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: t('contact.error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="contact__container">
        <h2 className="contact__title">{t('contact.title')}</h2>
        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__field">
            <label htmlFor="name" className="contact__label">
              {t('contact.name')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="contact__input"
              required
            />
          </div>
          <div className="contact__field">
            <label htmlFor="email" className="contact__label">
              {t('contact.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="contact__input"
              required
            />
          </div>
          <div className="contact__field">
            <label htmlFor="message" className="contact__label">
              {t('contact.message')}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="contact__textarea"
              rows="6"
              required
            />
          </div>
          {submitStatus && (
            <div
              className={`contact__status contact__status--${submitStatus.type}`}
            >
              {submitStatus.message}
            </div>
          )}
          <button
            type="submit"
            className="contact__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('contact.sending') : t('contact.send')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
