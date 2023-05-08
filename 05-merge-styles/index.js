const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const bundlePath = path.join(distDir, 'bundle.css');

// Функция для проверки, является ли файл css-файлом
function isCssFile(filename) {
  return path.extname(filename) === '.css';
}

// Чтение всех файлов из папки styles
fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;

  // Фильтрация только css-файлов
  const cssFiles = files.filter(isCssFile);

  // Чтение содержимого каждого css-файла и добавление в массив стилей
  const styles = cssFiles.reduce((acc, filename) => {
    const filePath = path.join(stylesDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return acc.concat(fileContents);
  }, []);

  // Запись массива стилей в файл bundle.css
  fs.writeFile(bundlePath, styles.join('\n'), (err) => {
    if (err) throw err;
    console.log('Styles merged successfully!');
  });
});