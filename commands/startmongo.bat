@echo off
net start MongoDB
echo Did it start MongoDB?
echo If it didn't, run this batchfile as administrator.
echo OR, start it manually, using the Task Manager. Continue if you would like to know how.
pause
cls
start "\Windows\System32\taskmgr.exe"
echo Click on services, then find "MongoDB"
pause
echo Right click on it, then click "Start"
pause
cls
If MongoDB isn't there, then you have to install it yourself.
pause
exit
