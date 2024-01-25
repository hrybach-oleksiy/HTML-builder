const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  try {
    const sourceDir = path.join(__dirname, 'files');
    const destDir = path.join(__dirname, 'files-copy');

    await fs.mkdir(destDir, { recursive: true });

    const sourceFiles = await fs.readdir(sourceDir);
    const destFiles = await fs.readdir(destDir);

    const filesToAdd = sourceFiles.filter((file) => !destFiles.includes(file));
    const filesToRemove = destFiles.filter(
      (file) => !sourceFiles.includes(file),
    );

    for (const file of filesToRemove) {
      const filePath = path.join(destDir, file);
      await fs.unlink(filePath);
      console.log(`Removed: ${file}`);
    }

    for (const file of filesToAdd) {
      const sourceFile = path.join(sourceDir, file);
      const destFile = path.join(destDir, file);

      await fs.copyFile(sourceFile, destFile);
      console.log(`Added/Modified: ${file}`);
    }

    console.log('Directory updated successfully!');
  } catch (err) {
    console.error('Error updating directory:', err);
  }
}

copyDir();
