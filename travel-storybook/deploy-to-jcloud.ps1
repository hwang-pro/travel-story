# JCloud 배포 스크립트 (PowerShell)
# 사용법: .\deploy-to-jcloud.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerAddress,
    
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [Parameter(Mandatory=$false)]
    [string]$ServerPath = "/var/www/travel-storybook/dist"
)

Write-Host "🚀 JCloud 배포 시작..." -ForegroundColor Green

# 빌드 확인
if (-not (Test-Path "dist")) {
    Write-Host "❌ dist 폴더가 없습니다. 먼저 빌드를 실행하세요." -ForegroundColor Red
    Write-Host "   npm run build" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 빌드 결과물 확인 중..." -ForegroundColor Yellow
$distFiles = Get-ChildItem -Path "dist" -Recurse -File
Write-Host "   발견된 파일: $($distFiles.Count)개" -ForegroundColor Cyan

# SCP로 업로드
Write-Host "📤 서버로 업로드 중..." -ForegroundColor Yellow
Write-Host "   서버: ${Username}@${ServerAddress}" -ForegroundColor Cyan
Write-Host "   경로: ${ServerPath}" -ForegroundColor Cyan

try {
    # dist 폴더의 모든 파일을 서버로 업로드
    scp -r dist/* "${Username}@${ServerAddress}:${ServerPath}/"
    
    Write-Host "✅ 업로드 완료!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  다음 단계를 서버에서 실행하세요:" -ForegroundColor Yellow
    Write-Host "   1. SSH 접속: ssh ${Username}@${ServerAddress}" -ForegroundColor Cyan
    Write-Host "   2. 권한 설정: sudo chown -R www-data:www-data /var/www/travel-storybook" -ForegroundColor Cyan
    Write-Host "   3. Nginx 재시작: sudo systemctl restart nginx" -ForegroundColor Cyan
} catch {
    Write-Host "❌ 업로드 실패: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 대안:" -ForegroundColor Yellow
    Write-Host "   - WinSCP 사용 (GUI 도구)" -ForegroundColor Cyan
    Write-Host "   - Git Bash에서 scp 사용" -ForegroundColor Cyan
    exit 1
}

