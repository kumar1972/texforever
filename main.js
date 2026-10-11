const {
  app,
  BrowserWindow,
  dialog,
  ipcMain
} = require('electron');

const path = require('path');
const fs = require('fs');

let selectedStorageFolder = null;

/* ------------------------------------------------------------
   Remember the selected folder after app restart
------------------------------------------------------------ */
function configFilePath() {
  return path.join(app.getPath('userData'), 'storage-config.json');
}

function loadSavedFolder() {
  try {
    const cfg = JSON.parse(fs.readFileSync(configFilePath(), 'utf8'));
    if (cfg && cfg.folder && fs.existsSync(cfg.folder)) {
      selectedStorageFolder = cfg.folder;
    }
  } catch (e) {
    /* no saved config yet */
  }
}

function persistFolder() {
  try {
    fs.writeFileSync(
      configFilePath(),
      JSON.stringify({ folder: selectedStorageFolder }),
      'utf8'
    );
  } catch (e) {
    console.error('Could not save folder config:', e.message);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, 'icon-512.png'),

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

/* ------------------------------------------------------------
   Select Storage Folder
------------------------------------------------------------ */
ipcMain.handle('select-storage-folder', async (event) => {
  const parent = BrowserWindow.fromWebContents(event.sender);

  const result = await dialog.showOpenDialog(parent, {
    title: 'Select TEXFOREVER Data Folder',
    properties: ['openDirectory', 'createDirectory']
  });

  if (result.canceled || result.filePaths.length === 0) {
    return {
      success: false,
      message: 'Folder selection cancelled'
    };
  }

  selectedStorageFolder = result.filePaths[0];
  persistFolder();

  return {
    success: true,
    folder: selectedStorageFolder
  };
});

/* ------------------------------------------------------------
   Get currently selected folder
------------------------------------------------------------ */
ipcMain.handle('get-storage-folder', async () => {
  return {
    success: !!selectedStorageFolder,
    folder: selectedStorageFolder
  };
});

/* ------------------------------------------------------------
   Save ERP Data
------------------------------------------------------------ */
ipcMain.handle('save-erp-data', async (event, data) => {
  try {
    if (!selectedStorageFolder) {
      return {
        success: false,
        message: 'Please select a storage folder first'
      };
    }

    const filePath = path.join(selectedStorageFolder, 'texforever_data.json');

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(data, null, 2),
      'utf8'
    );

    return {
      success: true,
      message: 'Data saved successfully',
      filePath
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});

/* ------------------------------------------------------------
   Load ERP Data
------------------------------------------------------------ */
ipcMain.handle('load-erp-data', async () => {
  try {
    if (!selectedStorageFolder) {
      return {
        success: false,
        message: 'Please select a storage folder first'
      };
    }

    const filePath = path.join(selectedStorageFolder, 'texforever_data.json');

    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        message: 'No saved data found'
      };
    }

    const raw = await fs.promises.readFile(filePath, 'utf8');

    return {
      success: true,
      data: JSON.parse(raw)
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});

/* ------------------------------------------------------------
   Save Backup file (JSON / CSV) into the selected folder
------------------------------------------------------------ */
ipcMain.handle('save-backup', async (event, payload) => {
  try {
    if (!selectedStorageFolder) {
      return {
        success: false,
        message: 'Please select a storage folder first'
      };
    }

    if (!payload || !payload.fileName || typeof payload.content !== 'string') {
      return {
        success: false,
        message: 'Invalid backup payload'
      };
    }

    // path.basename blocks "../" path tricks
    const safeName = path.basename(String(payload.fileName));
    const filePath = path.join(selectedStorageFolder, safeName);

    await fs.promises.writeFile(filePath, payload.content, 'utf8');

    return {
      success: true,
      message: 'Backup saved successfully',
      filePath
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
});

app.whenReady().then(() => {
  loadSavedFolder();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
