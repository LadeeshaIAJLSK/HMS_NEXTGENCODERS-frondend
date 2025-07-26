// App.tsx


import React, { useState } from "react";




import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import NavBar from './NavBar';
//import Sidebar from './Sidebar';



import { toast } from "react-toastify";



import { FaPlus, FaEdit, FaTrash, FaSearch, FaUtensils, FaTimes, FaCheck, FaClipboardList,FaExclamationTriangle, FaSave } from "react-icons/fa";



interface MenuItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}






interface Order {
  id: number;
  customerName: string;
  roomOrTable: string;
  item: string;
  quantity: number;
  deliveryTime: string;
  status: "Pending" | "Completed";
}


//home 


const Home: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, customerName: "John Doe", roomOrTable: "Room 102", item: "Pizza", quantity: 2, deliveryTime: "18:30", status: "Pending" },
    { id: 2, customerName: "Sarah Smith", roomOrTable: "Table 5", item: "Burger", quantity: 1, deliveryTime: "19:00", status: "Completed" },
  ]);

  const [newOrder, setNewOrder] = useState<Order>({
    id: 0,
    customerName: "",
    roomOrTable: "",
    item: "",
    quantity: 1,
    deliveryTime: "",
    status: "Pending",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // ✅ Add Order
  const handleAddOrder = () => {
    if (!newOrder.customerName || !newOrder.roomOrTable || !newOrder.item || newOrder.quantity <= 0 || !newOrder.deliveryTime) return;
    setOrders([...orders, { ...newOrder, id: Date.now() }]);
    setNewOrder({ id: 0, customerName: "", roomOrTable: "", item: "", quantity: 1, deliveryTime: "", status: "Pending" });
  };

  // ✅ Delete Order

  // ✅ Edit Order

  // ✅ Save Edited Order
  const handleSaveEdit = () => {
    setOrders(orders.map((order) => (order.id === editingId ? newOrder : order)));
    setNewOrder({ id: 0, customerName: "", roomOrTable: "", item: "", quantity: 1, deliveryTime: "", status: "Pending" });
    setEditingId(null);
  };

  // ✅ Cancel Edit
  const handleCancelEdit = () => {
    setNewOrder({ id: 0, customerName: "", roomOrTable: "", item: "", quantity: 1, deliveryTime: "", status: "Pending" });
    setEditingId(null);
  };

  return (
    <div className="home-container">
      <h1><FaClipboardList /> Kitchen Orders</h1>

      {/* Order Form */}
      <div className="order-form">
        <input type="text" placeholder="Customer Name" value={newOrder.customerName} onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })} />
        <input type="text" placeholder="Room / Table No." value={newOrder.roomOrTable} onChange={(e) => setNewOrder({ ...newOrder, roomOrTable: e.target.value })} />
        <input type="text" placeholder="Food Item" value={newOrder.item} onChange={(e) => setNewOrder({ ...newOrder, item: e.target.value })} />
        <input type="number" placeholder="Quantity" value={newOrder.quantity} onChange={(e) => setNewOrder({ ...newOrder, quantity: Number(e.target.value) })} />
        <input type="time" value={newOrder.deliveryTime} onChange={(e) => setNewOrder({ ...newOrder, deliveryTime: e.target.value })} />
        
        {editingId ? (
          <>
            <button className="save-btn" onClick={handleSaveEdit}><FaCheck /> Save</button>
            <button className="cancel-btn" onClick={handleCancelEdit}><FaTimes /> Cancel</button>
          </>
        ) : (
          <button className="add-btn" onClick={handleAddOrder}><FaPlus /> Place Order</button>
        )}
      </div>

      {orders.length > 0 ? (
  orders.map((order) => (
    <div key={order.id} className={`order-item ${order.status.toLowerCase()}`}>
      <h3>{order.item} (x{order.quantity})</h3>
      <p>👤 <strong>{order.customerName}</strong></p>
      <p>🏠 <strong>{order.roomOrTable}</strong></p>
      <p>⏰ Ready at: <strong>{order.deliveryTime}</strong></p>
    </div>
  ))
) : (
  <p>No orders yet.</p>
)}


