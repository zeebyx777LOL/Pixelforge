const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('pixelForge', {
  saveImage: (dataUrl) => ipcRenderer.invoke('save-image', dataUrl)
});
