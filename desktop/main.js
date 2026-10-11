const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const wwwDir = app.isPackaged
  ? path.join(process.resourcesPath, 'www')
  : path.join(__dirname, '..', 'www');

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'TEX FOR EVER',
    icon: path.join(wwwDir, 'icon-512.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenuBarVisibility(false);
  win.loadFile(path.join(wwwDir, 'index.html'));
}

// Windows-ல் நிறுவியுள்ள எல்லா printers-ஐயும் (Wi-Fi, USB) பட்டியலிடும்
ipcMain.handle('printers:list', async (event) => {
  return event.sender.getPrintersAsync();
});

// HTML-ஐ A4 printer-க்கு அனுப்பும்
ipcMain.handle('print:html', async (_event, { html, deviceName, silent }) => {
  const tmpFile = path.join(app.getPath('temp'), `print-${Date.now()}.html`);
  fs.writeFileSync(tmpFile, html, 'utf8');

  const printWin = new BrowserWindow({
    show: false,
    webPreferences: { contextIsolation: true }
  });

  try {
    await printWin.loadFile(tmpFile);

    return await new Promise((resolve, reject) => {
      printWin.webContents.print(
        {
          silent: !!silent,           // true = dialog இல்லாமல் நேரடியாக print
          printBackground: true,
          deviceName: deviceName || undefined,
          pageSize: 'A4'
        },
        (success, reason) => {
          if (success) resolve(true);
          else reject(new Error(reason || 'Print failed'));
        }
      );
    });
  } finally {
    printWin.close();
    fs.unlink(tmpFile, () => {});
  }
});

app.whenReady().then(() => {
  createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
