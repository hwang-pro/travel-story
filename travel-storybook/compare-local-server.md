# 로컬과 서버 파일 비교 가이드

## 1단계: 로컬에서 빌드 확인

```bash
cd travel-storybook
npm run build
```

## 2단계: 로컬 파일의 MD5 해시 확인

**Windows PowerShell에서:**
```powershell
cd travel-storybook\dist\assets
Get-FileHash *.js,*.css -Algorithm MD5 | Format-Table Hash, Path -AutoSize
```

**또는 Git Bash에서:**
```bash
cd travel-storybook/dist/assets
md5sum *.js *.css
```

## 3단계: 서버 파일과 비교

서버 파일의 MD5 해시:
- firebase-vendor-CbbNmGk3.js: `51fde3a9639225487a466342207a09bb`
- index-BRa1dnYp.js: `d387c191d819d6a4a2728c1437f9162f`
- index-D84V3Kyg.css: `0005f8b55e98dd18345816f796967b59`
- react-vendor-BX-pWk1x.js: `18239fb5db71faefbe9895588c448061`

## 4단계: 파일명 비교

로컬에서 생성된 파일명이 서버와 같은지 확인:
```bash
# 로컬에서
ls dist/assets/
```

서버 파일명:
- index-BRa1dnYp.js
- index-D84V3Kyg.css
- firebase-vendor-CbbNmGk3.js
- react-vendor-BX-pWk1x.js

**만약 파일명이 다르다면** → 코드가 변경되어 새로 빌드된 것입니다. 새 파일을 서버에 업로드해야 합니다.

**만약 파일명이 같다면** → MD5 해시를 비교해서 내용이 같은지 확인하세요.


