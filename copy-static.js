import fs from 'fs';
import path from 'path';

// Копируем index-fallback.html в dist
try {
  const sourcePath = path.resolve('./public/index-fallback.html');
  const destPath = path.resolve('./dist/index-fallback.html');
  
  console.log(`Копирование ${sourcePath} в ${destPath}`);
  fs.copyFileSync(sourcePath, destPath);
  console.log('Файл успешно скопирован!');
} catch (error) {
  console.error('Ошибка при копировании файла:', error);
  process.exit(1);
} 