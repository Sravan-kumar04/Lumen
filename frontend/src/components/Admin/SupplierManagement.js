import React, { useState, useEffect } from "react";
import axios from "axios";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
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

  // Fetch Suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/suppliers");
      const orders = response.data.reduce((acc, supplier) => {
        acc[supplier._id] = supplier.orders || [];
        return acc;
      }, {});
      setOrderHistory(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchSuppliers();
    fetchOrders();
  }, []);

  // Handle supplier input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prev) => ({ ...prev, [name]: value }));
  };

  // Submit supplier form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSupplierId) {
        // Update supplier
        const response = await axios.put(
          `http://localhost:5000/api/suppliers/${editingSupplierId}`,
          supplier
        );
        setSuppliers((prev) =>
          prev.map((s) => (s._id === editingSupplierId ? response.data : s))
        );
        setEditingSupplierId(null);
      } else {
        // Add new supplier
        const response = await axios.post("http://localhost:5000/api/suppliers", supplier);
        setSuppliers([...suppliers, response.data]);
      }
      setSupplier({ name: "", contact: "", email: "", address: "" });
    } catch (error) {
      console.error("Error saving supplier:", error);
    }
  };

  // Edit supplier
  const handleEdit = (id) => {
    const supplierToEdit = suppliers.find((s) => s._id === id);
    setSupplier(supplierToEdit);
    setEditingSupplierId(id);
  };

  // Delete supplier
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
      setSuppliers(suppliers.filter((s) => s._id !== id));
      const updatedOrderHistory = { ...orderHistory };
      delete updatedOrderHistory[id];
      setOrderHistory(updatedOrderHistory);
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  // Handle order input change
  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  // Submit order form
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!order.supplierId) return;
      const response = await axios.post(
        `http://localhost:5000/api/suppliers/${order.supplierId}/orders`,
        {
          description: order.description,
          status: order.status,
        }
      );
      setOrderHistory((prev) => ({
        ...prev,
        [order.supplierId]: [...(prev[order.supplierId] || []), response.data],
      }));
      setOrder({ supplierId: "", description: "", status: "" });
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  // Delete order
  const handleDeleteOrder = async (supplierId, orderId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/suppliers/${supplierId}/orders/${orderId}`
      );
      setOrderHistory((prev) => ({
        ...prev,
        [supplierId]: prev[supplierId].filter((o) => o._id !== orderId),
      }));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Supplier Management</h2>
      {/* Supplier Form */}
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

      {/* Supplier List */}
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

      {/* Order Form */}
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

      {/* Order History */}
      <div className="card shadow mt-4">
        <h5 className="card-header">Order History</h5>
        <div className="card-body">
          {Object.keys(orderHistory).length === 0 ? (
            <p>No orders available.</p>
          ) : (
            Object.keys(orderHistory).map((supplierId) => (
              <div key={supplierId}>
                <h6>
                  Supplier:{" "}
                  {suppliers.find((s) => s._id === supplierId)?.name}
                </h6>
                <ul className="list-group mb-3">
                  {orderHistory[supplierId].map((o) => (
                    <li
                      key={o._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        {o.description} - <strong>{o.status}</strong>
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteOrder(supplierId, o._id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierManagement;
