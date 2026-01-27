# Portfolio Backend API

포트폴리오 웹사이트 백엔드 API 서버

## 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: MySQL
- **Authentication**: JWT (Passport.js)
- **Error Tracking**: Sentry
- **Email**: Nodemailer
- **Push Notifications**: Web Push

## 프로젝트 구조

```
api/
├── config/          # 설정 파일 (DB, Passport, Sentry)
├── controllers/     # HTTP 요청 처리 (에러는 next로 전달)
├── services/        # 비즈니스 로직 (에러 해석 및 판단)
├── repositories/    # DB 접근 (에러는 그대로 throw)
├── models/          # Sequelize 모델
├── routes/          # 라우터 정의
├── middlewares/     # 미들웨어 (Auth, Rate Limit, Error)
├── utils/           # 유틸리티 함수
├── seeders/         # 초기 데이터
└── scripts/         # 관리자 계정 생성/수정 스크립트
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 `.env.example`을 참고하여 설정:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio_db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=1h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=7d

# Admin (노트용)
ADMIN_ID=admin
ADMIN_PASSWORD=admin123!
```

### 3. 데이터베이스 설정

MySQL 데이터베이스를 생성하고 연결 정보를 `.env`에 설정

### 4. 관리자 계정 생성

```bash
npm run create-admin [adminId] [password]
```

또는 환경 변수 사용:
```bash
npm run create-admin
```

### 5. 서버 실행

개발 모드:
```bash
npm run dev
```

프로덕션 모드:
```bash
npm start
```

## 관리자 계정 관리

### 계정 생성

```bash
npm run create-admin taeho_admin mySecurePassword123!
```

### 비밀번호 초기화

```bash
npm run reset-admin taeho_admin newPassword123!
```

## API 엔드포인트

### 인증 (Auth)
- `POST /api/auth/login` - 관리자 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/push-subscription` - 푸시 구독 저장 (인증 필요)

### 프로젝트 (Projects)
- `GET /api/projects` - 모든 프로젝트 조회
- `GET /api/projects/:slug` - Slug로 프로젝트 조회
- `POST /api/projects` - 프로젝트 생성 (인증 필요)
- `PUT /api/projects/:id` - 프로젝트 수정 (인증 필요, 낙관적 락)
- `DELETE /api/projects/:id` - 프로젝트 삭제 (인증 필요)

### 문의 (Inquiries)
- `POST /api/inquiries` - 문의 생성 (1분당 1회 제한)
- `GET /api/inquiries` - 모든 문의 조회 (인증 필요)
- `GET /api/inquiries/:id` - 문의 상세 조회 (인증 필요)
- `PATCH /api/inquiries/:id/status` - 문의 상태 업데이트 (인증 필요)

### 기술 사례 (Skill Cases)
- `GET /api/skill-cases` - 모든 사례 조회
- `GET /api/skill-cases/:id` - 사례 상세 조회
- `POST /api/skill-cases` - 사례 생성 (인증 필요)
- `PUT /api/skill-cases/:id` - 사례 수정 (인증 필요)
- `DELETE /api/skill-cases/:id` - 사례 삭제 (인증 필요)

## 보안 기능

1. **Rate Limiting**
   - 일반 API: 15분당 100회
   - 문의 API: 1분당 1회
   - 로그인 API: 30분당 5회 (실패 시)

2. **입력값 검증**
   - Sequelize 모델 레벨 검증
   - XSS 방지 (Sanitization)
   - 이메일 형식 검증

3. **낙관적 락 (Optimistic Lock)**
   - 프로젝트 수정 시 버전 충돌 방지

4. **트랜잭션 처리**
   - 문의 생성 시 원자적 처리 (저장 → 이메일 → 푸시)

## 에러 처리 원칙

- **Repository**: 에러를 그대로 throw (판단하지 않음)
- **Service**: 에러를 해석하고 비즈니스 의미 부여
- **Controller**: 에러를 next로 전달 (처리하지 않음)
- **Error Middleware**: 최종 에러 처리 및 응답

## Vercel 배포

Vercel 환경 변수에 다음을 설정:
- 모든 `.env` 변수
- `NODE_ENV=production`
- `DB_SSL=true` (원격 DB 사용 시)
