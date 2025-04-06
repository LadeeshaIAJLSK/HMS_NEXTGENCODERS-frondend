import React, { useState, useEffect } from "react";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../../api/productApi";
import { fetchCategories } from "../../../../api/categoryApi";
import "./Products.css";
import Ressidebar from "../../../../components/restaurant/resSidebar/Ressidebar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
    loadCategories();
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

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const handleAddProduct = async () => {
    if (!validateForm()) return;

    try {
      setUpdateLoading(true);
      const data = await addProduct(newProduct);
      setProducts([...products, data]);
      setError({ type: 'success', message: 'Product added successfully!' });
      
      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (err) {
      setError({ type: 'error', message: err.message || "Failed to add product. Please try again." });
      console.error(err);
    } finally {
      setUpdateLoading(false);
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

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getCategoryFullName = (category) => {
    if (!category) return "Unknown";
    
    if (category.parentId) {
      const parentCategory = categories.find(cat => 
        cat._id === (typeof category.parentId === 'object' ? category.parentId._id : category.parentId)
      );
      
      if (parentCategory) {
        return `${parentCategory.name} > ${category.name}`;
      }
    }
    
    return category.name;
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "0.00";
    return typeof price === 'number' ? price.toFixed(2) : "0.00";
  };

  const renderCategoryOptions = () => {
    const topLevelCategories = categories.filter(cat => !cat.parentId);
    
    return (
      <>
        <option value="">Select a Category</option>
        
        {topLevelCategories.map(category => (
          <React.Fragment key={category._id}>
            <option value={category._id}>
              {category.name}
            </option>
            
            {renderSubcategoryOptions(category._id)}
          </React.Fragment>
        ))}
      </>
    );
  };

  const renderSubcategoryOptions = (parentId) => {
    const subcategories = categories.filter(cat => {
      if (!cat.parentId) return false;
      
      const catParentId = typeof cat.parentId === 'object' 
        ? cat.parentId._id 
        : cat.parentId;
        
      return catParentId === parentId;
    });
    
    return subcategories.map(subcat => (
      <option key={subcat._id} value={subcat._id}>
        &nbsp;&nbsp;&nbsp;└─ {subcat.name}
      </option>
    ));
  };

  return (
    <div className="page-layout">
      <Ressidebar />
      <div className="product-container">
        <div className="product-header">
          <h2>Product Management</h2>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowPopup(true);
            }}
            className="add-button"
          >
            Add a New Product
          </button>
        </div>

        {error && (
          <div className={`message ${error.type === 'success' ? 'success-message' : 'error-message'}`}>
            {error.message}
          </div>
        )}

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
                      <td>${formatPrice(product.price)}</td>
                      <td>
                        {product.category && typeof product.category === 'object' 
                          ? getCategoryFullName(product.category)
                          : getCategoryName(product.category)}
                      </td>
                      <td>
                        <span className={product.inStock ? "in-stock" : "out-of-stock"}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setNewProduct({
                                name: product.name,
                                price: product.price,
                                description: product.description || "",
                                category: product.category && typeof product.category === 'object' 
                                  ? product.category._id 
                                  : product.category,
                                image: product.image || "",
                                inStock: product.inStock,
                              });
                              setShowPopup(true);
                            }}
                            className="edit-button"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="delete-button"
                          >
                            🗑️
                          </button>
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
                <select
                  id="productCategory"
                  value={newProduct.category}
                  onChange={(e) => {
                    setNewProduct({ ...newProduct, category: e.target.value });
                    if (formErrors.category) {
                      setFormErrors({ ...formErrors, category: null });
                    }
                  }}
                  className={formErrors.category ? "input-error" : ""}
                >
                  {renderCategoryOptions()}
                </select>
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
