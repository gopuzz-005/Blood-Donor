const fs = require('fs');
const path = require('path');

const foldersToDelete = [
  'src/pages',
  'src/context',
  'src/services',
  'src/hooks',
  'src/utils',
  'src/Register',
  'src/components/forms',
  'src/components/layout',
  'src/components/ui'
];

foldersToDelete.forEach(folder => {
  const dirPath = path.join(__dirname, folder);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`Deleted ${folder}`);
  }
});
