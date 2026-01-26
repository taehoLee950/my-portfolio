/**
 * @file seeders/20260126-project-daegu-sky.js
 */
import "dotenv/config";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("projects", [
      {
        id: 1,
        slug: "daegu-sky-pwa",
        title_ko: "대구맑음: PWA 기반 사용자 맞춤형 대기질 대시보드",
        title_en: "Daegu Sky: PWA-based Customized Air Quality Dashboard",
        period: "2024.11 - 2024.12",
        role_summary: "Project Lead / Frontend Architecture Design",

        my_tasks_ko: `• Redux Toolkit 기반의 '동적 카드 렌더링 시스템' 구축으로 사용자 맞춤형 대시보드 구현
• PWA 커스텀 설치 로직 및 서비스 워커 최적화로 모바일 앱 수준의 사용자 경험 제공
• getBoundingClientRect 기반의 '동적 요소 추적 튜토리얼' 시스템 설계로 초기 사용자 이탈 방지
• 좌표 임계값(Threshold) 연산을 통한 '모바일 롱프레스 인터랙션' 최적화 및 스크롤 간섭 해결
• Vite 개발 환경과 실제 웹 서버 간의 PWA 동작 불일치 디버깅 및 해결`,

        my_tasks_en: `• Built a 'Dynamic Card Rendering System' using Redux Toolkit for a personalized dashboard.
• Optimized PWA custom install logic and Service Workers for a mobile-native experience.
• Designed a 'Dynamic Tutorial System' using getBoundingClientRect to track real-time element coordinates.
• Refined 'Long-press Interactions' by implementing coordinate threshold logic to prevent scroll interference.
• Debugged and resolved PWA behavior inconsistencies between Vite dev server and production environments.`,

        tech_stack: JSON.stringify([
          "React",
          "Redux-Toolkit",
          "PWA",
          "Vite",
          "JavaScript",
        ]),
        github_url: "https://github.com/wahitworks/daegu-sky",
        reference_link: "https://www.notion.so/2ed3ee00e67a81ea953dcce26b6781d0?source=copy_link",
        version: 0,
        metadata: JSON.stringify({
          focus: "Frontend Interaction & PWA",
          key_feature: "Customizable Dashboard",
          deployment: "Vercel",
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("project_images", [
      {
        project_id: 1, // 프로젝트 ID와 동일하게 맞춰줍니다.
        image_url: "/assets/images/projects/daegu-sky-main.png",
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("project_images", { project_id: 1 }, {});
    await queryInterface.bulkDelete("projects", { id: 1 }, {});
  },
};
