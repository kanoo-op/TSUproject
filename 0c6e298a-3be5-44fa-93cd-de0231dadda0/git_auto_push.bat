@echo off
REM === 설정 부분 ===
REM 업로드할 프로젝트 폴더 경로로 바꿔줘
set REPO_DIR=C:\Users\pc000\.gemini\antigravity\brain\0c6e298a-3be5-44fa-93cd-de0231dadda0\TSUproject

REM 기본 브랜치 이름 (main 또는 master)
set BRANCH=main

REM === 스크립트 시작 ===
cd /d "%REPO_DIR%"

REM 변경 사항 확인
git status

REM 커밋 메시지 입력 받기 (없으면 날짜/시간 자동)
set MSG=%1
if "%MSG%"=="" (
    set MSG=auto commit %date% %time:~0,5%
)

echo.
echo [INFO] 커밋 메시지: %MSG%
echo.

REM 변경 파일 모두 추가
git add .

REM 커밋 실행
git commit -m "%MSG%"

REM GitHub로 푸시
git push origin %BRANCH%

echo.
echo [INFO] GitHub 업로드 완료!
pause
