import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const root = process.cwd();
const dist = path.join(root, 'dist');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

(async function build() {
  try {
    if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true, force: true });
    fs.mkdirSync(dist);

    fs.copyFileSync(path.join(root, 'manifest.json'), path.join(dist, 'manifest.json'));

    copyRecursiveSync(path.join(root, 'src'), path.join(dist, 'src'));
    if (fs.existsSync(path.join(root, 'icons'))) {
      copyRecursiveSync(path.join(root, 'icons'), path.join(dist, 'icons'));
    }

    const zipPath = path.join(dist, 'extension.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);
    archive.directory(dist, false);
    await archive.finalize();

    console.log('Build finalizado: dist/ e dist/extension.zip');
  } catch (err) {
    console.error('Erro no build:', err);
    process.exit(1);
  }
})();
