
const {app, BrowserWindow} = require('electron')
var fs = require('fs');
var remote = require('electron').remote;
var path = require("path");
let mainWindow;
var initPath = initPath = __dirname + "/window-state.json";

app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

function createWindow () 
{
  var data;
  try { data = JSON.parse(fs.readFileSync(initPath, 'utf8')); } catch(e) { }
  
  var x = 10;
  var y = 10;
  var width = 1000;
  var height = 700;
  var stateSaved = false;
  var maximizedState = false;
  
  if (data && data.bounds) 
  {
    stateSaved = true;
    x = data.bounds.x;
    y = data.bounds.y;
    width = data.bounds.width;
    height = data.bounds.height;
    
    if (data.maximized == true)
      maximizedState = true;
  }

  mainWindow = new BrowserWindow({
    show: false,
    x: x, 
    y: y, 
    width: width, 
    height: height,
    webPreferences: {
      webSecurity: false,
      nodeIntegrationInWorker: true
    },
    nodeIntegration: false,
    useContentSize: true,
    icon: __dirname + '/ico/icone200px.ico'
  });
  
  mainWindow.loadFile('index.html')
  mainWindow.setMenu(null);
  
  if (stateSaved == false) {
    mainWindow.maximize();
  } else if (stateSaved == true && maximizedState == true) {
    mainWindow.maximize();
  }

  mainWindow.show();
  //mainWindow.webContents.openDevTools();
  
  mainWindow.on('closed', function () {
    mainWindow = null
  });  
  
  mainWindow.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
      mainWindow.quit();
    }
  });

  mainWindow.on("close", function() {
    var maximized = false;
    if (mainWindow.isMaximized())
      maximized = true;
    var data = {
      bounds: mainWindow.getBounds(),
      maximized: maximized
    };
    if (initPath.toString().length > 0) {
      fs.writeFileSync(initPath, JSON.stringify(data));
    }
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

const { ipcMain } = require('electron')
const { session } = require('electron')

ipcMain.on('open-dev-tools', (event, arg) => {
  mainWindow.webContents.openDevTools();
})

/**
 * Controle da tradução do Google através da página web (texto completo).
 */
var GoogleCurrentTextTranslated = null

ipcMain.on('google-translate-finished-text', (event, arg) => {
  GoogleCurrentTextTranslated = arg
})

ipcMain.on('google-translate-finished-text-check', (event, arg) => {
  if (GoogleCurrentTextTranslated != null) {
    if (arg)
      if (arg == 'check')
      {
        event.sender.send('google-translate-finished-text-check-reply', GoogleCurrentTextTranslated)
        GoogleCurrentTextTranslated = null
      }
  }
})

/**
 * Controle da tradução do Google através da página web (palavra por palavra).
 */
var GoogleCurrentWordTranslated = null

ipcMain.on('google-translate-finished-word', (event, arg) => {
  GoogleCurrentWordTranslated = arg
})

ipcMain.on('google-translate-finished-word-check', (event, arg) => {
  if (GoogleCurrentWordTranslated != null) {
    if (arg)
      if (arg == 'check')
      {
        event.sender.send('google-translate-finished-word-check-reply', GoogleCurrentWordTranslated)
        GoogleCurrentWordTranslated = null
      }
  }
})

/**
 * Controle do processamento da tradução complexa - Captura de informações.
 */
var CurrentDataComplexTranslation = null

ipcMain.on('grab-information-word-1', (event, arg) => {
  CurrentDataComplexTranslation = arg
})

ipcMain.on('grab-information-word-1-check', (event, arg) => {
  if (CurrentDataComplexTranslation != null) {
    if (arg)
      if (arg == 'check')
      {
        event.sender.send('grab-information-word-1-check-reply', CurrentDataComplexTranslation)
        CurrentDataComplexTranslation = null
      }
  }
})

/**
 * Controle do processamento da tradução complexa - Tradução das listas dos itens.
 */
var CurrentDataComplexTranslationGoogle = null

ipcMain.on('grab-information-word-2', (event, arg) => {
  CurrentDataComplexTranslationGoogle = arg
})

ipcMain.on('grab-information-word-2-check', (event, arg) => {
  if (CurrentDataComplexTranslationGoogle != null) {
    if (arg)
      if (arg == 'check')
      {
        event.sender.send('grab-information-word-2-check-reply', CurrentDataComplexTranslationGoogle)
        CurrentDataComplexTranslationGoogle = null
      }
  }
})

/**
 * Controle do processamento da tradução complexa - Tradução do campo da gramática.
 */
var CurrentDataComplexTranslationGoogle = null

ipcMain.on('grab-information-word-3', (event, arg) => {
  CurrentDataComplexTranslationGoogle = arg
})

ipcMain.on('grab-information-word-3-check', (event, arg) => {
  if (CurrentDataComplexTranslationGoogle != null) {
    if (arg)
      if (arg == 'check')
      {
        event.sender.send('grab-information-word-3-check-reply', CurrentDataComplexTranslationGoogle)
        CurrentDataComplexTranslationGoogle = null
      }
  }
})

/**
 * Controle de finalização do carregamento dos WebView.
 */
var CurrentFinishedLoadedURL = []

// Reseta variável de controle das URL's carregadas.
ipcMain.on('webview-finished-reset', (event, arg) => {
  CurrentFinishedLoadedURL = []
})

// Recebe URL carregada de renderer...
ipcMain.on('webview-finished-load', (event, arg) => {
  CurrentFinishedLoadedURL.push(arg)
})

// Checagem das URL's carregadas.
ipcMain.on('webview-finished-check', (event, arg) => {
  event.sender.send('webview-finished-check-reply', CurrentFinishedLoadedURL)
})
