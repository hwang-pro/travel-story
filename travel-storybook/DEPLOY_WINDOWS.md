# 🪟 Windows에서 JCloud 배포 가이드

## 빠른 시작

### 1단계: 빌드 확인

```powershell
cd travel-storybook
npm run build
```

`dist/` 폴더가 생성되었는지 확인하세요.

### 2단계: 서버 정보 확인

다음 정보가 필요합니다:
- **서버 주소**: 예) `jcloud.example.com` 또는 `123.456.789.0`
- **사용자명**: 예) `ubuntu`, `root`, `admin`
- **비밀번호** 또는 **SSH 키 파일**

### 3단계: 파일 업로드 (3가지 방법 중 선택)

---

## 방법 1: WinSCP 사용 (가장 쉬움) ⭐

### 설치
1. https://winscp.net/eng/download.php 에서 WinSCP 다운로드
2. 설치 완료

### 연결 및 업로드

1. **WinSCP 실행**
2. **새 세션** 클릭
3. **연결 정보 입력**:
   ```
   파일 프로토콜: SFTP
   호스트 이름: [JCloud 서버 주소]
   포트 번호: 22
   사용자 이름: [서버 사용자명]
   비밀번호: [서버 비밀번호]
   ```
4. **로그인** 클릭
5. **파일 탐색기 모드**:
   - 왼쪽: 로컬 `C:\Users\...\travel-storybook\dist` 폴더
   - 오른쪽: 서버 `/var/www/travel-storybook/dist/` 경로
6. **dist 폴더의 모든 파일 선택** (Ctrl+A)
7. **업로드** 버튼 클릭 (또는 드래그 앤 드롭)

---

## 방법 2: PowerShell 스크립트 사용

### PowerShell 스크립트 실행

```powershell
cd travel-storybook
.\deploy-to-jcloud.ps1 -ServerAddress "jcloud.example.com" -Username "ubuntu"
```

**매개변수**:
- `-ServerAddress`: JCloud 서버 주소
- `-Username`: 서버 사용자명
- `-ServerPath`: 서버 경로 (기본값: `/var/www/travel-storybook/dist`)

### 수동 SCP 명령어 (PowerShell)

```powershell
# OpenSSH 클라이언트가 설치되어 있어야 합니다
scp -r dist/* 사용자명@서버주소:/var/www/travel-storybook/dist/
```

**OpenSSH 설치 확인**:
```powershell
# PowerShell에서 실행
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
```

**OpenSSH 설치** (없는 경우):
```powershell
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

---

## 방법 3: Git Bash 사용

### Git Bash에서 실행

```bash
cd travel-storybook
scp -r dist/* 사용자명@서버주소:/var/www/travel-storybook/dist/
```

---

## 4단계: 서버 설정 (SSH 접속 필요)

### SSH 접속

**PowerShell에서**:
```powershell
ssh 사용자명@서버주소
```

**또는 Git Bash에서**:
```bash
ssh 사용자명@서버주소
```

### 디렉토리 생성 (처음 한 번만)

```bash
sudo mkdir -p /var/www/travel-storybook/dist
```

### 권한 설정

```bash
sudo chown -R www-data:www-data /var/www/travel-storybook
sudo chmod -R 755 /var/www/travel-storybook
```

### Nginx 설정

```bash
# 설정 파일 생성
sudo nano /etc/nginx/sites-available/travel-storybook
```

**다음 내용 입력** (또는 `nginx.conf.example` 파일 참고):

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 실제 도메인 또는 서버 IP
    
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

---

## 5단계: 배포 확인

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

2. **파일 업로드** (WinSCP 또는 SCP 사용)

3. **서버에서 Nginx 재시작** (필요시):
   ```bash
   sudo systemctl reload nginx
   ```

---

## 문제 해결

### SCP 명령어를 찾을 수 없음
- OpenSSH 클라이언트 설치 필요
- 또는 WinSCP 사용

### 권한 거부 오류
- 서버에서 `sudo chmod -R 755 /var/www/travel-storybook` 실행

### 404 에러
- Nginx 설정에서 `try_files $uri $uri/ /index.html;` 확인
- 파일 경로 확인: `/var/www/travel-storybook/dist/`

### Firebase 인증 오류
- Firebase Console에서 승인된 도메인에 서버 주소 추가
- `.env` 파일의 Firebase 설정 확인

---

## 참고사항

- **빌드 파일만 업로드**: `dist/` 폴더의 파일만 업로드합니다
- **환경 변수**: 빌드 시점에 번들에 포함되므로, 서버에서 별도 설정 불필요
- **Firebase Hosting 사용 안 함**: JCloud에 직접 배포합니다



