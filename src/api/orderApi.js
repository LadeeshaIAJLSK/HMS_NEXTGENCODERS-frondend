const BASE_URL = "http://localhost:5003/orders";

export const createOrder = async (orderData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Error creating order: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      throw new Error(`Error fetching orders: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) {
      throw new Error(`Error fetching order: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch order ${id}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Error updating order status: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
};

export const getOrdersByGuest = async (guestId) => {
  try {
    const res = await fetch(`${BASE_URL}/guest/${guestId}`);
    if (!res.ok) {
      throw new Error(`Error fetching guest orders: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch guest orders:", error);
    throw error;
  }
};
