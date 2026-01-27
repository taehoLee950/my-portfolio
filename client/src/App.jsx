import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { refreshAuth, stopRefreshing } from "./store/slices/authSlice";

import Navbar from "./components/common/Navbar";
import Hero from "./components/sections/Hero";
import TechStack from "./components/sections/TechStack";
import Projects from "./components/sections/Projects";
import LearningCases from "./components/sections/LearningCases";
import Contact from "./components/sections/Contact";
import WireFlow from "./components/common/WireFlow";
import Login from "./components/admin/Login";
import Inquiries from "./components/admin/Inquiries";
import ProtectedRoute from "./components/common/ProtectedRoute";

/**
 * 임~ 코멘트: 메인 레이아웃은 일반 사용자용이므로 
 * 인증 여부와 상관없이 항상 접근 가능해야 합니다.
 */
const MainLayout = () => {
  const wirePaths = [
    "M 0,100 Q 250,50 500,100 T 1000,100",
    "M 0,300 Q 250,250 500,300 T 1000,300",
    "M 0,500 Q 250,450 500,500 T 1000,500",
    "M 0,700 Q 250,650 500,700 T 1000,700",
  ];

  return (
    <div className="app">
      <WireFlow paths={wirePaths} />
      <Navbar />
      <main>
        <Hero />
        <TechStack />
        <Projects />
        <LearningCases />
        <Contact />
      </main>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const { isRefreshing } = useSelector((state) => state.auth);

  useEffect(() => {
    /**
     * 임~ 코멘트: 여기서 미친짓(무조건 리프레시)을 막았습니다.
     * 로컬스토리지에 관리자 로그인 기록이 있을 때만 세션 복구를 시도합니다.
     */
    const savedUser = localStorage.getItem("adminUser");
    
    if (savedUser) {
      dispatch(refreshAuth());
    } else {
      // 관리자 정보가 없으면 리프레시 로딩을 즉시 종료하여 일반 사용자 화면 노출
      dispatch(stopRefreshing());
    }
  }, [dispatch]);

  /**
   * 임~ 코멘트: 관리자 로그인 상태를 복구 중일 때만 스피너를 보여줍니다.
   * 일반 사용자는 savedUser가 없으므로 이 조건에 걸리지 않고 바로 아래 Routes를 타게 됩니다.
   */
  if (isRefreshing && localStorage.getItem("adminUser")) {
    return (
      <div className="app-loading">
        <div className="app-loading__content">
          <div className="app-loading__spinner"></div>
          <p className="app-loading__text">SYSTEM_INITIALIZING...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* 누구나 접근 가능한 메인 포트폴리오 */}
      <Route path="/" element={<MainLayout />} />
      
      {/* 관리자 로그인 페이지 */}
      <Route path="/admin-login" element={<Login />} />
      
      {/* 인증이 필요한 관리자 전용 페이지 */}
      <Route
        path="/admin/inquiries"
        element={
          <ProtectedRoute>
            <Inquiries />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;