const fs = require('fs');
fsPromises = fs.promises;
const path = require('path');
const pathDirectoryCopy = path.join(__dirname, 'project-dist');
const fileNames = {};
const filesContentArray = [];
let template;

fsPromises.readFile(path.join(__dirname, 'template.html')).then(templateData => {
  template = templateData.toString();
  fsPromises.readdir(path.join(__dirname, 'components')).then(componentFiles => {
    componentFiles.forEach(componentFile => {
      const fileName = componentFile.split('.')[0];
      fileNames[componentFile.split('.')[0]] = fs.promises.readFile(path.join(__dirname, 'components', componentFile), 'utf-8');
    });
    Promise.all(Object.values(fileNames)).then( data => {
      let i = 0;
      for(let name in fileNames) {
        template = template.replace(`{{${name}}}`, data[i]);
        i++;
      }
      fsPromises.mkdir(pathDirectoryCopy).then(
        fs.createWriteStream(path.join(pathDirectoryCopy, 'index.html')).write(template)
      ).catch(function() {});
      fsPromises.mkdir(path.join(pathDirectoryCopy, 'assets')).then().catch(function(){});
      fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
        if (err) console.log(err);
        else {
          files.forEach(file => {
            if (!file.isDirectory() && path.extname(file.name) === '.css') {
              filesContentArray.push(fs.promises.readFile(path.join(__dirname, 'styles', file.name), 'utf8'));
              Promise.all(filesContentArray).then(data => {
                fs.promises.writeFile(path.join(__dirname, 'project-dist', 'style.css'), data.join(''));
              });
            }
          });
        }
      });
      fs.readdir(path.join(__dirname, 'assets'), {withFileTypes:true}, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          if (file.isDirectory()) fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets', file.name)).then(
            fs.readdir(path.join(__dirname, 'assets', file.name), (err, inFiles) => {
              if (err) throw err;
              for (const inFile of inFiles) {
                const filePath = path.join(__dirname, 'assets', file.name, inFile);
                const filePathCopy = path.join(__dirname,'project-dist', 'assets', file.name, inFile)
                fs.copyFile(filePath, filePathCopy, err => {
                  if (err) throw err;
                });
              }
            })
          ).catch(function() {});
          else {
            console.log(file)
            // fs.copyFile(path.join(__dirname, 'project-dist' ,'assets', file.name), err => {
            //   if (err) throw err;
            // });
          }
        } 
      });
    });
  });
});