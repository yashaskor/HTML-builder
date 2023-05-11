const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname,'components');
const STYLES_DIR = path.join(__dirname,'styles');
const ASSETS_DIR = path.join(__dirname,'assets');
const TEMPLATE_FILE = path.join(__dirname,'template.html');
const PROJECT_DIST_DIR = path.join(__dirname,'project-dist');
const INDEX_FILE = path.join(__dirname, 'project-dist', 'index.html');
const STYLE_FILE = path.join(__dirname, 'project-dist', 'style.css');

const componentsMap = new Map();
let stylesContent = '';

async function main() {
  try {
    await createProjectDistDir();
    await processComponents();
    await processStyles();
    await copyAssets();
    console.log('Success: build completed');
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

async function createProjectDistDir() {
  await fs.promises.mkdir(PROJECT_DIST_DIR);
}

async function processComponents() {
  const templateContent = await fs.promises.readFile(TEMPLATE_FILE, 'utf8');
  const promises = templateContent.split(/\{\{(.+?)\}\}/)
    .map(async (token, i) => {
      if (i % 2 === 0) {
        // even indexes contain text between tokens
        return token;
      } else {
        // odd indexes contain token names
        const componentName = token.trim();
        if (componentsMap.has(componentName)) {
          return componentsMap.get(componentName);
        } else {
          const componentPath = path.join(COMPONENTS_DIR, `${componentName}.html`);
          const componentContent = await fs.promises.readFile(componentPath, 'utf8');
          componentsMap.set(componentName, componentContent);
          return componentContent;
        }
      }
    });
  const indexContent = (await Promise.all(promises)).join('');
  await fs.promises.writeFile(INDEX_FILE, indexContent);
}

async function processStyles() {
  const styleFiles = await fs.promises.readdir(STYLES_DIR);
  const promises = styleFiles
    .filter(filename => filename.endsWith('.css'))
    .map(async filename => {
      const filePath = path.join(STYLES_DIR, filename);
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      stylesContent += fileContent;
    });
  await Promise.all(promises);
  await fs.promises.writeFile(STYLE_FILE, stylesContent);
}

async function copyAssets() {
  const srcDir = ASSETS_DIR;
  const destDir = path.join(__dirname, 'project-dist', 'assets');;
  try {
    await copyDir(srcDir, destDir);
    console.log('Success: assets copied');
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      const srcFileStat = await fs.promises.stat(srcPath);
      const destFileStat = await getFileStat(destPath);
      if (!destFileStat || srcFileStat.mtimeMs > destFileStat.mtimeMs) {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  }
}
        
        async function getFileStat(filePath) {
        try {
        return await fs.promises.stat(filePath);
        } catch (err) {
        if (err.code === 'ENOENT') {
        return null;
        } else {
        throw err;
        }
        }
        }
    
  


main();