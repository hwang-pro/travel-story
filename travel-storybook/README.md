# Travel Storybook

AI 기반 자동 여행 스토리북 생성 서비스

## 🌟 주요 기능

- 🔐 Google 로그인 (Firebase Auth)
- 📸 여행 사진 업로드 (Firebase Storage)
- ✍️ 여행 정보 기록 (날짜, 장소, 메모 등)
- 🤖 AI 기반 자동 스토리북 생성 (GPT-4o)
- 📖 감성적인 스토리북 미리보기

## 🛠 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: OpenAI GPT-4o
- **Routing**: React Router v6
- **Icons**: Lucide React
- **File Upload**: React Dropzone

## 📦 설치 방법

1. 프로젝트 클론 또는 다운로드

2. 의존성 설치:
\`\`\`bash
npm install
\`\`\`

3. 환경 변수 설정:
프로젝트 루트에 \`.env\` 파일을 생성하고 다음 내용을 입력하세요:

\`\`\`env
# Firebase 설정
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# OpenAI 설정
VITE_OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

4. Firebase 프로젝트 설정:
   - [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
   - Authentication에서 Google 로그인 활성화
   - Firestore Database 생성
   - Storage 활성화
   - 프로젝트 설정에서 웹 앱 추가 후 설정 정보를 위의 환경 변수에 입력

5. OpenAI API 키 발급:
   - [OpenAI Platform](https://platform.openai.com/)에서 API 키 발급
   - 위의 환경 변수에 입력

## 🚀 실행 방법

### 개발 환경

개발 서버 실행:
\`\`\`bash
npm run dev
\`\`\`

브라우저에서 `http://localhost:5173` 접속

### 프로덕션 빌드

빌드 실행:
\`\`\`bash
npm run build
\`\`\`

빌드 결과물은 `dist/` 폴더에 생성됩니다.

빌드 미리보기 (로컬 테스트):
\`\`\`bash
npm run preview
\`\`\`

## 🌐 배포 방법

이 프로젝트는 **JCloud Ubuntu 서버**에 배포됩니다.

### 배포 흐름

1. **로컬에서 빌드**
   \`\`\`bash
   npm run build
   \`\`\`

2. **빌드 폴더를 JCloud 서버로 업로드**
   - `dist/` 폴더의 모든 파일을 서버의 `/var/www/travel-storybook/dist/` 경로로 업로드
   - SCP, SFTP, 또는 Git 사용

3. **Nginx로 정적 파일 서비스**
   - Nginx 설정 파일 참고: `nginx.conf.example`
   - React Router SPA 라우팅 설정 필요

4. **서버 재시작**
   \`\`\`bash
   sudo systemctl restart nginx
   \`\`\`

**자세한 배포 가이드는 [DEPLOY.md](./DEPLOY.md)를 참고하세요.**

### 중요사항

- ❌ **Firebase Hosting 사용 안 함**: JCloud에 직접 배포합니다.
- ✅ **Nginx 사용**: Ubuntu 서버에서 Nginx로 정적 파일을 서빙합니다.
- ✅ **빌드 파일만 업로드**: `dist/` 폴더의 파일만 서버에 업로드합니다.

## 📁 프로젝트 구조

\`\`\`
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── LoadingSpinner.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   └── PhotoUploader.tsx
├── pages/              # 페이지 컴포넌트
│   ├── LoginPage.tsx
│   ├── TripListPage.tsx
│   ├── TripDetailPage.tsx
│   └── StorybookPage.tsx
├── hooks/              # 커스텀 훅
│   └── useAuth.tsx
├── lib/                # 외부 서비스 설정
│   ├── firebase.ts
│   └── openai.ts
├── types/              # TypeScript 타입 정의
│   └── index.ts
├── App.tsx             # 메인 앱 컴포넌트
├── main.tsx            # 엔트리 포인트
└── index.css           # 글로벌 스타일
\`\`\`

## 📱 페이지 구성

1. **로그인 페이지** (\`/login\`)
   - Google 소셜 로그인

2. **여행 목록 페이지** (\`/\`)
   - 사용자의 여행 목록 표시
   - 새 여행 생성

3. **여행 상세 페이지** (\`/trip/:id\`)
   - 사진 업로드
   - 여행 정보 입력 (제목, 날짜, 장소, 메모 등)
   - AI 스토리북 생성

4. **스토리북 미리보기** (\`/trip/:id/storybook\`)
   - AI가 생성한 10개 페이지 스토리 슬라이드
   - 감성적인 레이아웃과 캡션

## 🎨 디자인 컨셉

- 미니멀하고 깔끔한 디자인
- Instagram / Apple 스타일 참고
- 부드러운 그라데이션 배경
- Round Corner 카드 디자인
- Pretendard 폰트 사용
- 베이지/파스텔 컬러 팔레트

## ⚠️ 주의사항

- **보안**: 현재 OpenAI API 키가 클라이언트에 노출됩니다. 프로덕션 환경에서는 반드시 백엔드 서버를 통해 API를 호출해야 합니다.
- **Firebase 규칙**: Firestore 및 Storage 보안 규칙을 적절히 설정해야 합니다.
- **비용**: OpenAI API 및 Firebase 사용에 따른 비용이 발생할 수 있습니다.

## 📄 라이선스

MIT

## 🤝 기여

이슈와 풀 리퀘스트를 환영합니다!
