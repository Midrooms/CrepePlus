@echo off
cd %cd%\resources\app\view\runner\CrepePackage
npm i --save-dev @types/node
npm install
timeout /t 3
exit