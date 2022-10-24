cd %cd%\py
@echo off
title CrepeSR mitmdump
echo Do not delete this file. startserver.bat uses this file.
echo Use commands in the window titled "CrepePlus MITM Console"
timeout /t 3
echo Starting now...
mitmdump -s proxy.py -k
