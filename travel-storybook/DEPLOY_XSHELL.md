# 🖥️ Xshell을 사용한 JCloud 배포 가이드

## 배포 흐름

```
로컬 (Windows)          Xshell              JCloud 서버
┌─────────────┐        ┌─────────┐        ┌──────────────┐
│             │        │         │        │              │
│  npm run    │   →    │  Xftp   │   →    │  /var/www/   │
│  build      │        │  업로드 │        │  travel-     │
│             │        │         │        │  storybook/  │
│  dist/      │        │         │        │  dist/       │
│  생성       │        │         │        │              │
└─────────────┘        └─────────┘        └──────────────┘
```

## 1단계: 로컬에서 빌드

```powershell
cd travel-storybook
npm run build
```

빌드가 완료되면 `dist/` 폴더가 생성됩니다.

## 2단계: Xftp로 파일 업로드

### 방법 1: Xftp 사용 (GUI, 권장)

1. **Xftp 실행**
   - Xshell과 함께 설치되어 있거나 별도 설치
   - Xshell에서 `Ctrl+Alt+F` 또는 상단 메뉴의 "새 파일 전송" 클릭

2. **연결 설정** (처음 한 번만)
   - Xshell 세션과 동일한 서버 정보 사용
   - 자동으로 연결됨

3. **파일 업로드**
   - **왼쪽 창**: 로컬 `C:\Users\...\travel-storybook\dist` 폴더로 이동
   - **오른쪽 창**: 서버 `/var/www/travel-storybook/dist/` 경로로 이동
     - 경로가 없으면 생성: `/var/www/travel-storybook/dist`
   - **dist 폴더의 모든 파일 선택** (Ctrl+A)
   - **업로드 버튼** 클릭 (또는 드래그 앤 드롭)

### 방법 2: Xshell 터미널에서 SCP 사용

Xshell 터미널에서 직접 명령어 실행:

```bash
# 로컬에서 실행 (PowerShell 또는 CMD)
cd travel-storybook
scp -r dist/* 사용자명@서버주소:/var/www/travel-storybook/dist/
```

## 3단계: 서버 설정 (Xshell 터미널)

Xshell로 서버에 SSH 접속한 후:

### 디렉토리 생성 (처음 한 번만)

```bash
sudo mkdir -p /var/www/travel-storybook/dist
```

### 권한 설정

```bash
sudo chown -R www-data:www-data /var/www/travel-storybook
sudo chmod -R 755 /var/www/travel-storybook
```

### Nginx 설정 파일 생성

```bash
sudo nano /etc/nginx/sites-available/travel-storybook
```

**다음 내용 입력**:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 실제 도메인 또는 서버 IP로 변경
    
    root /var/www/travel-storybook/dist;
    index index.html;

    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # 정적 파일 캐싱
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router SPA 라우팅
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 보안 헤더
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**저장**: `Ctrl+X`, `Y`, `Enter`

### Nginx 활성화 및 재시작

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/travel-storybook /etc/nginx/sites-enabled/

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

## 4단계: 배포 확인

브라우저에서 접속:
- `http://서버주소` 또는
- `http://도메인주소`

---

## 업데이트 배포

코드 변경 후 재배포:

1. **로컬에서 빌드**:
   ```powershell
   npm run build
   ```

2. **Xftp로 파일 업로드** (기존 파일 덮어쓰기)

3. **서버에서 Nginx 재시작** (필요시):
   ```bash
   sudo systemctl reload nginx
   ```

---

## Xshell 팁

### Xftp 빠른 실행
- Xshell에서 `Ctrl+Alt+F` 단축키로 Xftp 실행
- 현재 세션과 자동 연결

### 파일 전송 모니터링
- Xftp 하단 창에서 전송 진행 상황 확인
- 실패한 파일은 빨간색으로 표시

### 원격 파일 편집
- Xshell에서 `nano` 또는 `vi` 사용
- 또는 Xftp에서 파일 다운로드 → 편집 → 업로드

---

## 문제 해결

### Xftp 연결 실패
- Xshell 세션이 연결되어 있는지 확인
- SFTP 포트(22)가 열려있는지 확인

### 권한 거부 오류
```bash
sudo chown -R www-data:www-data /var/www/travel-storybook
sudo chmod -R 755 /var/www/travel-storybook
```

### 404 에러
- Nginx 설정에서 `try_files $uri $uri/ /index.html;` 확인
- 파일 경로 확인: `ls -la /var/www/travel-storybook/dist/`

### Nginx 설정 오류
```bash
# 설정 테스트
sudo nginx -t

# 오류 로그 확인
sudo tail -f /var/log/nginx/error.log
```

---

## 빠른 참조

### 필수 명령어

```bash
# 디렉토리 확인
ls -la /var/www/travel-storybook/dist/

# 권한 설정
sudo chown -R www-data:www-data /var/www/travel-storybook
sudo chmod -R 755 /var/www/travel-storybook

# Nginx 상태 확인
sudo systemctl status nginx

# Nginx 재시작
sudo systemctl restart nginx

# Nginx 설정 테스트
sudo nginx -t
```

---

## 참고사항

- **Xftp 없이 업로드**: Xshell 터미널에서 `scp` 명령어 사용 가능
- **빌드 파일만 업로드**: `dist/` 폴더의 파일만 업로드합니다
- **환경 변수**: 빌드 시점에 번들에 포함되므로 서버 설정 불필요

