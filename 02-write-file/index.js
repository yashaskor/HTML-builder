const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'output.txt');
const fileStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true // Включает поддержку комбинации клавиш Ctrl+C
});

console.log('Привет! Начните вводить текст:');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('До свидания!');
    fileStream.close();
    process.exit(0);
  } else {
    fileStream.write(input + '\n');
  }
});

// Обработка сигнала Ctrl+C
rl.on('SIGINT', () => {
  console.log('До свидания!');
  fileStream.close();
  process.exit(0);
});