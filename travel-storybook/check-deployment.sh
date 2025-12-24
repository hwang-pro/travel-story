#!/bin/bash

# 배포 상태 확인 스크립트
# 서버에서 실행: bash check-deployment.sh

echo "=== 배포 상태 확인 ==="
echo ""

# 1. dist 디렉토리 확인
echo "1. dist 디렉토리 확인:"
if [ -d "/var/www/travel-storybook/dist" ]; then
    echo "✅ dist 디렉토리 존재"
    echo "   파일 목록:"
    ls -lah /var/www/travel-storybook/dist/ | head -20
    echo ""
    echo "   index.html 수정 시간:"
    ls -lh /var/www/travel-storybook/dist/index.html
else
    echo "❌ dist 디렉토리가 없습니다!"
fi
echo ""

# 2. Nginx 설정 확인
echo "2. Nginx 설정 확인:"
if [ -f "/etc/nginx/sites-enabled/travel-storybook" ]; then
    echo "✅ Nginx 설정 파일 존재"
    echo "   설정 내용:"
    cat /etc/nginx/sites-enabled/travel-storybook | grep -E "(root|index|server_name)"
else
    echo "⚠️  Nginx 설정 파일을 찾을 수 없습니다"
fi
echo ""

# 3. Nginx 상태 확인
echo "3. Nginx 상태:"
sudo systemctl status nginx --no-pager | head -10
echo ""

# 4. 파일 권한 확인
echo "4. 파일 권한 확인:"
ls -ld /var/www/travel-storybook/dist
echo ""

# 5. Nginx 에러 로그 확인 (최근 10줄)
echo "5. Nginx 에러 로그 (최근 10줄):"
sudo tail -10 /var/log/nginx/error.log 2>/dev/null || echo "로그 파일을 찾을 수 없습니다"
echo ""

# 6. Nginx 액세스 로그 확인 (최근 5줄)
echo "6. Nginx 액세스 로그 (최근 5줄):"
sudo tail -5 /var/log/nginx/access.log 2>/dev/null || echo "로그 파일을 찾을 수 없습니다"
echo ""

echo "=== 확인 완료 ==="


