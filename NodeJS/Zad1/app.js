const fs = require('fs');
const path = require("path");
const destinationPath = "./destination/";

function getMostRecentFiles(dir, arr) {
    let currentDir = [];
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
          getMostRecentFiles(fullPath, arr);
       } else {
         currentDir.push(fullPath);
       }  
    });
    currentDir.sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime());
    
    if(currentDir.length > 0)
    arr.push(currentDir[0]);
  }

  console.log("Getting most recent files...")
  let mostRecentFilePaths = [];
  getMostRecentFiles('./praksa/',mostRecentFilePaths);
  console.log("Done!");

  console.log("Copying files...");
  mostRecentFilePaths.forEach(path => {
    let pathSplit = path.split("\\");
    let fileExtensionSplit = pathSplit[pathSplit.length - 1].split(".");
    let fileExtension = fileExtensionSplit[fileExtensionSplit.length - 1];
    fs.copyFile(path, destinationPath + pathSplit[pathSplit.length-2] + '.' + fileExtension, (err) => {
        if (err) throw err;
        console.log(path + ' was copied to ' + destinationPath + pathSplit[pathSplit.length-2] + '.' + fileExtension);
      });

  });

  console.log("Done!");




  