@cd %cd%\resources\app\view\runner\CrepePackage\py
@echo off
title CrepeSR mitmdump
echo NOTE: mitmdump might not let you open sites/connect to any service that requires you to be connected to the internet, until you turn off the "Use a proxy server" option.
timeout /t 5
mitmdump -s proxy.py -k