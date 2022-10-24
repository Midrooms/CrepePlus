@echo off
title CrepePlus MITM Console - v1.4.3 (CrepeSR v1.0)
cd %cd%\commands
START /mitmstart.bat
echo This is a fork of https://github.com/Midrooms/CrepePlus, but just edited to make it run CrepeSR with MITM.
echo If you get "Global Distribution Error", please turn on the MongoDB service, and remember to open MongoDB Compass and connect to a server.
cd %cd%/CrepePackage
npm run start
