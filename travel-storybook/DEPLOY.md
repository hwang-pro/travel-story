# 🚀 JCloud 배포 가이드

## 배포 구조

```
로컬 개발 환경          JCloud Ubuntu 서버
┌─────────────┐        ┌──────────────────┐
│             │        │                  │
│  npm run    │   →    │  /var/www/      │
│  build      │        │  travel-storybook│
│             │        │  /dist          │
│  dist/      │        │                  │
│  생성       │        │  Nginx 서빙      │
└─────────────┘        └──────────────────┘
```

## 배포 단계

### 1단계: 로컬에서 빌드

```bash
# 프로젝트 디렉토리로 이동
cd travel-storybook

# 의존성 설치 (처음 한 번만)
npm install

# 프로덕션 빌드 실행
npm run build
```

빌드가 완료되면 `dist/` 폴더가 생성됩니다.

**빌드 결과물:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── ...
```

### 2단계: 빌드 결과물 확인

```bash
# 빌드 결과 확인
ls -la dist/

# 로컬에서 미리보기 (선택사항)
npm run preview
```

### 3단계: JCloud 서버에 업로드

#### 방법 1: SCP 사용 (권장)

```bash
# dist 폴더 전체를 서버로 업로드
scp -r dist/* 사용자명@jcloud서버주소:/var/www/travel-storybook/dist/
```

#### 방법 2: SFTP 사용

```bash
# SFTP 클라이언트 (FileZilla, WinSCP 등) 사용
# 서버 주소: jcloud서버주소
# 포트: 22 (SSH)
# 경로: /var/www/travel-storybook/dist/
```

#### 방법 3: Git 사용 (서버에 Git 설치된 경우)

```bash
# 서버에서 직접 빌드
ssh 사용자명@jcloud서버주소
cd /var/www/travel-storybook
git pull origin main
npm install
npm run build
```

### 4단계: Nginx 설정

#### 서버에 SSH 접속

```bash
ssh 사용자명@jcloud서버주소
```

#### Nginx 설정 파일 생성

```bash
sudo nano /etc/nginx/sites-available/travel-storybook
```

다음 내용을 입력 (또는 `nginx.conf.example` 파일 참고):

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 실제 도메인으로 변경
    
    root /var/www/travel-storybook/dist;
    index index.html;

    # Gzip 압축
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 정적 파일 캐싱
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router SPA 라우팅
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Nginx 설정 활성화

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/travel-storybook /etc/nginx/sites-enabled/

# Nginx 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

### 5단계: 권한 설정

```bash
# 웹 서버가 파일을 읽을 수 있도록 권한 설정
sudo chown -R www-data:www-data /var/www/travel-storybook
sudo chmod -R 755 /var/www/travel-storybook
```

### 6단계: 배포 확인

브라우저에서 접속하여 확인:
- `http://jcloud서버주소` 또는
- `http://your-domain.com`

## 환경 변수 설정 (서버)

**중요:** 빌드 시점에 환경 변수가 번들에 포함되므로, 서버에서 별도 설정이 필요 없습니다.

하지만 빌드 전에 `.env` 파일에 올바른 값이 설정되어 있어야 합니다.

## 업데이트 배포

코드 변경 후 재배포:

```bash
# 1. 로컬에서 빌드
npm run build

# 2. 서버로 업로드
scp -r dist/* 사용자명@jcloud서버주소:/var/www/travel-storybook/dist/

# 또는 서버에서 직접 빌드
ssh 사용자명@jcloud서버주소
cd /var/www/travel-storybook
git pull
npm run build
sudo systemctl reload nginx
```

## 문제 해결

### 404 에러 발생 시
- Nginx 설정에서 `try_files $uri $uri/ /index.html;` 확인
- React Router가 제대로 작동하는지 확인

### 정적 파일 로드 실패
- 파일 경로 확인 (`/var/www/travel-storybook/dist/`)
- 권한 확인 (`sudo chmod -R 755 /var/www/travel-storybook`)

### Firebase 인증 오류
- Firebase Console에서 승인된 도메인에 서버 도메인 추가
- `.env` 파일의 Firebase 설정 확인

## 보안 체크리스트

- [ ] Nginx 보안 헤더 설정 확인
- [ ] HTTPS 설정 (Let's Encrypt 사용 권장)
- [ ] Firebase 보안 규칙 설정
- [ ] 환경 변수에 민감한 정보 포함 여부 확인

## 참고사항

- **Firebase Hosting 사용 안 함**: 이 프로젝트는 JCloud에 배포합니다.
- **빌드 파일만 업로드**: `node_modules`나 소스 코드는 업로드하지 않습니다.
- **환경 변수**: 빌드 시점에 번들에 포함되므로, 서버에서 별도 설정 불필요합니다.

