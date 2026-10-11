const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopPrint', {
  isDesktop: true,
  listPrinters: () => ipcRenderer.invoke('printers:list'),
  printHtml: (html, options = {}) =>
    ipcRenderer.invoke('print:html', { html, ...options })
});
