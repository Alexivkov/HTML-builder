const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
  files.forEach(file => {
    // console.log(file)
    fs.stat(path.join(__dirname,'secret-folder', file), (error, stats) => {
      if (error) {
        console.log(error);
      }
      else {
        const isFile = !stats.isDirectory();
        const fileNameWithoutExtension = file.slice(0, file.lastIndexOf('.'));
        const extension = file.slice(1 + file.lastIndexOf('.'));
        const size = formatSizeUnits(stats.size);
        if(isFile) console.log(`${fileNameWithoutExtension} - ${extension} - ${size}`);
      }
  });
});
});

function formatSizeUnits(bytes){
  if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
  else if (bytes > 1)           { bytes = bytes + " bytes"; }
  else if (bytes == 1)          { bytes = bytes + " byte"; }
  else                          { bytes = "0 bytes"; }
  return bytes;
}
