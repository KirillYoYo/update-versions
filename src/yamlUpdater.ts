import { promises as fs } from 'fs';
import yaml from 'js-yaml';
import { glob } from 'glob';
import path from 'path';

/**
 * Обновляет версии указанного образа в YAML-файлах в директории.
 *
 * Ищет все файлы с расширением `.yaml` в текущей и вложенных директориях,
 * затем заменяет строки с именем образа на строку с обновлённой версией.
 *
 * @async
 * @function
 * @param {string} image - Имя образа, версия которого должна быть обновлена.
 * @param {string} version - Новая версия образа.
 * @param {string} baseDir - Корневая директория для поиска YAML-файлов.
 * @returns {Promise<string[]>} Массив путей к обновлённым файлам.
 */
export async function updateYamlFiles(image: string, version: string, baseDir: string) {
  // Поиск YAML файлов рекурсивно начиная с baseDir
  const files = await glob(`${baseDir}/**/*.yaml`);

  const updatedFiles = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const lines = content.split('\n');
    let updated = false;

    const newLines = lines.map(line => {
      if (line.includes(`${image}:`)) {
        const updatedLine = line.replace(
            new RegExp(`${image}:.*`),
            `${image}:${version}`
        );
        updated = true;
        return updatedLine;
      }
      return line;
    });

    if (updated) {
      await fs.writeFile(file, newLines.join('\n'), 'utf8');
      updatedFiles.push(file);
    }
  }

  return updatedFiles;
}
