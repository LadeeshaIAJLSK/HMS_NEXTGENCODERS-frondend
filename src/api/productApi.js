const BASE_URL = "http://localhost:5003/products";

export const fetchProducts = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      throw new Error(`Error fetching products: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

export const fetchProductsByCategory = async (categoryId) => {
  try {
    const res = await fetch(`${BASE_URL}/category/${categoryId}`);
    if (!res.ok) {
      throw new Error(`Error fetching products by category: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch products for category ${categoryId}:`, error);
    throw error;
  }
};

export const addProduct = async (product) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Error adding product: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("Failed to add product:", error);
    throw error;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Error updating product: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("Failed to update product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Error deleting product: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
};