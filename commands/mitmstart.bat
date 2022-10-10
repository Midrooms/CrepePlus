cd %cd%\CrepePackage
@echo off
title CrepeSR mitmdump
echo Do not delete this file. QuickServerLaunch.bat uses this file.
mitmdump -s proxy.py -k
