@echo off
START temp.bat
cls
@echo The window that just opened is the NPM installation.
@echo Please wait for that installation to finish. Close that after, then press any key to continue.
pause
DEL temp.bat
DEL readme.md
DEL install.bat
