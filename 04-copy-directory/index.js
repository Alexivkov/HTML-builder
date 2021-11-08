const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const pathDirectoryCopy = path.join(__dirname, 'files-copy');
//это НЕ экспериментальная функция fsPromises.cp() пункт 2 проверки!!!
fsPromises.mkdir(pathDirectoryCopy).then(function() {
  console.log('Directory created successfully');
}).catch(function() {
  fs.readdir(pathDirectoryCopy, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(__dirname, 'files-copy' , file), err => {
        if (err) throw err;
      });
    }
  });
  console.log('failed to create directory');
});

fs.readdir(path.join(__dirname, 'files'), (err, files) => {
  files.forEach(file => {
    const filePath = path.join(__dirname, 'files', file);
    const filePathCopy = path.join(__dirname, 'files-copy', file);
    fs.copyFile(filePath, filePathCopy, (err) => {
      if (err) throw err;
      console.log('File Copy Successfully.');
    });
  });
});
    

