@echo off
START temp.bat
START help.bat
DEL readme.md
cls
@echo The window that just opened is the NPM installation.
@echo Please wait for that installation to finish. Only continue if the installation is complete. You might cancel the installation if you continue. (If the installation isn't done yet)
pause
DEL temp.bat
DEL install.bat
