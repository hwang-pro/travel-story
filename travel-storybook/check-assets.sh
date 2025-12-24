#!/bin/bash

# 서버의 assets 파일 확인 스크립트
# 서버에서 실행: bash check-assets.sh

echo "=== 서버 assets 파일 확인 ==="
echo ""

# 1. assets 폴더 존재 확인
if [ ! -d "/var/www/travel-storybook/dist/assets" ]; then
    echo "❌ assets 폴더가 없습니다!"
    exit 1
fi

echo "1. assets 폴더 파일 목록:"
ls -lh /var/www/travel-storybook/dist/assets/
echo ""

# 2. 각 파일의 상세 정보
echo "2. 파일 상세 정보:"
for file in /var/www/travel-storybook/dist/assets/*; do
    if [ -f "$file" ]; then
        echo "파일: $(basename $file)"
        echo "  크기: $(ls -lh "$file" | awk '{print $5}')"
        echo "  수정 시간: $(ls -lh "$file" | awk '{print $6, $7, $8}')"
        echo "  MD5 해시: $(md5sum "$file" | awk '{print $1}')"
        echo ""
    fi
done

# 3. index.html에서 참조하는 파일 확인
echo "3. index.html에서 참조하는 파일:"
grep -E "(assets|\.js|\.css)" /var/www/travel-storybook/dist/index.html
echo ""

# 4. 참조된 파일들이 실제로 존재하는지 확인
echo "4. 참조된 파일 존재 여부:"
JS_FILE=$(grep -oP 'src="/assets/[^"]+\.js"' /var/www/travel-storybook/dist/index.html | sed 's/src="//;s/"//')
CSS_FILE=$(grep -oP 'href="/assets/[^"]+\.css"' /var/www/travel-storybook/dist/index.html | sed 's/href="//;s/"//')

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

echo ""
echo "=== 확인 완료 ==="


