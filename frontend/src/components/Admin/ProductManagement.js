import React, { useState } from 'react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    category: '',
    stock: '',
    reorderPoint: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockTransaction, setStockTransaction] = useState({
    productId: '',
    quantity: '',
    type: 'in', // 'in' or 'out'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setStockTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      setProducts(
        products.map((p) => (p.id === editingProductId ? { ...product, id: editingProductId } : p))
      );
      setEditMode(false);
      setEditingProductId(null);
    } else {
      setProducts([...products, { ...product, id: Date.now(), stock: Number(product.stock) }]);
    }
    setProduct({ name: '', category: '', stock: '', reorderPoint: '' });
  };

  const handleEdit = (p) => {
    setProduct(p);
    setEditMode(true);
    setEditingProductId(p.id);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleStockTransaction = (e) => {
    e.preventDefault();
    const updatedProducts = products.map((p) => {
      if (p.id === Number(stockTransaction.productId)) {
        const quantity = Number(stockTransaction.quantity);
        return {
          ...p,
          stock: stockTransaction.type === 'in' ? p.stock + quantity : p.stock - quantity,
        };
      }
      return p;
    });
    setProducts(updatedProducts);
    setStockTransaction({ productId: '', quantity: '', type: 'in' });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter((p) => Number(p.stock) <= Number(p.reorderPoint));

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product Management</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Form */}
      <form className="card p-4 shadow mb-4" onSubmit={handleSubmit}>
        <h5>{editMode ? 'Edit Product' : 'Add Product'}</h5>
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
        <button type="submit" className="btn btn-primary w-100">
          {editMode ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      {/* Product List */}
      <div className="card shadow">
        <h5 className="card-header">Product List</h5>
        <div className="card-body">
          {filteredProducts.length === 0 ? (
            <p>No products available.</p>
          ) : (
            <ul className="list-group">
              {filteredProducts.map((p) => (
                <li key={p.id} className="list-group-item d-flex justify-content-between">
                  <div>
                    <strong>{p.name}</strong> ({p.category}) - Stock: {p.stock}
                  </div>
                  <div>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(p)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Stock Transactions */}
      <form className="card p-4 shadow mb-4" onSubmit={handleStockTransaction}>
        <h5>Stock Transaction</h5>
        <div className="form-group mb-3">
          <label>Select Product</label>
          <select
            className="form-control"
            name="productId"
            value={stockTransaction.productId}
            onChange={handleTransactionChange}
            required
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mb-3">
          <label>Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={stockTransaction.quantity}
            onChange={handleTransactionChange}
            placeholder="Enter quantity"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Transaction Type</label>
          <select
            className="form-control"
            name="type"
            value={stockTransaction.type}
            onChange={handleTransactionChange}
          >
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100">Record Transaction</button>
      </form>

      {/* Low Stock Alert */}
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
