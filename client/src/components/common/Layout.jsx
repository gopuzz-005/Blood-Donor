import React from 'react';

// You pass the Specific Sidebar as a prop here
const Layout = ({ children, Sidebar }) => {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      <Sidebar />

      <div style={{ 
        flex: 1, 
        marginLeft: '270px', 
        padding: '30px',
        overflowY: 'auto'
      }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;