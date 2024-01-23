const fs = require('fs').promises;
const path = require('path');

const sourceFolder = './06-build-page';
const destinationFolder = './06-build-page/project-dist';
const templateFileName = 'template.html';
const outputHtmlFileName = 'index.html';
const outputCssFileName = 'style.css';

const replaceTemplateTags = async (templatePath, componentsPath) => {
  try {
    const templateContent = await fs.readFile(templatePath, 'utf8');
    const componentFiles = await fs.readdir(componentsPath);

    let updatedContent = templateContent;

    await Promise.all(
      componentFiles.map(async (componentFile) => {
        const componentName = path.parse(componentFile).name;
        const componentPath = path.join(componentsPath, componentFile);
        const componentContent = await fs.readFile(componentPath, 'utf8');
        const templateTag = `{{${componentName}}}`;

        updatedContent = updatedContent.replace(
          new RegExp(templateTag, 'g'),
          componentContent,
        );
      }),
    );

    return updatedContent;
  } catch (error) {
    console.error(`Error replacing template tags: ${error.message}`);
    return '';
  }
};

const compileStyles = async (source, destination, outputFileName) => {
  try {
    const files = await fs.readdir(source);
    const cssFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === '.css',
    );
    const writeStream = fs.createWriteStream(
      path.join(destination, outputFileName),
    );

    await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(source, file);
        const fileContent = await fs.readFile(filePath, 'utf8');

        writeStream.write(`/* ${file} */\n${fileContent}\n\n`);
      }),
    );

    writeStream.end(() => {
      console.log(
        `CSS compilation completed. Check ${outputFileName} in ${destination}.`,
      );
    });
  } catch (error) {
    console.error(`Error compiling styles: ${error.message}`);
  }
};

const copyAssets = async (source, destination) => {
  try {
    const assetsPath = path.join(destination, 'assets');

    // Check if the destination folder exists
    try {
      await fs.access(assetsPath);
    } catch (error) {
      // If the destination folder does not exist, create it
      await fs.mkdir(assetsPath, { recursive: true });
    }

    const files = await fs.readdir(source);

    // Copy each file or directory from the source to the destination assets folder
    await Promise.all(
      files.map(async (item) => {
        const sourcePath = path.join(source, item);
        const destinationPath = path.join(assetsPath, item);

        const stats = await fs.stat(sourcePath);

        if (stats.isDirectory()) {
          await copyAssets(sourcePath, destinationPath);
        } else {
          const readStream = fs.createReadStream(sourcePath);
          const writeStream = fs.createWriteStream(destinationPath);

          readStream.pipe(writeStream);

          readStream.on('error', (error) => {
            console.error(`Error reading asset file ${item}: ${error.message}`);
          });

          writeStream.on('error', (error) => {
            console.error(
              `Error writing asset file ${item} to ${assetsPath}: ${error.message}`,
            );
          });
        }
      }),
    );

    console.log('Asset copying completed.');
  } catch (error) {
    console.error(`Error copying assets: ${error.message}`);
  }
};

const buildProject = async () => {
  try {
    if (!(await fs.exists(destinationFolder))) {
      await fs.mkdir(destinationFolder);
    }

    const updatedHtmlContent = await replaceTemplateTags(
      path.join(sourceFolder, templateFileName),
      path.join(sourceFolder, 'components'),
    );
    await fs.writeFile(
      path.join(destinationFolder, outputHtmlFileName),
      updatedHtmlContent,
    );

    await compileStyles(
      path.join(sourceFolder, 'styles'),
      destinationFolder,
      outputCssFileName,
    );

    await copyAssets(path.join(sourceFolder, 'assets'), destinationFolder);

    console.log('Project building completed.');
  } catch (error) {
    console.error(`Error building project: ${error.message}`);
  }
};

buildProject();