</div>

    
  
  )}




//kitchen 


const Kitchen: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([
    { id: 1, name: "Pizza", price: 10, quantity: 5 },
    { id: 2, name: "Burger", price: 8, quantity: 10 },
    { id: 3, name: "Pasta", price: 12, quantity: 7 },
  ]);

  const [search, setSearch] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<MenuItem>({
    id: 0,
    name: "",
    price: 0,
    quantity: 0,
  });

  // ✅ Handle Adding Items
  const handleAddItem = () => {
    if (!newItem.name || newItem.price <= 0 || newItem.quantity <= 0) return;

    // 🚨 Prevent duplicate food names
    const isDuplicate = menu.some((item) => item.name.toLowerCase() === newItem.name.toLowerCase());
    if (isDuplicate) {
      alert("This food item already exists!");
      return;
    }

    setMenu([...menu, { ...newItem, id: Date.now() }]);
    setNewItem({ id: 0, name: "", price: 0, quantity: 0 });
  };

  // ✅ Handle Deleting Items
  const handleDeleteItem = (id: number) => {
    setMenu((prevMenu) => prevMenu.filter((item) => item.id !== id));
  };

  // ✅ Handle Editing Items
  const handleEditItem = (item: MenuItem) => {
    setNewItem(item);
    setEditingId(item.id);
  };

  // ✅ Handle Saving Edited Item
  const handleSaveEdit = () => {
    setMenu((prevMenu) =>
      prevMenu.map((item) => (item.id === editingId ? newItem : item))
    );
    setNewItem({ id: 0, name: "", price: 0, quantity: 0 });
    setEditingId(null);
  };

  // ✅ Handle Cancelling Edit
  const handleCancelEdit = () => {
    setNewItem({ id: 0, name: "", price: 0, quantity: 0 });
    setEditingId(null);
  };

  // ✅ Filter Menu Items by Search
  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="kitchen-container">
      <h1><FaUtensils /> Kitchen Management</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Food Item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button><FaSearch /></button>
      </div>

      {/* Add or Edit Item */}
      <div className="add-item">
        <input
          type="text"
          placeholder="Food Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
        />
        {editingId ? (
          <>
            <button className="save-btn" onClick={handleSaveEdit}>
              <FaCheck /> Save
            </button>
            <button className="cancel-btn" onClick={handleCancelEdit}>
              <FaTimes /> Cancel
            </button>
          </>
        ) : (
          <button onClick={handleAddItem}><FaPlus /> Add</button>
        )}
      </div>

      {/* Menu List */}
      <div className="menu-list">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item) => (
            <div key={item.id} className="menu-item">
              <h3>{item.name}</h3>
              <p>💲 {item.price} | 🥄 {item.quantity} available</p>
              <button className="edit-btn" onClick={() => handleEditItem(item)}>
                <FaEdit /> Edit
              </button>
              <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>
                <FaTrash /> Delete
              </button>
            </div>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>
    </div>
  );
};




//inventory

