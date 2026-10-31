const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1500, height: 950, minWidth: 1050, minHeight: 700,
    backgroundColor: '#111318',
    title: 'PixelForge',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}
app.whenReady().then(() => {
  ipcMain.handle('save-image', async (_event, dataUrl) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Export image', defaultPath: 'pixelforge-export.png',
      filters: [{ name: 'PNG Image', extensions: ['png'] }, { name: 'JPEG Image', extensions: ['jpg', 'jpeg'] }]
    });
    if (canceled || !filePath) return { canceled: true };
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
    return { canceled: false, filePath };
  });
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
