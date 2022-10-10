cd %cd%\CrepePackage
@echo off
title CrepeSR mitmdump
echo Do not delete this file. QuickServerLaunch.bat uses this file.
echo Use commands in "CrepeSR Command Console"
timeout /t 3
echo Starting now...
mitmdump -s proxy.py -k
