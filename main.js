const {app, BrowserWindow, Menu, ipcMain, nativeTheme, Tray, Notification, dialog} = require('electron');
const path = require('path');
const {spawn} = require('child_process');
const DiscordRPC = require('discord-rpc');
const config = require('./view/msconf');
const {request} = require('undici');
const download = require('download');
const pkgc = require("./package.json");
const fs = require("fs")
// set current version
const currentVersion = pkgc.version;

// main application
app.whenReady().then(() => {
    let isQuiting;

// functions
    async function getLatestVersion() {
        try {
            const msreq = await request('https://ps.rrryfoo.cf/api/str/CrepePlus/lsv');
            const {downloadLink, latestVersion, fileType, platform} = await msreq.body.json();
            const data = `
            <table>
                <platform>${platform}</platform> 
                <filetype>${fileType}</filetype> 
                <ver>${latestVersion}!${currentVersion}</ver> 
                <downloadlink>${downloadLink}</downloadlink>
                <requestedAt>${new Date() + ` (${Date.now()})`}</requestedAt>
            </table>`
            fs.writeFile("data/.requested.xml", data, err => {if (err) {console.error(err)} else return;});
            if (latestVersion === currentVersion) {
                await dialog.showMessageBox({
                    type: "error",
                    title: `You are already on the latest version.`,
                    detail: `Your current version is ${currentVersion}. The latest version is ${latestVersion}`
                })
            } else {
                const NtfT = 'Downloading...'
                const NtfD = `CrepePlus v${latestVersion} is being installed.`

                function showNotification() {
                    new Notification({title: NtfT, body: NtfD}).show()
                }

                const filePath = `${__dirname}\\download\\plus-${latestVersion}-${platform}-${fileType}`;
                await dialog.showMessageBox({
                    type: "question",
                    title: 'Are you sure you want to download the latest version?',
                    message: `CrepePlus v${latestVersion} will be installed at ${filePath}`,
                    buttons: [
                        `Download v${latestVersion}`,
                        "Cancel"
                    ],
                    icon: `${__dirname}/view/img/qm.png`,
                    cancelId: 0,
                    noLink: false,
                }).then((rs) => {
                    if (rs.response === 0) {
                        download(downloadLink, filePath)
                            .then(() => {
                                dialog.showMessageBox({
                                    type: "info",
                                    title: `CrepePlus v${latestVersion} has been installed.`,
                                    detail: `CrepePlus ${latestVersion} has been installed at ${filePath}`
                                })
                                console.log(`Successfully installed CrepePlus at ${filePath}`);
                            })
                        // show message when downloading
                        showNotification()
                    } else {
                        new Notification({title: "Canceled download."}).show()
                    }
                })
            }
        } catch (err) {
            // catch error
            console.error(err);
        }
    }

    function runCrepePlusBat1() {

        const batchFile = `${__dirname}/view/runner/RunCrepeSR.bat`;
        // Spawn a new process to run the batch file
        const child = spawn('cmd.exe', ['/c', batchFile]);
        rpc.setActivity({
            details: config.onlineDeta,
            state: config.onlineState,
            startTimestamp,
            largeImageKey: config.onlineLargeImageKey,
            largeImageText: config.onlineLargeImageText,
            smallImageKey: config.onlineSmallImageKey,
            smallImageText: config.onlineSmallImageText,
            instance: false,
        });
        // Listen for any output from the batch file
        child.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        // Listen for any errors from the batch file
        child.stderr.on('data', (data) => {
            console.error(data.toString());
        });
    }

    function npm() {

        const batchFile = `${__dirname}/view/runner/npm.bat`;

        // Spawn a new process to run the batch file
        const child = spawn('cmd.exe', ['/c', batchFile]);

        // Listen for any output from the batch file
        child.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        // Listen for any errors from the batch file
        child.stderr.on('data', (data) => {
            console.error(data.toString());
        });
    }


    function createWindow() {
        const mainmenu = [
            {
                label: 'CrepePlus',
                click(menuItem, browserWindow, event) {
                    browserWindow.loadURL(`file://${__dirname}/view/htm/index.html`)
                }
            },
            {
                label: 'Credits',
                click(menuItem, browserWindow, event) {
                    browserWindow.loadURL(`file://${__dirname}/view/htm/cred.html`)
                }
            },
            {
                label: 'Tutorial',
                click() {
                    const docWindow = new BrowserWindow({
                        height: 600,
                        width: 1200,
                        icon: `${__dirname}/view/img/favicon.ico`,
                        show: true
                    })
                    docWindow.removeMenu();
                    docWindow.loadFile(`view/htm/doc.html`);
                }
            },
            {
                label: 'Check for updates',
                click() {
                    getLatestVersion()
                }
            },
            {
                label: 'Start CrepePlus',
                submenu: [
                    {
                        label: 'Start CrepeSR',
                        click() {
                            runCrepePlusBat1();
                        }
                    },
                    {
                        label: 'Install NPM Modules (do this before starting CrepeSR)',
                        click() {
                            npm();
                        }
                    },
                ]
            },
            {
                label: 'Minimize to system tray',
                click() {
                    win.hide();
                }
            },
            {
                label: 'Exit',
                click: app.quit,
            }
        ];
        // set app menu (top bar)
        const menu = Menu.buildFromTemplate(mainmenu);
        Menu.setApplicationMenu(menu);
        // create browser window
        const win = new BrowserWindow({
            width: 1230,
            height: 700,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: true,
            },
            icon: `${__dirname}/view/img/favicon.ico`,
            show: true
        })
        win.loadFile('view/htm/index.html');
        win.on("close", function (event) {
            if (isQuiting) {
                event.preventDefault();
                win.hide();
            } else
                return win.destroy()
        })
        // system tray context menu
        let tray = new Tray(`${__dirname}/view/img/favicon.ico`)
        const cMenu = Menu.buildFromTemplate([
            {
                label: 'Quit CrepePlus',
                type: 'normal',
                click: function () {
                    isQuiting = true;
                    app.quit();
                }
            },
            {
                label: 'Check for updates',
                type: 'normal',
                click: function () {
                    getLatestVersion();
                }
            }
        ])
        tray.on('click', () => {
            win.show();
        })
        tray.setToolTip('CrepePlus');
        tray.setContextMenu(cMenu);
    }

    console.log(`Window loaded at ${__dirname}`);
    // handle dark mode
    ipcMain.handle('dark-mode:toggle', () => {
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = 'light'
        } else {
            nativeTheme.themeSource = 'dark'
        }
        return nativeTheme.shouldUseDarkColors
    })
    createWindow()
});
const rpc = new DiscordRPC.Client({transport: 'ipc'});
const clientId = config.clientID;
// set rpc

// Only needed if you want to use spectate, join, or ask to join
DiscordRPC.register(clientId);


const startTimestamp = new Date();

async function setActivity() {

    return rpc.setActivity({
        details: config.offlineDeta,
        state: `${config.status}`,
        startTimestamp,
        largeImageKey: config.offlineLargeImageKey,
        largeImageText: config.offlineLargeImageText,
        smallImageKey: config.offlineSmallImageKey,
        smallImageText: config.offlineSmallImageText,
        instance: false,
    });
}

ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
})
rpc.on('ready', () => {
    setActivity().then();
});
rpc.login({clientId}).catch(console.error)


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

// create shortcut if installed with squirrel
if (require("electron-squirrel-startup")) {
    app.quit();
}