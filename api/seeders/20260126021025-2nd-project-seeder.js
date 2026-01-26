/**
 * @file seeders/seed-project-icemachine.js
 * @description 2차 프로젝트(ICEMACHINE) 단독 시더 파일
 * [2026-01-26] 태호님의 관리자 페이지 고도화 및 백엔드 작업 내역 반영
 */
import "dotenv/config";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("projects", [
      {
        id: 2, // 2차 프로젝트 ID
        slug: "icemachine-matching-platform",
        title_ko: "ICEMACHINE: 제빙기 유지보수 기사 매칭 및 관리자 관제 플랫폼",
        title_en:
          "ICEMACHINE: Ice Machine Maintenance Matching & Admin Control Platform",
        period: "2025.12 - 2026.01",
        role_summary: "Full-stack Developer / Backend & Admin System Architect",

        my_tasks_ko: `• Node.js/Express 기반 계층형 아키텍처(Controller-Service-Repository) 설계 및 DB 스키마 구축
• JWT Access/Refresh Token 기반 보안 인증 체계 및 Axios Interceptor를 통한 토큰 자동 재발급 로직 구현
• 실시간 예약 관제를 위한 관리자 대시보드 구축 (60초 주기 자동 리프레시 및 통계 데이터 실시간 동기화)
• 운영 실수 방지를 위한 '상태 변경 필터링' 및 '인라인 상태 관리 드롭다운' UI/UX 최적화
• 데스크탑 환경에 최적화된 예약 상세 모달 및 680px 너비의 정보 위계(Hierarchy) 설계
• 관리자-기사 간 원활한 소통을 위한 예약 ID(Unique ID) 기반의 커뮤니케이션 가이드 수립`,

        my_tasks_en: `• Designed a layered backend architecture and established a DB schema centered on the 'Schedule' hub.
• Implemented a secure JWT authentication system with an Axios Interceptor for automated token reissuance.
• Developed an Admin Dashboard for real-time monitoring, featuring 60s auto-refresh and live stats sync.
• Optimized UI/UX with inline status management dropdowns and filters to prevent operational errors.
• Designed desktop-optimized reservation detail modals with a 680px width and clear information hierarchy.
• Established an ID-based communication guide to streamline coordination between admins and engineers.`,

        tech_stack: JSON.stringify([
          "Node.js",
          "Express",
          "MySQL",
          "Sequelize",
          "React",
          "Redux-Toolkit",
          "Winston",
          "Postman",
        ]),
        github_url: "https://github.com/wahitworks/icemachine-server", // 임~ 서버 리포지토리 기준
        version: 1,
        metadata: JSON.stringify({
          focus: "Backend Architecture & Admin UX",
          key_feature: "Real-time Dashboard & JWT Auth",
          db_engine: "InnoDB",
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("project_images", [
      {
        project_id: 2,
        image_url: "/assets/images/projects/icemachine-main.png",
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        project_id: 2,
        image_url: "/assets/images/projects/icemachine-dashboard.png", // 관리자 대시보드 강조
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        project_id: 2,
        image_url: "/assets/images/projects/icemachine-detail-modal.png", // 작업하신 상세 모달 UI
        sort_order: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("project_images", { project_id: 2 }, {});
    await queryInterface.bulkDelete("projects", { id: 2 }, {});
  },
};
