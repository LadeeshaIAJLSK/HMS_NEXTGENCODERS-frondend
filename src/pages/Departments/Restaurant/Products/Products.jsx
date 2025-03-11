import React, { useState, useEffect } from "react";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../../api/productApi";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    category: "",
    isActive: true,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.quantity || !newProduct.category) return;
    const data = await addProduct(newProduct);
    setProducts([...products, data]);
    setNewProduct({ name: "", quantity: 0, category: "", isActive: true });
    setShowPopup(false);
  };

  const handleUpdateProduct = async () => {
    if (!newProduct.name || !newProduct.quantity || !newProduct.category) return;
    const data = await updateProduct(editingProduct._id, newProduct);
    setProducts(products.map((prod) => (prod._id === data._id ? data : prod)));
    setEditingProduct(null);
    setNewProduct({ name: "", quantity: 0, category: "", isActive: true });
    setShowPopup(false);
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    setProducts(products.filter((product) => product._id !== id));
  };

  return (
    <div className="product-container">
      <h2>Product Management</h2>
      <button onClick={() => { setEditingProduct(null); setShowPopup(true); }}>Add a New Item</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>{editingProduct ? "Edit Product" : "Add a New Item"}</h3>
            <input
              type="text"
              placeholder="Enter Item Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Enter Quantity"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            />
            <input
              type="text"
              placeholder="Enter Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <label>
              <input
                type="checkbox"
                checked={newProduct.isActive}
                onChange={(e) => setNewProduct({ ...newProduct, isActive: e.target.checked })}
              />
              Active
            </label>
            <div className="popup-buttons">
              <button onClick={() => { setShowPopup(false); setEditingProduct(null); }}>Cancel</button>
              <button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
                {editingProduct ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.category}</td>
              <td>{product.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => { setEditingProduct(product); setNewProduct(product); setShowPopup(true); }}>✏️</button>
                <button onClick={() => handleDeleteProduct(product._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}