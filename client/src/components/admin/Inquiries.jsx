import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInquiries, updateInquiryStatus, clearError } from '../../store/slices/inquirySlice';
import { useTranslation } from 'react-i18next';
import './Inquiries.scss';

const Inquiries = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { inquiries, loading, error } = useSelector((state) => state.inquiries);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unseen', 'seen', 'replied'

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchInquiries());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      alert(`Error: ${error}`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleStatusChange = (inquiryId, newStatus) => {
    if (window.confirm(`Change status of inquiry ${inquiryId} to ${newStatus}?`)) {
      dispatch(updateInquiryStatus({ id: inquiryId, status: newStatus }))
        .unwrap()
        .then(() => alert('Inquiry status updated successfully!'))
        .catch((err) => alert(`Failed to update status: ${err}`));
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (filterStatus === 'all') return true;
    return inquiry.status === filterStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="admin-inquiries-container">
        <h2 className="admin-inquiries__title neon-text">Access Denied</h2>
        <p className="admin-inquiries__error-text">Please log in to view this page.</p>
      </div>
    );
  }

  if (loading === 'pending') {
    return (
      <div className="admin-inquiries-container">
        <h2 className="admin-inquiries__title neon-text">Loading Inquiries...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-inquiries-container">
        <h2 className="admin-inquiries__title neon-text">Error Loading Inquiries</h2>
        <p className="admin-inquiries__error-text">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="admin-inquiries-container">
      <h2 className="admin-inquiries__title neon-text">{t('inquiries.adminTitle')}</h2>
      
      <div className="admin-inquiries__filters">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select id="statusFilter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="unseen">Unseen</option>
          <option value="seen">Seen</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <div className="admin-inquiries__list">
        {filteredInquiries && filteredInquiries.length > 0 ? (
          filteredInquiries.map((inquiry) => (
            <div key={inquiry.id} className={`admin-inquiry-card status-${inquiry.status}`}>
              <div className="card-header">
                <h3>Inquiry from: {inquiry.email}</h3>
                <span className={`inquiry-status ${inquiry.status}`}>{inquiry.status.toUpperCase()}</span>
              </div>
              <p className="card-message">{inquiry.message}</p>
              <div className="card-footer">
                <span className="card-date">{new Date(inquiry.created_at).toLocaleString()}</span>
                <div className="card-actions">
                  <select value={inquiry.status} onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}>
                    <option value="unseen">Unseen</option>
                    <option value="seen">Seen</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="admin-inquiries__empty">
            <span className="admin-inquiries__empty-text">No inquiries found.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inquiries;
