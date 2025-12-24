#!/bin/bash

# 배포 상태 전체 확인 스크립트
# 서버에서 실행: bash check-all.sh

echo "=========================================="
echo "  배포 상태 전체 확인"
echo "=========================================="
echo ""

# 1. dist 폴더 구조 확인
echo "1. dist 폴더 구조:"
if [ -d "/var/www/travel-storybook/dist" ]; then
    echo "✅ dist 폴더 존재"
    tree -L 2 /var/www/travel-storybook/dist 2>/dev/null || find /var/www/travel-storybook/dist -maxdepth 2 -type f -o -type d | head -20
else
    echo "❌ dist 폴더가 없습니다!"
    exit 1
fi
echo ""

# 2. 모든 파일의 수정 시간 확인
echo "2. 모든 파일의 수정 시간:"
find /var/www/travel-storybook/dist -type f -exec ls -lh {} \; | awk '{print $6, $7, $8, "->", $9}'
echo ""

# 3. assets 폴더 확인
echo "3. assets 폴더 파일 상세:"
if [ -d "/var/www/travel-storybook/dist/assets" ]; then
    echo "파일 목록:"
    ls -lh /var/www/travel-storybook/dist/assets/
    echo ""
    echo "MD5 해시:"
    md5sum /var/www/travel-storybook/dist/assets/* 2>/dev/null || echo "md5sum 명령어를 사용할 수 없습니다"
else
    echo "❌ assets 폴더가 없습니다!"
fi
echo ""

# 4. index.html 확인
echo "4. index.html 내용:"
if [ -f "/var/www/travel-storybook/dist/index.html" ]; then
    echo "수정 시간: $(ls -lh /var/www/travel-storybook/dist/index.html | awk '{print $6, $7, $8}')"
    echo "참조하는 파일:"
    grep -E "assets.*\.(js|css)" /var/www/travel-storybook/dist/index.html
    echo ""
    echo "참조된 파일 존재 여부:"
    JS_FILE=$(grep -oP 'src="/assets/[^"]+\.js"' /var/www/travel-storybook/dist/index.html | head -1 | sed 's/src="//;s/"//')
    CSS_FILE=$(grep -oP 'href="/assets/[^"]+\.css"' /var/www/travel-storybook/dist/index.html | head -1 | sed 's/href="//;s/"//')
    
    if [ -n "$JS_FILE" ]; then
        if [ -f "/var/www/travel-storybook/dist$JS_FILE" ]; then
            echo "✅ $JS_FILE 존재"
        else
            echo "❌ $JS_FILE 없음!"
        fi
    fi
    
    if [ -n "$CSS_FILE" ]; then
        if [ -f "/var/www/travel-storybook/dist$CSS_FILE" ]; then
            echo "✅ $CSS_FILE 존재"
        else
            echo "❌ $CSS_FILE 없음!"
        fi
    fi
else
    echo "❌ index.html이 없습니다!"
fi
echo ""

# 5. Nginx 설정 확인
echo "5. Nginx 설정:"
if [ -f "/etc/nginx/sites-enabled/travel-storybook" ]; then
    echo "✅ 설정 파일 존재"
    echo "root 경로:"
    grep -E "^[[:space:]]*root" /etc/nginx/sites-enabled/travel-storybook || echo "root 설정을 찾을 수 없습니다"
else
    echo "⚠️  Nginx 설정 파일을 찾을 수 없습니다"
fi
echo ""

# 6. 파일 권한 확인
echo "6. 파일 권한:"
ls -ld /var/www/travel-storybook/dist
ls -ld /var/www/travel-storybook/dist/assets 2>/dev/null || echo "assets 폴더 권한 확인 불가"
echo ""

# 7. Nginx 상태 확인
echo "7. Nginx 상태:"
sudo systemctl is-active nginx && echo "✅ Nginx 실행 중" || echo "❌ Nginx 실행 안 됨"
echo ""

# 8. HTTP 응답 테스트
echo "8. HTTP 응답 테스트:"
curl -I http://localhost/ 2>/dev/null | head -5
echo ""

echo "=========================================="
echo "  확인 완료"
echo "=========================================="


