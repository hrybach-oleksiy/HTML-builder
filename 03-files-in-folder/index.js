const fs = require('fs');
const path = require('path');

const folderPath = './03-files-in-folder/secret-folder';

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(`Error reading folder: ${err.message}`);
    return;
  }

  const filePromises = files.map((file) => {
    const filePath = path.join(folderPath, file);

    return new Promise((resolve) => {
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          console.error(
            `Error getting file stats for ${file}: ${statErr.message}`,
          );
          resolve(null);
        } else if (stats.isFile()) {
          const fileInfo = `${path.parse(file).name} - ${path
            .parse(file)
            .ext.slice(1)} - ${stats.size} bytes`;
          console.log(fileInfo);
          resolve(fileInfo);
        } else {
          resolve(null);
        }
      });
    });
  });

  Promise.all(filePromises)
    .then((fileInfos) => {
      const validFileInfos = fileInfos.filter((info) => info !== null);
      if (validFileInfos.length === 0) {
        console.log('No valid files found in the folder.');
      }
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
    });
});
