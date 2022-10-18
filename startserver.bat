@echo off
title CrepePlus MITM Console - v1.4.2 (CrepeSR v1.0)
cd %cd%\commands
START /commands/mitmstart.bat
echo If you get "Global Distribution Error", please turn on the MongoDB service, and remember to open MongoDB Compass and connect to a server.
cd %cd%/CrepePackage
npm run start