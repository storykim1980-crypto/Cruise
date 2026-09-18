# 서버 등록(배포) 가이드

## 핵심 답변

> **ZIP을 그대로 서버에 올리지 않습니다.** ZIP은 '운반용 묶음'일 뿐이고,
> 웹서버는 **풀린 상태의 파일 구조**(`index.html`, `css/`, `js/`, `data/`, `img/`, `en/`)를 그대로 읽습니다.
> 모바일에서 압축을 풀 필요 없는 방법 3가지 ↓

## 방법 A — 이 작업공간에서 바로 git push (추천)

1. GitHub에서 **Fine-grained Personal Access Token** 발급
   - github.com → Settings → Developer settings → Personal access tokens → Fine-grained
   - 권한: 대상 리포지토리만 + **Contents: Read and write**
   - 만료: 7~30일 (사용 후 폐기 가능)
2. 토큰과 리포지토리 주소(`https://github.com/아이디/레포.git`)를 이 채팅에 전달
3. 여기서 `git remote add origin …` → `git push` 한 번으로 완료
4. 서버가 GitHub Pages / Vercel / Netlify / Cloudflare Pages 연동이라면 **push 후 자동 배포**

> 보안: 토큰은 리포지토리 하나만・단기 만료로 발급하세요. 작업 완료 후 GitHub에서 revoke하면 됩니다.

## 방법 B — 호스팅 파일관리자에서 ZIP 업로드 + 서버에서 풀기

Cafe24・후이즈・gabiya 등 일반 호스팅은 파일관리자에 **ZIP 업로드 → 서버측 압축해제** 기능이 있습니다.
- 모바일에서도 업로드만 하면 되고, **압축 해제는 서버가 하므로 폰에서 풀 필요 없음**
- 주의: 기존 폴더에 덮어쓸 때 `img/` 등 대용량은 시간 걸림 / 루트 위치에 풀리기 확인

## 방법 C — GitHub 웹에서 파일 업로드

- PC: 리포지토리 → 폴더 이동 → Add file → Upload files (드래그&드롭, 폴더 단위 가능)
- 모바일 브라우저: 가능하지만 **폴더 구조(css/, js/, en/…)를 하나씩 맞춰 올려야 해서 비추천**
- 수정 파일 목록은 채팅의 📋 목록 참조

## 수정분만 반영할 때 (증분 업데이트)

전체 ZIP 대신 아래 파일만 교체하면 됩니다:

```
css/styles.css
js/i18n.js  js/ship.js  js/photo.js
data/photos.json
index.html photos.html photo.html ships.html ship.html
photographers.html photographer.html schedule.html terminals.html about.html
en/ (위와 동일 10개)
```

## 로컬 확인

```bash
python3 -m http.server 8080   # → http://localhost:8080 (JA) / /en/ (EN)
```
