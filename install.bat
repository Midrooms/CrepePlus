@echo off
START temp.bat
cls
@echo The window that just opened is the NPM installation.
@echo Please wait for that installation to finish. Only continue if the installation is complete.
pause
DEL temp.bat
DEL readme.md
DEL install.bat
