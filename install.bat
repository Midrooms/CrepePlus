@echo off
START /commands/temp.bat
START /commands/help.bat
DEL readme.md
cls
@echo The window that just opened is the NPM installation.
@echo Please wait for that installation to finish. Only continue if the installation is complete. You might cancel the installation if you continue. (If the installation isn't done yet)
pause
DEL /commands/temp.bat
DEL install.bat
START startserver.bat
