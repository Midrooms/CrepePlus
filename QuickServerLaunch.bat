@echo off
cd %cd%/CrepePackage
START /commands/mitmstart.bat
echo If you get "Global Distribution Error", please turn on the MongoDB service, and remember to open MongoDB Compass and connect to a server.
npm run start
