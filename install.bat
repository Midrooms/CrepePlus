@echo off
echo Welcome to CrepePlus!
echo Would you like to continue the installation?
pause
cls
START /commands/temp.bat
START /commands/help.bat
DEL readme.md
DEL LICENSE
cls
@echo The window that just opened is the NPM installation.
@echo Please wait for that installation to finish. Only continue if the installation is complete. You might cancel the installation if you continue. (If the installation isn't done yet)
pause
DEL /commands/temp.bat
START startserver.bat
START /commands/firstrunmessage.bat
DEL install.bat
