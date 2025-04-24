import fs from 'fs';
import path from 'path';

const filesToCopy = [
  { source: './public/index-fallback.html', destination: './dist/index-fallback.html' },
  { source: './public/config-loader.js', destination: './dist/config-loader.js' }
];

// Копируем все необходимые файлы
filesToCopy.forEach(file => {
  try {
    const sourcePath = path.resolve(file.source);
    const destPath = path.resolve(file.destination);
    
    console.log(`Копирование ${sourcePath} в ${destPath}`);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Файл ${path.basename(file.source)} успешно скопирован!`);
  } catch (error) {
    console.error(`❌ Ошибка при копировании файла ${file.source}:`, error);
    process.exit(1);
  }
}); 