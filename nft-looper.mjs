import { readdirSync, statSync, writeFileSync } from 'fs';
import path from 'path';

const config = {
  outputDir: 'mi777-metadata',
  limit: 777,
}


export const saveJsonToFile = (data, filename, outputDir = '.') => {
  const name = `${ [
    `${ outputDir }/${ filename || 'json-file' }`,
    (new Date().toISOString()).replace(/[-:.]/g, ''),
  ].join('-') }.json`;

  writeFileSync(name, JSON.stringify(data, null, 2));
};

const getAllFiles = function(dirPath, arrayOfFiles) {
  let files = readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles.filter(_ => !(_.includes('.DS_Store') || _.includes('nonRounded') || _.includes('WITH TEXT_'))));
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file)
        .replace('content-rows/', '')
        .replace('Gallery-Overlay/', '')
        .replace(/Row [0-9]*\//ig, '')
      );
    }
  });

  return arrayOfFiles;
};

const getFileKeys = (filename, i) => {
  const [row, index] = filename.match(/((\d+|G)_\d+)/i)[0].split('_').map(key => key.toLowerCase() === 'g' ? 100 : +key);

  return {
    row,
    index,
    type: filename.slice(filename.indexOf('.', 0) + 1).toLowerCase(),
    name: filename,
    fileIndex: i,
  };
};


const buildRows = (files, i) => {
  return files
    .map(getFileKeys)
    .reduce((rowMap, file) => {
      if (rowMap[file.row]) {
        rowMap[file.row].push(file);
        rowMap[file.row].sort((a, b) => a.index - b.index);
      }
      else rowMap[file.row] = [file];

      return rowMap;
    }, {});
};

// const files = buildRows(await getAllFiles('./content-rows'));

saveJsonToFile({ contentRows: buildRows(await getAllFiles('./content-rows')) }, 'content-row-config');