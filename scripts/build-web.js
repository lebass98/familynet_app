const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Expo Web 정적 빌드를 시작합니다...');
execSync('npx expo export --platform web', { stdio: 'inherit' });

const distPath = path.resolve(__dirname, '..', 'dist');

// 1. .nojekyll 생성: GitHub Pages의 Jekyll 엔진이 _expo 폴더를 무시하지 않도록 방지
fs.writeFileSync(path.join(distPath, '.nojekyll'), '');
console.log('✅ .nojekyll 생성 완료 (_expo 정적 에셋 서빙 보장)');

// 2. 404.html 생성: SPA 직접 접근 및 새로고침 시 404 에러 방지
fs.copyFileSync(path.join(distPath, 'index.html'), path.join(distPath, '404.html'));
console.log('✅ 404.html 생성 완료 (SPA 클라이언트 라우팅 지원)');

console.log('🎉 GitHub Pages 배포용 웹 빌드가 완료되었습니다!');
