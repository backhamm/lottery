"use strict";const i=require("electron"),S=require("fs"),d=require("node:path");function g(n){const r=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(n){for(const s in n)if(s!=="default"){const c=Object.getOwnPropertyDescriptor(n,s);Object.defineProperty(r,s,c.get?c:{enumerable:!0,get:()=>n[s]})}}return r.default=n,Object.freeze(r)}const p=g(S);process.env.DIST=d.join(__dirname,"../dist");process.env.VITE_PUBLIC=i.app.isPackaged?process.env.DIST:d.join(process.env.DIST,"../public");let t;const u=process.env.VITE_DEV_SERVER_URL;function w(){t=new i.BrowserWindow({icon:d.join(process.env.VITE_PUBLIC,"electron-vite.svg"),show:!1,minWidth:1360,minHeight:800,autoHideMenuBar:!0,webPreferences:{preload:d.join(__dirname,"preload.js")}}),t.maximize(),t.show(),t.openDevTools(),i.ipcMain.on("getStore",n=>{try{const r=p.readFileSync("data.json","utf8");n.reply("storeData",JSON.parse(r))}catch{n.reply("storeData",null)}}),i.ipcMain.on("setStore",(n,r)=>{try{p.access("data.json",p.constants.F_OK,s=>{const c=s?{}:JSON.parse(p.readFileSync("data.json","utf8"));let e={...c,...r};if(e.prizeList&&e.prizeList.length){const f=e.prizeList.map(o=>o[0]);if(e.importList&&e.importList.length){const o=JSON.parse(JSON.stringify(e.importList));o.forEach(l=>{l[1]=l[1].filter(a=>f.includes(a))}),e={...e,importList:o}}if(e.winnerList&&JSON.stringify(e.winnerList)!=="{}"){const o=Object.keys(e.winnerList).filter(a=>f.includes(a)),l={};o.forEach(a=>{l[a]=e.winnerList[a]}),e={...e,winnerList:l}}}JSON.stringify(c)!==JSON.stringify(e)&&(p.writeFileSync("data.json",JSON.stringify(e,null,2),"utf8"),n.reply("storeData",e))})}catch(s){console.error("Error writing file:",s)}}),t.webContents.on("did-finish-load",()=>{t==null||t.webContents.send("main-process-message",new Date().toLocaleString())}),u?t.loadURL(u):t.loadFile(d.join(process.env.DIST,"index.html"))}i.app.on("window-all-closed",()=>{process.platform!=="darwin"&&(i.app.quit(),t=null)});i.app.on("activate",()=>{i.BrowserWindow.getAllWindows().length===0&&w()});i.app.whenReady().then(w);