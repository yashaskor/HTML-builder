const fs = require('fs').promises;
const path = require('path');

async function copyDir(sourceDir, destinationDir) {
  try {
    await fs.access(destinationDir);
  } catch (error) {
    await fs.mkdir(destinationDir, { recursive: true });
  }

  const files = await fs.readdir(sourceDir);
  const promises = [];

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destinationPath = path.join(destinationDir, file);

    const fileStats = await fs.stat(sourcePath);

    if (fileStats.isDirectory()) {
      const promise = copyDir(sourcePath, destinationPath);
      promises.push(promise);
    } else {
      const promise = fs.copyFile(sourcePath, destinationPath);
      promises.push(promise);
    }
  }

  await Promise.all(promises);
}

const sourceDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

copyDir(sourceDir, destinationDir).then(() => {
  console.log('Copy completed');
}).catch((error) => {
  console.error(error);
});
