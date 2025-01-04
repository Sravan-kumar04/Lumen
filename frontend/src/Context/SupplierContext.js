import React, { useState, useContext } from "react";
import { SupplierContext } from "./SupplierContext";

const SupplierManagement = () => {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  } = useContext(SupplierContext);

  const [supplier, setSupplier] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [orderHistory, setOrderHistory] = useState({});
  const [order, setOrder] = useState({
    supplierId: "",
    description: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSupplierId) {
      updateSupplier(editingSupplierId, supplier);
      setEditingSupplierId(null);
    } else {
      addSupplier(supplier);
    }
    setSupplier({ name: "", contact: "", email: "", address: "" });
  };

  const handleEdit = (id) => {
    const supplierToEdit = suppliers.find((s) => s._id === id);
    setSupplier(supplierToEdit);
    setEditingSupplierId(id);
  };

  const handleDelete = (id) => {
    deleteSupplier(id);
    const updatedOrderHistory = { ...orderHistory };
    delete updatedOrderHistory[id];
    setOrderHistory(updatedOrderHistory);
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!order.supplierId) return;

    setOrderHistory((prev) => ({
      ...prev,
      [order.supplierId]: [
        ...(prev[order.supplierId] || []),
        { description: order.description, status: order.status, id: Date.now() },
      ],
    }));
    setOrder({ supplierId: "", description: "", status: "" });
  };

  const handleDeleteOrder = (supplierId, orderId) => {
    setOrderHistory((prev) => ({
      ...prev,
      [supplierId]: prev[supplierId].filter((o) => o.id !== orderId),
    }));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Supplier Management</h2>
      <form className="card p-4 shadow mb-4" onSubmit={handleSubmit}>
        <h5>{editingSupplierId ? "Edit Supplier" : "Add Supplier"}</h5>
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
        <button type="submit" className="btn btn-primary w-100">
          {editingSupplierId ? "Update Supplier" : "Add Supplier"}
        </button>
      </form>

      <div className="card shadow">
        <h5 className="card-header">Supplier List</h5>
        <div className="card-body">
          {suppliers.length === 0 ? (
            <p>No suppliers available.</p>
          ) : (
            <ul className="list-group">
              {suppliers.map((s) => (
                <li
                  key={s._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{s.name}</strong> - {s.contact} ({s.email})
                  </div>
                  <div>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleEdit(s._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(s._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card shadow mt-4">
        <h5 className="card-header">Order Management</h5>
        <form className="p-4" onSubmit={handleOrderSubmit}>
          <div className="form-group mb-3">
            <label>Select Supplier</label>
            <select
              className="form-control"
              name="supplierId"
              value={order.supplierId}
              onChange={handleOrderChange}
              required
            >
              <option value="">Select a supplier</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-3">
            <label>Order Description</label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={order.description}
              onChange={handleOrderChange}
              placeholder="Enter order description"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Order Status</label>
            <input
              type="text"
              className="form-control"
              name="status"
              value={order.status}
              onChange={handleOrderChange}
              placeholder="Enter order status"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Add Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupplierManagement;
