const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('texforeverStorage', {
  selectFolder: () => ipcRenderer.invoke('select-storage-folder'),
  getFolder: () => ipcRenderer.invoke('get-storage-folder'),
  saveErpData: (data) => ipcRenderer.invoke('save-erp-data', data),
  loadErpData: () => ipcRenderer.invoke('load-erp-data'),
  saveBackup: (fileName, content) =>
    ipcRenderer.invoke('save-backup', { fileName, content })
});
