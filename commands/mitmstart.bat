cd %cd%\CrepePackage
@echo off
title CrepeSR mitmdump
echo Do not delete this file. startserver.bat uses this file.
echo Use commands in the window titled "CrepeSR Command Console"
timeout /t 3
echo Starting now...
mitmdump -s proxy.py -k
