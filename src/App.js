import React from 'react';
import ProductManagement from './components/Admin/ProductManagement';
import SupplierManagement from './components/Admin/SupplierManagement';

function App() {
  return (
    <div className="container">
      <h1 className="text-center mt-5">Telecom Inventory Management</h1>
      <ProductManagement />
      <SupplierManagement />
    </div>
  );
}

export default App;
