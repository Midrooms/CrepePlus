@echo off
START %cd%\resources\app\view\runner\MITMStart.bat
net start MongoDB
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer /t REG_SZ /d http://127.0.0.1:8080 /f
cd %cd%\resources\app\view\runner\CrepePackage
npm run start
pause