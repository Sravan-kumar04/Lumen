import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductManagement from "./components/Admin/ProductManagement";
import SupplierManagement from "./components/Admin/SupplierManagement";

function App() {
  return (
    <Router>
      <div className="container">
        <h1 className="text-center mt-5">Telecom Inventory Management</h1>
        <nav className="nav justify-content-center mb-4">
          <Link className="nav-link" to="/products">
            Product Management
          </Link>
          <Link className="nav-link" to="/suppliers">
            Supplier Management
          </Link>
        </nav>
        <Routes>
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/suppliers" element={<SupplierManagement />} />
          <Route
            path="/"
            element={
              <h2 className="text-center">
                Welcome to the Telecom Inventory Management System
              </h2>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
