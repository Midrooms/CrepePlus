@echo off
md %cd%\temp\msg
@echo x=msgbox("Starting CrepeSR package installation at %cd%\app\resources\view\runner. This may take a while."  ,0, "Installing CrepeSR Package") > %cd%\temp\msg\icp.vbs
wscript %cd%\temp\msg\icp.vbs
powershell -Command "Invoke-WebRequest https://ps.rrryfoo.cf/CrepePackage.zip -Outfile CrepePackage.zip"
powershell -Command "Expand-Archive -Path %cd%\CrepePackage.zip %cd%\resources\app\view\runner\CrepePackage"
DEL CrepePackage.zip
@echo x=msgbox("CrepeSR package has been installed successfully."  ,0, "Done installing") > %cd%\temp\msg\instd.vbs
wscript %cd%\temp\msg\instd.vbs
DEL %cd%\temp\msg\icp.vbs
DEL %cd%\temp\msg\instd.vbs
RD /S /Q "%cd%\temp\msg"