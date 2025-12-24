#!/bin/bash

# 배포 디버깅 스크립트
# 서버에서 실행: bash debug-deployment.sh

echo "=== 배포 디버깅 정보 ==="
echo ""

# 1. dist 폴더 전체 구조 확인
echo "1. dist 폴더 구조:"
tree -L 3 /var/www/travel-storybook/dist 2>/dev/null || find /var/www/travel-storybook/dist -type f | head -20
echo ""

# 2. 모든 파일의 수정 시간 확인
echo "2. dist 폴더 내 모든 파일의 수정 시간:"
find /var/www/travel-storybook/dist -type f -exec ls -lh {} \; | awk '{print $6, $7, $8, $9}'
echo ""

# 3. assets 폴더 확인
echo "3. assets 폴더 내용:"
if [ -d "/var/www/travel-storybook/dist/assets" ]; then
    ls -lh /var/www/travel-storybook/dist/assets/
    echo ""
    echo "   파일 개수: $(ls -1 /var/www/travel-storybook/dist/assets/ | wc -l)"
else
    echo "❌ assets 폴더가 없습니다!"
fi
echo ""

# 4. index.html 내용 확인 (첫 20줄)
echo "4. index.html 내용 (첫 20줄):"
head -20 /var/www/travel-storybook/dist/index.html
echo ""

# 5. Nginx 설정 전체 확인
echo "5. Nginx 설정 파일 전체 내용:"
sudo cat /etc/nginx/sites-enabled/travel-storybook
echo ""

# 6. Nginx가 실제로 서빙하는 파일 확인
echo "6. Nginx 프로세스 확인:"
ps aux | grep nginx | grep -v grep
echo ""

# 7. 포트 80 리스닝 확인
echo "7. 포트 80 리스닝 확인:"
sudo netstat -tlnp | grep :80 || sudo ss -tlnp | grep :80
echo ""

# 8. curl로 로컬에서 테스트
echo "8. 로컬에서 HTTP 응답 테스트:"
curl -I http://localhost/ 2>/dev/null | head -10
echo ""

echo "=== 디버깅 완료 ==="


