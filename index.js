const { app, BrowserWindow, Menu, ipcMain, nativeTheme } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const DiscordRPC = require('discord-rpc');
const config = require('./view/rpc-config');
// functions
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
const menuTemplate = [
  {
    label: 'CrepePlus',
    click(menuItem, browserWindow, event) {
      browserWindow.loadURL(`file://${__dirname}/view/index.html`)
    }
  },
  {
    label: 'Credits',
    click(menuItem, browserWindow, event) {
      browserWindow.loadURL(`file://${__dirname}/view/cred.html`)
    }
  },
  {
    label: 'Tutorial',
    click(menuItem, browserWindow, event) {
      browserWindow.loadURL(`file://${__dirname}/view/doc.html`)
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
    label: 'Exit',
    click: app.quit,
  }
];



app.on('ready', () => {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const clientId = config.clientID;
function createWindow() {
  const win = new BrowserWindow({
    width: 1260,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
    icon: `${__dirname}/view/favicon.ico`
  })
  win.loadFile('view/index.html');
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
}
// set rpc


  // Only needed if you want to use spectate, join, or ask to join
  DiscordRPC.register(clientId);


  const startTimestamp = new Date();

  async function setActivity() {

    rpc.setActivity({
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
  setActivity();
});
rpc.login({ clientId }).catch(console.error);

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})