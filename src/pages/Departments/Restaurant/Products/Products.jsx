import React, { useState, useEffect } from "react";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../../api/productApi";
import "./Products.css";
import Ressidebar from "../../../../components/restaurant/resSidebar/Ressidebar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    image: "",
    inStock: true,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category) return;

    try {
      const data = await addProduct(newProduct);
      setProducts([...products, data]);
      resetForm();
    } catch (err) {
      setError("Failed to add product. Please try again.");
      console.error(err);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newProduct.name.trim()) errors.name = "Product name is required";
    if (!newProduct.category) errors.category = "Category is required";
    if (newProduct.price < 0) errors.price = "Price cannot be negative";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProduct = async () => {
    if (!validateForm()) return;

    try {
      setUpdateLoading(true);
      setError(null);

      const data = await updateProduct(editingProduct._id, newProduct);

      setProducts(products.map((prod) => (prod._id === data._id ? data : prod)));

      setError({ type: 'success', message: 'Product updated successfully!' });

      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (err) {
      setError({ type: 'error', message: err.message || "Failed to update product. Please try again." });
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      setError("Failed to delete product. Please try again.");
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setNewProduct({
      name: "",
      price: 0,
      description: "",
      category: "",
      image: "",
      inStock: true,
    });
    setShowPopup(false);
    setFormErrors({});
  };

  return (
    <div className="page-layout">
      <Ressidebar />
      <div className="product-container">
        <h2>Product Management</h2>

        {error && (
          <div className={`message ${error.type === 'success' ? 'success-message' : 'error-message'}`}>
            {error.message}
          </div>
        )}

        <button
          onClick={() => {
            setEditingProduct(null);
            setShowPopup(true);
          }}
          className="add-button"
        >
          Add a New Product
        </button>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>No products found</td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product._id}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>${product.price?.toFixed(2) || "0.00"}</td>
                      <td>{product.category}</td>
                      <td>{product.inStock ? "In Stock" : "Out of Stock"}</td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => {
                            setEditingProduct(product);
                            setNewProduct({
                              name: product.name,
                              price: product.price,
                              description: product.description || "",
                              category: product.category,
                              image: product.image || "",
                              inStock: product.inStock
                            });
                            setShowPopup(true);
                          }}>
                            ✏️
                          </button>
                          <button onClick={() => handleDeleteProduct(product._id)}>🗑️</button>
                        </div>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>{editingProduct ? "Edit Product" : "Add a New Product"}</h3>

              <div className="form-group">
                <label htmlFor="productName">Product Name *</label>
                <input
                  id="productName"
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => {
                    setNewProduct({ ...newProduct, name: e.target.value });
                    if (formErrors.name) {
                      setFormErrors({ ...formErrors, name: null });
                    }
                  }}
                  className={formErrors.name ? "input-error" : ""}
                />
                {formErrors.name && <div className="error-text">{formErrors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="productPrice">Price *</label>
                <input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => {
                    setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 });
                    if (formErrors.price) {
                      setFormErrors({ ...formErrors, price: null });
                    }
                  }}
                  className={formErrors.price ? "input-error" : ""}
                />
                {formErrors.price && <div className="error-text">{formErrors.price}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="productCategory">Category *</label>
                <input
                  id="productCategory"
                  type="text"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => {
                    setNewProduct({ ...newProduct, category: e.target.value });
                    if (formErrors.category) {
                      setFormErrors({ ...formErrors, category: null });
                    }
                  }}
                  className={formErrors.category ? "input-error" : ""}
                />
                {formErrors.category && <div className="error-text">{formErrors.category}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="productDescription">Description</label>
                <textarea
                  id="productDescription"
                  placeholder="Description (optional)"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="productImage">Image URL</label>
                <input
                  id="productImage"
                  type="text"
                  placeholder="Image URL (optional)"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newProduct.inStock}
                    onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                  />
                  In Stock
                </label>
              </div>

              <div className="popup-buttons">
                <button
                  onClick={resetForm}
                  disabled={updateLoading}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  disabled={updateLoading}
                  className={editingProduct ? "update-button" : "add-button"}
                >
                  {updateLoading ? (
                    <span>
                      {editingProduct ? "Updating..." : "Adding..."}
                    </span>
                  ) : (
                    <span>
                      {editingProduct ? "Update Product" : "Add Product"}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
