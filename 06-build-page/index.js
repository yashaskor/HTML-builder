const fs = require('fs').promises;
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const templateFile = path.join(__dirname, 'template.html');
const distDir = path.join(__dirname, 'project-dist');
const indexFile = path.join(distDir, 'index.html');
const distStyleFile = path.join(distDir, 'style.css');

async function copyRecursive(src, dest) {
  const exists = await fs.stat(src);
  if (exists.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    const childItems = await fs.readdir(src);
    for (const childItem of childItems) {
      const childSrc = path.join(src, childItem);
      const childDest = path.join(dest, childItem);
      await copyRecursive(childSrc, childDest);
    }
  } else {
    await fs.copyFile(src, dest);
  }
}

async function main() {
  try {
    // Create dist directory if it doesn't exist
    if (!await fs.stat(distDir).catch(() => false)) {
      await fs.mkdir(distDir);
    }

    // Read template file and replace component tags
    let template = await fs.readFile(templateFile, 'utf-8');
    const componentFiles = await fs.readdir(componentsDir);
    for (const componentFile of componentFiles) {
      const componentName = path.basename(componentFile, path.extname(componentFile));
      const componentTag = `{{${componentName}}}`;
      if (template.includes(componentTag)) {
        const componentFilePath = path.join(componentsDir, componentFile);
        const componentContent = await fs.readFile(componentFilePath, 'utf-8');
        template = template.replace(new RegExp(componentTag, 'g'), componentContent);
      }
    }
    await fs.writeFile(indexFile, template);

    // Combine all css files into one
    const styleFiles = await fs.readdir(stylesDir);
    let styleContent = '';
    for (const styleFile of styleFiles) {
      const styleFilePath = path.join(stylesDir, styleFile);
      if (path.extname(styleFilePath) === '.css') {
        const styleFileContent = await fs.readFile(styleFilePath, 'utf-8');
        styleContent += styleFileContent;
      }
    }
    await fs.writeFile(distStyleFile, styleContent);

    // Copy assets directory recursively
    const assetsSrcPath = path.resolve(assetsDir);
    const assetsDestPath = path.resolve(distDir, 'assets');
    await copyRecursive(assetsSrcPath, assetsDestPath);
  } catch (error) {
    console.error(error);
  }
}

main();