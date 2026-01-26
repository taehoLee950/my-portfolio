import "dotenv/config";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("skill_cases", null, {}); // 기존 데이터 삭제

    await queryInterface.bulkInsert(
      "skill_cases",
      [
        // Frontend -> React / Redux-Toolkit
        {
          category: "Frontend",
          skill_name: "TOP_BUTTON01 (스마트 스크롤 제어)",
          content_ko: "실시간 스크롤 감지 및 PWA 설치 모달과의 UI 간섭 문제를 해결한 스마트 상단 이동 버튼",
          content_en: "Smart scroll-to-top button resolving UI interference with PWA install modal using real-time scroll detection",
          notion_link: "https://www.notion.so/TOP_BUTTON01-2ed3ee00e67a80c19144c38fe93b58d8?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "Frontend",
          skill_name: "MAIN_01: 동적 카드 렌더링 시스템 구현",
          content_ko: "객체 매핑 기반의 동적 렌더링을 구현하여, 로컬 스토리지 및 Redux 상태와 연동된 사용자 맞춤형 커스터마이징 대시보드를 구축함",
          content_en: "Built customizable dashboard with dynamic rendering based on object mapping, integrated with localStorage and Redux state",
          notion_link: "https://www.notion.so/MAIN_01-2ed3ee00e67a80fe8f13e98599cc88c4?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "Frontend",
          skill_name: "APP_TUTORIAL (동적 요소 탐색 가이드)",
          content_ko: "사용자의 커스터마이징 설정에 대응하기 위해 `getBoundingClientRect()`를 활용한 실시간 좌표 추적 방식의 동적 요소 탐색 가이드를 구현함",
          content_en: "Implemented dynamic element discovery guide using real-time coordinate tracking via `getBoundingClientRect()` to accommodate user customization",
          notion_link: "https://www.notion.so/APP_TUTORIAL-2ed3ee00e67a800083bdd8159e3dcb0c?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "Frontend",
          skill_name: "[UX개선] [API 연결] 예약 페이지 세분화",
          content_ko: "매장·기기·서비스·일정으로 이어지는 복잡한 예약 프로세스를 Redux 상태로 통합 관리하고, 각 단계별 검증 로직을 통해 데이터 정합성을 확보한 페이지네이션 시스템 구축",
          content_en: "Built pagination system managing complex booking flow (store-device-service-schedule) with Redux state and step-by-step validation logic for data integrity",
          notion_link: "https://www.notion.so/UX-API-2df3ee00e67a80e7b636c622173de905?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "Frontend",
          skill_name: "[UX개선] [API 연결] 내 예약 목록",
          content_ko: "서버로부터 수신한 예약 목록을 전역 상태로 관리하며, 상태 배지(Badge)와 애니메이션 효과를 결합해 사용자가 실시간 예약 현황을 직관적으로 파악할 수 있는 대시보드 구현",
          content_en: "Implemented dashboard with global state management for reservations, combining status badges and animations for intuitive real-time booking status",
          notion_link: "https://www.notion.so/UX-API-2df3ee00e67a8039a349f43007885df4?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "Frontend",
          skill_name: "[UX개선] 취소 정책 고지 강화",
          content_ko: "예약 시작 24시간 전 취소 불가 정책을 기술적으로 구현하기 위해, `Date` 객체 연산과 Redux 상태를 결합한 실시간 경고 시스템 및 조건부 버튼 활성화 로직 설계",
          content_en: "Designed real-time warning system and conditional button activation using Date object operations and Redux state to enforce 24-hour cancellation policy",
          notion_link: "https://www.notion.so/UX-2e23ee00e67a80fb82a9c6b2fc0a46e1?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },

        // JavaScript (ES6+)
        {
          category: "JavaScript (ES6+)",
          skill_name: "CARD_HOLD_DELETE01 (모바일 터치 인터랙션 최적화)",
          content_ko: "모바일 환경의 스크롤 동작과 롱프레스(삭제 모드) 진입 간의 간섭을 해결하기 위해 터치 좌표 임계값(Threshold) 계산 로직을 직접 구현함",
          content_en: "Implemented custom touch coordinate threshold logic to resolve interference between scroll and long-press (delete mode) on mobile",
          notion_link: "https://www.notion.so/CARD_HOLD_DELETE01-2ed3ee00e67a80cebc4dede70df7cddb?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "JavaScript (ES6+)",
          skill_name: "비상구(Outside Click) 감지 모듈",
          content_ko: "이벤트 버블링과 `contains` API를 활용하여 모달 외부 클릭 시 자동으로 닫히는 공통 인터랙션 로직을 설계하여 UX 편의성 증대",
          content_en: "Designed common interaction logic using event bubbling and `contains` API to auto-close modals on outside click, improving UX",
          notion_link: "https://www.notion.so/CARD_HOLD_DELETE01-2ed3ee00e67a80cebc4dede70df7cddb?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },

        // CSS & UI/UX
        {
          category: "CSS & UI/UX",
          skill_name: "고객 페이지 모바일 퍼스트 UX/UI변경 총 작업",
          content_ko: "정보 위계에 따른 섹션화 및 힌트형 플레이스홀더 도입으로 입력 스트레스를 낮추고, 정규표현식을 활용한 클라이언트 사이드 데이터 정제 로직 구축",
          content_en: "Reduced input stress with sectionized info hierarchy and hint placeholders, built client-side data sanitization using regex",
          notion_link: "https://www.notion.so/UX-UI-2e33ee00e67a808bb860c6c739e1d978?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "CSS & UI/UX",
          skill_name: "모바일 조작성을 고려한 상황 대응형 UX 설계",
          content_ko: "엄지손가락의 가동 범위를 고려하여 모바일 환경에서 주요 버튼의 순서를 역전(column-reverse)시키는 등 디바이스별 최적화된 인터랙션 구현",
          content_en: "Implemented device-optimized interactions including button order reversal (column-reverse) considering thumb reach on mobile",
          notion_link: "https://www.notion.so/UX-UI-2e33ee00e67a808bb860c6c739e1d978?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "CSS & UI/UX",
          skill_name: "서비스 일관성 및 레이아웃 안정성 확보",
          content_ko: "공통 페이지 헤더 및 네비게이션 패턴을 표준화하여 사용자 이질감을 제거하고, Viewport 기반의 높이 설정을 통해 화면 구성의 안정성 강화",
          content_en: "Standardized common page header and navigation patterns to eliminate user disorientation, enhanced layout stability with viewport-based height settings",
          notion_link: "https://www.notion.so/UX-UI-2e33ee00e67a808bb860c6c739e1d978?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },

        // Utility & Export
        {
          category: "Utility & Export",
          skill_name: "[UX개선] [API 연결] 내 예약 목록 (PDF 저장)",
          content_ko: "html2canvas와 jsPDF를 연동하여 모바일 해상도 및 긴 세로 레이아웃에 최적화된 고화질 예약 명세서 PDF 저장 기능을 구현함",
          content_en: "Implemented high-quality PDF export for reservation receipts optimized for mobile resolution and long vertical layouts using html2canvas and jsPDF",
          notion_link: "https://www.notion.so/UX-API-2df3ee00e67a8039a349f43007885df4?pvs=21",
          reference_link: "https://www.notion.so/2e43ee00e67a8019b0fdd76b7aa4bf98?pvs=21",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "Utility & Export",
          skill_name: "[연결/UX 개선] ADMIN_DELAY_RESERVATION",
          content_ko: "브라우저 정책과 사용자 경험을 고려하여, TTS(음성) 및 데스크탑 알림을 결합한 전역 폴링 기반 실시간 지연 작업 감시 시스템 구현",
          content_en: "Implemented global polling-based real-time delay monitoring system combining TTS and desktop notifications, considering browser policies and UX",
          notion_link: "https://www.notion.so/UX-ADMIN_DELAY_RESERVATION-5-2e33ee00e67a8053be53e3d16b66a6e8?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },

        // PWA
        {
          category: "PWA",
          skill_name: "PWA_INSTALL_OPTIMIZE (사용자 친화적 설치 로직)",
          content_ko: "브라우저의 자동 설치 팝업을 제어하고, 사용자가 서비스 가치를 경험한 시점에 설치를 제안하는 비강제적 커스텀 설치 전략 수립 및 구현",
          content_en: "Controlled browser auto-install popup and implemented non-intrusive custom install strategy that prompts after user experiences service value",
          notion_link: "https://www.notion.so/PWA_INSTALL_OPTIMIZE-2ed3ee00e67a80089b41c89293f3a955?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },

        // Backend (Node.js/Express)
        {
          category: "Backend (Node.js/Express)",
          skill_name: "개발 노트: 3계층 에러 핸들링 원칙",
          content_ko: "Controller-Service-Repository 패턴을 적용하여 각 레이어의 책임을 명확히 하고, 전역 에러 핸들링 및 3계층 에러 처리 원칙 수립",
          content_en: "Applied Controller-Service-Repository pattern with clear layer responsibilities, established global error handling and 3-layer error processing principles",
          notion_link: "https://www.notion.so/3-Controller-Service-Repository-2e33ee00e67a806d807ae1eb6bddedea?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },

        // Backend (MySQL/Sequelize)
        {
          category: "Backend (MySQL/Sequelize)",
          skill_name: "ERD 제작 (ERDCloud)",
          content_ko: "데이터 무결성을 고려한 RDBMS 스키마 설계 및 유기적인 관계 정의",
          content_en: "Designed RDBMS schema considering data integrity with organic relationship definitions",
          notion_link: "https://www.notion.so/ERD-ERDCloud-2d33ee00e67a8011b505d5dcdf7692a0?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "Backend (MySQL/Sequelize)",
          skill_name: "server(백엔드) DB, Model, Migration",
          content_ko: "마이그레이션과 시더(Seeder)를 활용하여 팀원 간 DB 스키마 동기화 자동화 및 테스트 데이터 생성 공수 절감",
          content_en: "Automated DB schema sync between team members using migrations and seeders, reduced test data creation effort",
          notion_link: "https://www.notion.so/server-DB-Model-Migration-2ca3ee00e67a8022b914c189a3251d43?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "Backend (MySQL/Sequelize)",
          skill_name: "MySQL을 사용하여 빠른 테스트 및 하이브리드 쿼리 전략 수립",
          content_ko: "상황에 맞는 하이브리드 쿼리 전략 수립 및 대량 데이터 처리 최적화 (Sequelize ORM & Native Query)",
          content_en: "Established hybrid query strategy for various situations and optimized bulk data processing (Sequelize ORM & Native Query)",
          notion_link: "https://www.notion.so/TEST-MySQL-2e63ee00e67a807aae62f0738bab6097?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "Backend (MySQL/Sequelize)",
          skill_name: "대량 데이터 처리 및 배정 로직 최적화",
          content_ko: "다중 예약 건을 특정 기사에게 일괄 배정하는 로직에서 Raw SQL의 INSERT INTO 구문을 활용하여 오버헤드를 줄이고 처리 효율을 극대화",
          content_en: "Maximized processing efficiency by reducing overhead using Raw SQL INSERT INTO for bulk assignment of multiple reservations to specific technicians",
          notion_link: "https://www.notion.so/TEST-MySQL-2e63ee00e67a807aae62f0738bab6097?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },

        // API Documentation
        {
          category: "API Documentation",
          skill_name: "Swagger 생성 및 통합 인증 관리",
          content_ko: "Swagger-jsdoc 및 Swagger-ui-express 기반 문서 자동화, 인터랙티브 API 테스트 환경 구축, JWT Bearer Auth 통합 인증 관리",
          content_en: "Automated documentation with Swagger-jsdoc and Swagger-ui-express, built interactive API testing environment, integrated JWT Bearer Auth management",
          notion_link: "https://www.notion.so/Swagger-2d83ee00e67a80c9a0baceaea3fb69e2?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },

        // Test-Driven Development
        {
          category: "Test-Driven Development",
          skill_name: "검증 기반의 커밋 프로세스 (Test-Before-Commit)",
          content_ko: "Postman 단위 테스트를 선행하고, 정상 작동이 100% 확인된 로직만 커밋하여 `develop` 브랜치의 안정성을 극대화",
          content_en: "Maximized `develop` branch stability by running Postman unit tests first and only committing logic verified 100% functional",
          notion_link: "https://www.notion.so/2e03ee00e67a809a9938f2b02f5c00c2?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "Test-Driven Development",
          skill_name: "Postman Collection 및 인터랙티브 테스트 가이드 공유",
          content_ko: "엔드포인트, JWT 헤더, 쿼리 파라미터가 사전 설정된 Postman Collection을 구축하여 팀원 간 즉각적인 테스트 환경 공유",
          content_en: "Built Postman Collection with pre-configured endpoints, JWT headers, query params for instant test environment sharing among team",
          notion_link: "https://www.notion.so/2e03ee00e67a809a9938f2b02f5c00c2?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category: "Test-Driven Development",
          skill_name: "UX 개선을 위한 실시간 데이터 바인딩 및 리팩터링",
          content_ko: "설계한 API를 프론트엔드 레이어에 직접 바인딩하며, 사용자 경험(UX) 관점에서 응답 속도 및 데이터 구조를 최적화하는 리팩터링 병행",
          content_en: "Directly bound designed APIs to frontend layer while refactoring to optimize response speed and data structure from UX perspective",
          notion_link: "https://www.notion.so/2e03ee00e67a809a9938f2b02f5c00c2?pvs=21",
          reference_link: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("skill_cases", null, {});
  },
};
