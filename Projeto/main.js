 
const {app, BrowserWindow} = require('electron') 
const url = require('url') 
const path = require('path')  

let win  

function createWindow() { 
  win = new BrowserWindow({
    width: 800, 
    height: 600, 
    webPreferences: {
      nodeIntegrationInWorker: true
    }
  }) 
  
  win.loadURL(url.format ({ 
    pathname: path.join(__dirname, 'index.html'), 
    protocol: 'file:', 
    slashes: true 
  }))
  
  //win.webContents.openDevTools()
}  

app.on('browser-window-created',function(e,window) {
  window.setMenu(null);
});

app.on('ready', createWindow) 
