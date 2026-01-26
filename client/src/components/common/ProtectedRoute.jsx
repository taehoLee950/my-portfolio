import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * 인증되지 않은 경우 로그인 페이지로 리다이렉트
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isRefreshing } = useSelector((state) => state.auth);
  const location = useLocation();

  // 토큰 갱신 중에는 로딩 표시
  if (isRefreshing) {
    return (
      <div className="protected-route__loading">
        <div className="protected-route__spinner"></div>
        <p>AUTHENTICATING...</p>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
