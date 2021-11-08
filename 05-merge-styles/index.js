const fs = require('fs');
const path = require('path');
const filesContentArray = [];
  fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
    if (err)
    console.log(err);
    else {
      files.forEach(file => {
        if (!file.isDirectory() && path.extname(file.name) === '.css') {
          filesContentArray.push(fs.promises.readFile(path.join(__dirname, 'styles', file.name), 'utf8'));
          Promise.all(filesContentArray).then(data => {
            fs.promises.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), data.join(''));
          });
        }
      });
    }
  });
