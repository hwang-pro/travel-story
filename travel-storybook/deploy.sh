#!/bin/bash

# JCloud 배포 스크립트
# 사용법: ./deploy.sh [서버주소] [사용자명] [서버경로]

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 JCloud 배포 시작...${NC}"

# 인자 확인
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo -e "${RED}❌ 사용법: ./deploy.sh [서버주소] [사용자명] [서버경로]${NC}"
    echo -e "${YELLOW}예시: ./deploy.sh jcloud.example.com ubuntu /var/www/travel-storybook${NC}"
    exit 1
fi

SERVER=$1
USER=$2
SERVER_PATH=$3

echo -e "${YELLOW}📦 빌드 중...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ dist 폴더가 생성되지 않았습니다.${NC}"
    exit 1
fi

echo -e "${YELLOW}📤 서버로 업로드 중...${NC}"
echo -e "${YELLOW}   서버: ${USER}@${SERVER}${NC}"
echo -e "${YELLOW}   경로: ${SERVER_PATH}/dist${NC}"

# 서버에 디렉토리 생성 (없는 경우)
ssh ${USER}@${SERVER} "mkdir -p ${SERVER_PATH}/dist"

# 파일 업로드
scp -r dist/* ${USER}@${SERVER}:${SERVER_PATH}/dist/

echo -e "${GREEN}✅ 업로드 완료!${NC}"
echo -e "${YELLOW}⚠️  서버에서 다음 명령어를 실행하세요:${NC}"
echo -e "   sudo systemctl reload nginx"
echo -e "   또는"
echo -e "   sudo systemctl restart nginx"



