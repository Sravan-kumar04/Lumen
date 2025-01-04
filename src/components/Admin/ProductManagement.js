import React, { useState } from 'react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    category: '',
    stock: '',
    reorderPoint: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProducts([...products, { ...product, id: Date.now() }]);
    setProduct({ name: '', category: '', stock: '', reorderPoint: '' });
  };

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const lowStockProducts = products.filter((p) => Number(p.stock) <= Number(p.reorderPoint));

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product Management</h2>
      <form className="card p-4 shadow mb-4" onSubmit={handleSubmit}>
        <h5>Add Product</h5>
        <div className="form-group mb-3">
          <label>Product Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Enter category"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Stock</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            placeholder="Enter stock level"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Reorder Point</label>
          <input
            type="number"
            className="form-control"
            name="reorderPoint"
            value={product.reorderPoint}
            onChange={handleChange}
            placeholder="Enter reorder point"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Add Product</button>
      </form>

      <div className="card shadow">
        <h5 className="card-header">Product List</h5>
        <div className="card-body">
          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            <ul className="list-group">
              {products.map((p) => (
                <li key={p.id} className="list-group-item d-flex justify-content-between">
                  <div>
                    <strong>{p.name}</strong> ({p.category}) - Stock: {p.stock}
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="alert alert-warning mt-3">
          <strong>Low Stock Alert!</strong> The following products have low stock:
          <ul>
            {lowStockProducts.map((p) => (
              <li key={p.id}>{p.name} - Stock: {p.stock}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
