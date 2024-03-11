import { app, BrowserWindow, ipcMain } from 'electron'
import * as fs from "fs";
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    show: false,
    minWidth: 1360,
    minHeight: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.maximize()
  win.show()
  win.openDevTools()

  ipcMain.on('getStore', e => {
    try {
      const data = fs.readFileSync('data.json', 'utf8')
      e.reply('storeData', JSON.parse(data))
    } catch (err) {
      e.reply('storeData', null)
    }
  })

  ipcMain.on('setStore', (e, data) => {
    try {
      fs.access('data.json', fs.constants.F_OK, err => {
        const obj = err ? {} : JSON.parse(fs.readFileSync('data.json', 'utf8'))
        let val = {...obj, ...data}
        if (val.prizeList && val.prizeList.length) {
          const keys = val.prizeList.map(el => el[0])
          if (val.importList && val.importList.length) {
            const importList = JSON.parse(JSON.stringify(val.importList))
            importList.forEach(el => {
              el[1] = el[1].filter(item => keys.includes(item))
            })
            val = {...val, importList}
          }
          if (val.winnerList && JSON.stringify(val.winnerList) !== '{}') {
            const winnerListKeys = Object.keys(val.winnerList).filter(el => keys.includes(el))
            const winnerList = {}
            winnerListKeys.forEach(el => {
              winnerList[el] = val.winnerList[el]
            })
            val = {...val, winnerList}
          }
        }
        if (JSON.stringify(obj) !== JSON.stringify(val)) {
          fs.writeFileSync('data.json', JSON.stringify(val, null, 2), 'utf8');
          e.reply('storeData', val)
        }
      })
    } catch (error) {
      console.error('Error writing file:', error);
    }
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
