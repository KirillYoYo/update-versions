import fs from 'fs';
import { glob } from 'glob';
export async function updateYamlFiles(image, version, baseDir) {
  const files = glob.sync(`${baseDir}/**/*.yaml`);
  const updatedFiles = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let updated = false;
    const newLines = lines.map((line) => {
      if (line.includes(image + ':')) {
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
      fs.writeFileSync(file, newLines.join('\n'), 'utf8');
      updatedFiles.push(file);
    }
  }
  return updatedFiles;
}
