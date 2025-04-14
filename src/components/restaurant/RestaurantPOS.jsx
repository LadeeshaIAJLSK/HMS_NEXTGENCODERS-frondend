import React, { useEffect, useState } from "react";
import Ressidebar from "./resSidebar/Ressidebar";
import styles from "./RestaurantPOS.module.css";
import { fetchCategories } from "../../api/categoryApi";
import { fetchProductsByCategory } from "../../api/productApi";

const RestaurantPOS = () => {
  // State for categories, subcategories, products, selection
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedMain, setSelectedMain] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Billing/order state
  const [billItems, setBillItems] = useState([]);

  // Add or update product in bill
  const handleAddToBill = (product) => {
    setBillItems((prev) => {
      const idx = prev.findIndex((item) => item._id === product._id);
      if (idx !== -1) {
        // Update quantity
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + 1,
          amount: (updated[idx].quantity + 1) * updated[idx].price,
        };
        return updated;
      } else {
        // Add new item
        return [
          ...prev,
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            amount: product.price,
          },
        ];
      }
    });
  };

  // Calculate total
  const totalAmount = billItems.reduce((sum, item) => sum + item.amount, 0);

  // Fetch all categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      const mains = data.filter(cat => !cat.parentId);
      setMainCategories(mains);
      // Select first main by default
      if (mains.length > 0) setSelectedMain(mains[0]._id);
      setLoading(false);
    };
    loadCategories();
  }, []);

  // Update subcategories when main changes
  useEffect(() => {
    if (!selectedMain) {
      setSubCategories([]);
      setSelectedSub(null);
      return;
    }
    const subs = categories.filter(cat => {
      if (!cat.parentId) return false;
      const parentId = typeof cat.parentId === "object" ? cat.parentId._id : cat.parentId;
      return parentId === selectedMain;
    });
    setSubCategories(subs);
    // Select first sub by default, if exists
    setSelectedSub(subs.length > 0 ? subs[0]._id : null);
  }, [selectedMain, categories]);

  // Fetch products when selectedMain or selectedSub changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      let catId = selectedSub || selectedMain;
      if (!catId) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const prods = await fetchProductsByCategory(catId);
        setProducts(prods);
      } catch {
        setProducts([]);
      }
      setLoading(false);
    };
    loadProducts();
  }, [selectedMain, selectedSub]);

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}><Ressidebar /></div>

      {/* Main POS Area */}
      <div className={styles.mainArea}>
        {/* Top Tabs: Main Categories */}
        <div className={styles.tabsRow}>
          <div className={styles.scrollRow}>
            {mainCategories.map((cat) => (
              <div
                key={cat._id}
                className={
                  selectedMain === cat._id
                    ? `${styles.tab} ${styles.selectedTab}`
                    : styles.tab
                }
                onClick={() => {
                  setSelectedMain(cat._id);
                  setSelectedSub(null); // Reset subcategory selection
                }}
              >
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        {/* Sub Tabs: Subcategories */}
        <div className={styles.subTabsRow}>
          <div className={styles.scrollRow}>
            {subCategories.map((sub) => (
              <div
                key={sub._id}
                className={
                  selectedSub === sub._id
                    ? `${styles.subTab} ${styles.selectedTab}`
                    : styles.subTab
                }
                onClick={() => setSelectedSub(sub._id)}
              >
                {sub.name}
              </div>
            ))}
          </div>
        </div>

        {/* Tiles Grid: Products */}
        <div className={styles.tilesGrid}>
          {loading ? (
            <div style={{ gridColumn: "span 6", textAlign: "center", padding: 40 }}>Loading...</div>
          ) : products.length === 0 ? (
            <div style={{ gridColumn: "span 6", textAlign: "center", padding: 40 }}>No Products</div>
          ) : (
            products.map((prod) => (
              <div
                className={styles.tile}
                key={prod._id}
                onClick={() => handleAddToBill(prod)}
                style={{ cursor: "pointer" }}
                title="Add to bill"
              >
                <div className={styles.tileName}>{prod.name}</div>
                <div className={styles.tilePrice}>Rs.{prod.price}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Section (unchanged) */}
      <div className={styles.orderSection}>
        {/* Search & Toggle */}
        <div className={styles.orderTop}>
          <input className={styles.searchInput} placeholder="Search Products" />
          <div className={styles.toggleRow}>
            <label>
              <input type="radio" name="orderType" defaultChecked /> Take Away
            </label>
            <label>
              <input type="radio" name="orderType" /> Din in
            </label>
          </div>
        </div>
        {/* Order List */}
        <div className={styles.orderList}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>No</th><th>Name</th><th>Quantity</th><th>Price</th><th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {billItems.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa' }}>No items</td></tr>
              ) : (
                billItems.map((item, idx) => (
                  <tr key={item._id}>
                    <td>{String(idx + 1).padStart(2, '0')}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{Number(item.price).toFixed(2)}</td>
                    <td>{Number(item.amount).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Total & Buttons */}
        <div className={styles.totalRow}>Total Amount = <span>{totalAmount.toFixed(2)}</span></div>
        <div className={styles.buttonRow}>
          <button className={styles.actionBtn}>Cash</button>
          <button className={styles.actionBtn}>Card</button>
          <button className={styles.actionBtn}>Add to Bill</button>
        </div>
        <div className={styles.buttonRow}>
          <button className={styles.actionBtn}>Send to Kitchen</button>
          <button className={styles.actionBtn}>Add a Note</button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPOS;
