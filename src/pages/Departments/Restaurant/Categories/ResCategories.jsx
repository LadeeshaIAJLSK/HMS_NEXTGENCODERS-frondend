import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../../../api/categoryApi.js";
import "./ResCategories.css";

export default function ResCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;
    const data = await addCategory(newCategory);
    setCategories([...categories, data]);
    setNewCategory("");
    setShowPopup(false);
  };

  const handleUpdateCategory = async () => {
    if (!newCategory) return;
    const data = await updateCategory(editingCategory._id, newCategory);
    setCategories(categories.map((cat) => (cat._id === data._id ? data : cat)));
    setEditingCategory(null);
    setNewCategory("");
    setShowPopup(false);
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    setCategories(categories.filter((category) => category._id !== id));
  };

  return (
    <div className="category-container">
      <h2>Category Management</h2>
      <button onClick={() => { setEditingCategory(null); setShowPopup(true); }}>Add a Category</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>{editingCategory ? "Edit Category" : "Add a Category"}</h3>
            <input
              type="text"
              placeholder="Enter Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={() => { setShowPopup(false); setEditingCategory(null); }}>Cancel</button>
              <button onClick={editingCategory ? handleUpdateCategory : handleAddCategory}>
                {editingCategory ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category._id}>
              <td>{index + 1}</td>
              <td>{category.name}</td>
              <td>
                <button onClick={() => { setEditingCategory(category); setNewCategory(category.name); setShowPopup(true); }}>✏️</button>
                <button onClick={() => handleDeleteCategory(category._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

  