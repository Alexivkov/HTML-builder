const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const FILES_DIR = 'files'
const FILES_COPY_DIR = 'files-copy'

const branch1 = () => {
  findDiff()
    .then(deleteDifference)
    .then(copyFiles)
    .catch(err => "diff failed")
}

const branch2 = () =>
  fsPromises.mkdir(path.join(__dirname, FILES_COPY_DIR))
    .then(copyFiles)

fsPromises.stat(path.join(__dirname,FILES_COPY_DIR))
.then(branch1)
.catch(branch2)

function copyFiles(files = []) {
  if (files.length < 1) {
    return fsPromises.readdir(path.join(__dirname,FILES_DIR)).then(files => {
      copyFileResolve(files)
    })
  } else {
    copyFileResolve(files)
  }
}

function deleteDifference({ filesToDelete, sourceFiles }) {
  return Promise.all(filesToDelete.map(f => fsPromises.unlink(path.join(__dirname,FILES_COPY_DIR, f))))
    .then(() => sourceFiles)
}


function findDiff(/* stat */) {
  const targetFilesPromise = fsPromises.readdir(path.join(__dirname,FILES_COPY_DIR))
  const sourceFilesPromise = fsPromises.readdir(path.join(__dirname,FILES_DIR))
  return Promise.all([targetFilesPromise, sourceFilesPromise])
    .then(([targetFiles, sourceFiles]) => {
      const filesToDelete = targetFiles.filter(x => sourceFiles.indexOf(x) < 0)
      return { filesToDelete, sourceFiles }
    })
}

function copyFileResolve(files) {
  return Promise.all(files.map(f =>
    fsPromises.copyFile(path.join(__dirname,FILES_DIR, f), path.join(__dirname,FILES_COPY_DIR, f))))
}

