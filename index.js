const { app, BrowserWindow } = require('electron')
const electron = require('electron')
const ipcMain = require('electron').ipcMain
const Menu = electron.Menu

Menu.setApplicationMenu(null)

let mainWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 768,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })

  mainWindow.loadFile('index.html')

  mainWindow.webContents.openDevTools()
}

app.allowRendererProcessReuse = true
app.disableHardwareAcceleration()

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

const dialog = electron.dialog
ipcMain.on('select-file-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile']
  }).then((obj) => {
    if(obj.filePaths[0]) event.sender.send('select-file', obj.filePaths[0])
  })
})

ipcMain.on('ondragstart', (event, arg) => {
  event.sender.send('select-file', arg)
})

let table
ipcMain.on('table', (event, arg) => {
  table = arg
})