const Inventory: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Rice", quantity: 50, alertLevel: 10 },
    { id: 2, name: "Chicken", quantity: 20, alertLevel: 5 },
    { id: 3, name: "Vegetables", quantity: 30, alertLevel: 8 },
  ]);

  const [newItem, setNewItem] = useState({ name: "", quantity: 0, alertLevel: 5 });
  const [editingItem, setEditingItem] = useState<{ id: number; name: string; quantity: number; alertLevel: number } | null>(null);

  // Add new stock item
  const addItem = () => {
    if (!newItem.name || newItem.quantity <= 0) {
      toast.error("Please enter valid item details!");
      return;
    }

    const newItemObj = {
      id: items.length + 1,
      name: newItem.name,
      quantity: newItem.quantity,
      alertLevel: newItem.alertLevel,
    };

    setItems([...items, newItemObj]);
    setNewItem({ name: "", quantity: 0, alertLevel: 5 });
    toast.success("Item added successfully!");
  };

  // Start editing an item
  const startEditing = (item: { id: number; name: string; quantity: number; alertLevel: number }) => {
    setEditingItem({ ...item });
  };

  // Save updated item details
  const saveUpdatedItem = () => {
    if (!editingItem) return;

    const updatedItems = items.map((item) =>
      item.id === editingItem.id ? { ...editingItem } : item
    );

    setItems(updatedItems);
    setEditingItem(null);
    toast.success("Item updated successfully!");
  };

  // Delete item
  const deleteItem = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    toast.warn("Item deleted!");
  };

  return (
    <div className="inventory-container">
      <h1 className="inventory-title">Inventory Management</h1>

      {/* Add New Stock */}
      <div className="inventory-actions">
        <input
          type="text"
          placeholder="Enter Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Enter Quantity"
          value={newItem.quantity}
          onChange={(e) =>
            setNewItem({ ...newItem, quantity: Number(e.target.value) })
          }
        />
        <button onClick={addItem}>
          <FaPlus /> Add Item
        </button>
      </div>

      {/* Inventory Table */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Alert Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                {editingItem?.id === item.id ? (
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className={item.quantity <= item.alertLevel ? "low-stock" : ""}>
                {editingItem?.id === item.id ? (
                  <input
                    type="number"
                    value={editingItem.quantity}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, quantity: Number(e.target.value) })
                    }
                  />
                ) : (
                  <>
                    {item.quantity}
                    {item.quantity <= item.alertLevel && <FaExclamationTriangle />}
                  </>
                )}
              </td>
              <td>
                {editingItem?.id === item.id ? (
                  <input
                    type="number"
                    value={editingItem.alertLevel}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, alertLevel: Number(e.target.value) })
                    }
                  />
                ) : (
                  item.alertLevel
                )}
              </td>
              <td className="inventory-buttons">
                {editingItem?.id === item.id ? (
                  <button className="save" onClick={saveUpdatedItem}>
                    <FaSave /> Save
                  </button>
                ) : (
                  <>
                    <button className="edit" onClick={() => startEditing(item)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="delete" onClick={() => deleteItem(item.id)}>
                      <FaTrash /> Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};








// src/pages/About.tsx

import { Utensils, Package, Brush, Contact, Sidebar } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="about-container">
      <h1>About Our Services</h1>
      <p>Welcome to our hotel management system! Explore our key services:</p>

      <div className="service-card">
        <Utensils size={50} color="orange" />
        <h2>Kitchen</h2>
        <p>
          🍽 Our *modern kitchen* ensures delicious and high-quality meals for guests.
          With *state-of-the-art appliances* and a *skilled culinary team*, we deliver an
          unforgettable dining experience.
        </p>
      </div>

      <div className="service-card">
        <Package size={50} color="blue" />
        <h2>Inventory</h2>
        <p>
          📦 Our *smart inventory system* keeps track of supplies, ensuring **seamless
          management** of ingredients, linens, and hotel essentials. No more stock shortages!
        </p>
      </div>

      <div className="service-card">
        <Brush size={50} color="green" />
        <h2>Housekeeping</h2>
        <p>
          🧹 Our *dedicated housekeeping team* maintains *clean and comfortable* rooms.
          We ensure *spotless interiors, fresh linens, and a welcoming ambiance* for every guest.
        </p>
      </div>
    </div>
  );
};













//housekeeping


interface Task {
  id: number;
  type: 'dirty-room' | 'order-delivery';
  title: string;
  description: string;
  icon: string;
  status: 'Pending' | 'In Progress' | 'Ready' | 'Delivered';
  time?: string;
}

