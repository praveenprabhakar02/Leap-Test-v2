@echo off
cd /d %~dp0source
call npm install
call npm run build
xcopy /E /I /Y dist\* ..\
echo Production site rebuilt at repository root.
