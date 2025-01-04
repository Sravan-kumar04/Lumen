import React, { useState } from 'react';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuppliers([...suppliers, { ...supplier, id: Date.now() }]);
    setSupplier({ name: '', contact: '', email: '', address: '' });
  };

  const handleDelete = (id) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Supplier Management</h2>
      <form className="card p-4 shadow mb-4" onSubmit={handleSubmit}>
        <h5>Add Supplier</h5>
        <div className="form-group mb-3">
          <label>Supplier Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={supplier.name}
            onChange={handleChange}
            placeholder="Enter supplier name"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Contact</label>
          <input
            type="text"
            className="form-control"
            name="contact"
            value={supplier.contact}
            onChange={handleChange}
            placeholder="Enter contact number"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={supplier.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Address</label>
          <textarea
            className="form-control"
            name="address"
            value={supplier.address}
            onChange={handleChange}
            placeholder="Enter address"
            rows="3"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary w-100">Add Supplier</button>
      </form>

      <div className="card shadow">
        <h5 className="card-header">Supplier List</h5>
        <div className="card-body">
          {suppliers.length === 0 ? (
            <p>No suppliers available.</p>
          ) : (
            <ul className="list-group">
              {suppliers.map((s) => (
                <li key={s.id} className="list-group-item d-flex justify-content-between">
                  <div>
                    <strong>{s.name}</strong> - {s.contact} ({s.email})
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierManagement;
