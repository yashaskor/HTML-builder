const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const destinationDir = path.join(__dirname, 'files-copy');

  try {
    await fs.access(destinationDir);
  } catch (error) {
    await fs.mkdir(destinationDir, { recursive: true });
  }

  const files = await fs.readdir(sourceDir);

  await Promise.all(
    files.map(async file => {
      const sourcePath = path.join(sourceDir, file);
      const destinationPath = path.join(destinationDir, file);

      const fileStats = await fs.stat(sourcePath);

      if (fileStats.isDirectory()) {
        await copyDir(sourcePath, destinationPath);
      } else {
        await fs.copyFile(sourcePath, destinationPath);
      }
    })
  );
}

copyDir();