const HouseKeeping: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [roomTitle, setRoomTitle] = useState('');
  const [deliveryTitle, setDeliveryTitle] = useState('');
  const [desc, setDesc] = useState('');

  const addTask = (type: 'dirty-room' | 'order-delivery') => {
    if ((type === 'dirty-room' && !roomTitle) || (type === 'order-delivery' && !deliveryTitle)) return;

    const newTask: Task = {
      id: Date.now(),
      type,
      title: type === 'dirty-room' ? roomTitle : deliveryTitle,
      description: desc || (type === 'dirty-room'
        ? 'New dirty room to be cleaned.'
        : 'New order to be delivered.'),
      icon: type === 'dirty-room' ? 'fas fa-broom' : 'fas fa-concierge-bell',
      status: 'Pending',
    };

    setTasks(prev => [...prev, newTask]);
    setRoomTitle('');
    setDeliveryTitle('');
    setDesc('');
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleAccept = (id: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status: 'In Progress' } : task
      )
    );
  };

  const handleSetTime = (id: number, time: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, time } : task
      )
    );
  };

  const handleUpdateStatus = (id: number) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const newStatus = task.type === 'dirty-room' ? 'Ready' : 'Delivered';
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const renderTaskCard = (task: Task) => (
    <div className="task-card" key={task.id}>
      <i className={`${task.icon} task-icon`}></i> {/* ✅ FIXED LINE */}
      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">{task.description}</p>
      <p className="task-status"><strong>Status:</strong> {task.status}</p>

      {task.status === 'Pending' && (
        <button className="task-button" onClick={() => handleAccept(task.id)}>
          Accept
        </button>
      )}

      {task.status === 'In Progress' && (
        <div className="task-actions">
          <input
            type="time"
            className="task-time-input"
            onChange={(e) => handleSetTime(task.id, e.target.value)}
          />
          <button className="task-button" onClick={() => handleUpdateStatus(task.id)}>
            {task.type === 'dirty-room' ? 'Update Ready' : 'Mark Delivered'}
          </button>
        </div>
      )}

      {task.time && (
        <p className="task-time">
          <strong>{task.type === 'dirty-room' ? 'Ready' : 'Delivery'} Time:</strong> {task.time}
        </p>
      )}

      <button className="delete-button" onClick={() => deleteTask(task.id)}>
        🗑 Delete
      </button>
    </div>
  );

  return (
    <div className="housekeeping-container">
      <h1 className="housekeeping-title">🏨 Housekeeping Dashboard</h1>

      <div className="add-task-section">
        <h3>Add Dirty Room</h3>
        <input
          type="text"
          placeholder="Room Title (e.g. Room 201)"
          value={roomTitle}
          onChange={(e) => setRoomTitle(e.target.value)}
        />
        <textarea
          placeholder="Optional Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={() => addTask('dirty-room')}>➕ Add Dirty Room</button>
      </div>

      <div className="add-task-section">
        <h3>Add Delivery Order</h3>
        <input
          type="text"
          placeholder="Order Title (e.g. Order #A5)"
          value={deliveryTitle}
          onChange={(e) => setDeliveryTitle(e.target.value)}
        />
        <textarea
          placeholder="Optional Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={() => addTask('order-delivery')}>➕ Add Delivery</button>
      </div>

      <div className="housekeeping-section">
        <h2 className="section-title">🛏 Dirty Rooms</h2>
        {tasks.filter(t => t.type === 'dirty-room').map(renderTaskCard)}
      </div>

      <div className="housekeeping-section">
        <h2 className="section-title">🍽 Order Deliveries</h2>
        {tasks.filter(t => t.type === 'order-delivery').map(renderTaskCard)}
      </div>
    </div>
  );
};







//services

interface Service {
  title: string;
  description: string;
  icon: string;
}

const services: Service[] = [
  {
    title: 'Guest Reservation Management',
    description: 'Easily manage guest reservations, check-ins, and check-outs with real-time updates.',
    icon: 'fas fa-calendar-check',
  },
  {
    title: 'Billing & Payment Management',
    description: 'Handle billing, payments, and invoicing for guests with accurate and automated tracking.',
    icon: 'fas fa-credit-card',
  },
  {
    title: 'Room Service Ordering',
    description: 'Allow guests to place room service orders, track order status, and manage deliveries.',
    icon: 'fas fa-concierge-bell',
  },
  {
    title: 'Maintenance Request Management',
    description: 'Track maintenance issues and assign tasks to the team to resolve guest-reported problems.',
    icon: 'fas fa-tools',
  },
];

const Services: React.FC = () => {
  return (
    <div className="services-container">
      <h1 className="services-title">Hotel Management System Services</h1>
      <div className="services-list">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <i className={`${service.icon} service-icon`}></i>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
















const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/housekeeping" element={<HouseKeeping />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;