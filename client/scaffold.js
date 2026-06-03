const fs = require('fs');
const files = [
  'src/pages/admin/AdminDashboard.jsx',
  'src/pages/admin/ManageDonors.jsx',
  'src/pages/admin/ManageHospitals.jsx',
  'src/pages/admin/ManageUsers.jsx',
  'src/pages/donor/DonorDashboard.jsx',
  'src/pages/donor/DonorProfile.jsx',
  'src/pages/donor/DonorHistory.jsx',
  'src/pages/hospital/HospitalDashboard.jsx',
  'src/pages/hospital/HospitalProfile.jsx',
  'src/pages/hospital/HospitalRequests.jsx'
];

files.forEach(file => {
  const name = file.split('/').pop().replace('.jsx', '');
  const content = `import React from 'react';\n\nconst ${name} = () => {\n  return (\n    <div className="container mt-4">\n      <h2>${name} (Under Construction)</h2>\n    </div>\n  );\n};\n\nexport default ${name};\n`;
  fs.writeFileSync(file, content);
});
