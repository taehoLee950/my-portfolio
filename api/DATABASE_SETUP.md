# 데이터베이스 설정 가이드 (MySQL + HeidiSQL)

## 1. HeidiSQL에서 데이터베이스 생성

### 방법 1: SQL 쿼리로 생성
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 방법 2: HeidiSQL UI로 생성
1. HeidiSQL 실행
2. MySQL 서버에 연결
3. 우클릭 → "데이터베이스 생성"
4. 데이터베이스 이름: `portfolio_db`
5. 문자셋: `utf8mb4`
6. 정렬: `utf8mb4_unicode_ci`
7. 확인 클릭

## 2. .env 파일 설정

`api/.env` 파일을 열고 다음 정보를 수정:

### 필수 수정 사항:
1. **DB_PASSWORD**: MySQL root 비밀번호 (비밀번호가 있다면)
2. **JWT_SECRET**: 강력한 랜덤 문자열로 변경
3. **JWT_REFRESH_SECRET**: 강력한 랜덤 문자열로 변경

### 선택 수정 사항:
- 이메일 설정 (문의 알림 받으려면)
- VAPID 키 (푸시 알림 사용하려면)
- Sentry DSN (에러 추적 사용하려면)

## 3. JWT Secret 생성 방법

터미널에서 실행:
```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# 또는 온라인 생성기 사용
# https://generate-secret.vercel.app/32
```

## 4. 관리자 계정 생성

데이터베이스 생성 후:
```bash
cd api
npm run create-admin
```

또는 커스텀 계정:
```bash
npm run create-admin taeho_admin mySecurePassword123!
```

## 5. 서버 실행

```bash
npm run dev
```

서버가 정상적으로 실행되면:
- 데이터베이스 연결 성공 메시지 확인
- 테이블 자동 생성 확인 (development 모드)

## 문제 해결

### 데이터베이스 연결 실패
- MySQL 서버가 실행 중인지 확인
- HeidiSQL에서 연결 테스트
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` 확인

### 테이블이 생성되지 않음
- `NODE_ENV=development` 확인
- 데이터베이스 이름이 `portfolio_db`인지 확인
- 권한 문제 확인 (root 계정 권한)
