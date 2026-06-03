const fs = require('fs');
const path = require('path');

const foldersToDelete = [
  'src/admin',
  'src/Donors',
  'src/user',
  'src/hospital',
  'src/common',
  'src/style'
];

foldersToDelete.forEach(folder => {
  const dirPath = path.join(__dirname, folder);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`Deleted ${folder}`);
  }
});
