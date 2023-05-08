const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        const fileName = path.parse(filePath).name;
        const fileExtension = path.parse(filePath).ext.slice(1);
        const fileSize = stats.size / 1024;
        console.log(`${fileName} - ${fileExtension} - ${fileSize.toFixed(3)}kb`);
      }
    });
  });
});