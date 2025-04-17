import React, { useState, useEffect } from "react";
import "./ResDashboard.css";
import Navbar from '../../../../components/restaurant/resSidebar/Ressidebar';

export default function Dashboard() {
  // Sample data for the orders table
  const allOrders = [
    // First set of orders
    
    {
      id: "01",
      items: [
        { name: "Chicken Bun", quantity: 2, price: 600.00 },
        { name: "Garlic Bread", quantity: 1, price: 400.00 },
        { name: "Lemon Juice", quantity: 2, price: 500.00 }
      ],
      total: 1500.00,
      status: "Completed",
      time: "11-07-2024",
      timeDetail: "10:34 AM",
      guest: "Kamal Perera",
      room: "33"
    },
    {
      id: "02",
      items: [
        { name: "Chicken Bun", quantity: 2, price: 600.00 },
        { name: "Garlic Bread", quantity: 1, price: 400.00 },
        { name: "Lemon Juice", quantity: 2, price: 500.00 }
      ],
      total: 1500.00,
      status: "Preparing",
      time: "11-07-2024",
      timeDetail: "10:34 AM",
      prepTime: "15 Min",
      guest: "Kamal Perera",
      room: "33"
    },
    {
      id: "01",
      items: [
        { name: "Chicken Bun", quantity: 2, price: 600.00 },
        { name: "Garlic Bread", quantity: 1, price: 400.00 },
        { name: "Lemon Juice", quantity: 2, price: 500.00 }
      ],
      total: 1500.00,
      status: "Completed",
      time: "11-07-2024",
      timeDetail: "10:34 AM",
      guest: "Kamal Perera",
      room: "33"
    },
    {
      id: "02",
      items: [
        { name: "Chicken Bun", quantity: 2, price: 600.00 },
        { name: "Garlic Bread", quantity: 1, price: 400.00 },
        { name: "Lemon Juice", quantity: 2, price: 500.00 }
      ],
      total: 1500.00,
      status: "Preparing",
      time: "11-07-2024",
      timeDetail: "10:34 AM",
      prepTime: "15 Min",
      guest: "Kamal Perera",
      room: "33"
    },
    {
      id: "01",
      items: [
        { name: "Chicken Bun", quantity: 2, price: 600.00 },
        { name: "Garlic Bread", quantity: 1, price: 400.00 },
        { name: "Lemon Juice", quantity: 2, price: 500.00 }
      ],
      total: 1500.00,
      status: "Completed",
      time: "11-07-2024",
      timeDetail: "10:34 AM",
      guest: "Kamal Perera",
      room: "33"
    },
    {
      id: "02",
      items: [
        { name: "Chicken Bun", quantity: 2, price: 600.00 },
        { name: "Garlic Bread", quantity: 1, price: 400.00 },
        { name: "Lemon Juice", quantity: 2, price: 500.00 }
      ],
      total: 1500.00,
      status: "Preparing",
      time: "11-07-2024",
      timeDetail: "10:34 AM",
      prepTime: "15 Min",
      guest: "Kamal Perera",
      room: "33"
    }
  ];

  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // Initialize pagination
  useEffect(() => {
    // Calculate total pages
    setTotalPages(Math.ceil(allOrders.length / ordersPerPage));
    
    // Set initial orders to display
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    setOrders(allOrders.slice(indexOfFirstOrder, indexOfLastOrder));
  }, [currentPage, ordersPerPage]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
    
    if (e.target.value.trim() === "") {
      // If search is cleared, show first page of all orders
      setOrders(allOrders.slice(0, ordersPerPage));
      setTotalPages(Math.ceil(allOrders.length / ordersPerPage));
    } else {
      // Filter orders based on search query
      const filteredOrders = allOrders.filter(order => 
        order.guest.toLowerCase().includes(e.target.value.toLowerCase()) ||
        order.room.toString().includes(e.target.value)
      );
      setOrders(filteredOrders.slice(0, ordersPerPage));
      setTotalPages(Math.ceil(filteredOrders.length / ordersPerPage));
    }
  };

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    
    // If there's a search query, paginate the filtered results
    if (searchQuery.trim() !== "") {
      const filteredOrders = allOrders.filter(order => 
        order.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.room.toString().includes(searchQuery)
      );
      const indexOfLastOrder = pageNumber * ordersPerPage;
      const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
      setOrders(filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder));
    } else {
      // Otherwise paginate all orders
      const indexOfLastOrder = pageNumber * ordersPerPage;
      const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
      setOrders(allOrders.slice(indexOfFirstOrder, indexOfLastOrder));
    }
  };
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="restaurant-dashboard">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>NexStay Hotel</h1>
        </div>
        
        <div className="search-filters">
          <div className="search-container">
            <h4>Search Orders</h4>
            <div className="search-input-container">
              <input 
                type="text" 
                placeholder="Search Guest Name, Room No" 
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          <div className="filter-container">
            <h4>Select Orders</h4>
            <div className="select-dropdown">
              <select>
                <option>All Orders</option>
                <option>Room Service</option>
                <option>Restaurant</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="filters-row">
          <div className="filter-container">
            <h4>Select Order Status</h4>
            <div className="select-dropdown">
              <select>
                <option>All</option>
                <option>Completed</option>
                <option>Preparing</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="filter-container">
            <h4>Select Date</h4>
            <div className="select-dropdown">
              <select>
                <option>Today</option>
                <option>Yesterday</option>
                <option>Last 7 Days</option>
                <option>This Month</option>
                <option>Custom Range</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Items and Prices</th>
                <th>Total</th>
                <th>Status</th>
                <th>Time and Date</th>
                <th>Guest Name</th>
                <th>Room No</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className={order.status === "Preparing" ? "preparing-row" : ""}>
                  <td>{order.id}</td>
                  <td>
                    <div className="items-list">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="item-entry">
                          <span>{item.quantity} {item.name}</span>
                          <span className="item-price">{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="total-column">{order.total.toFixed(2)}</td>
                  <td className={`status-column ${order.status.toLowerCase()}`}>
                    {order.status}
                    {order.status === "Preparing" && <div className="prep-time">{order.prepTime}</div>}
                  </td>
                  <td className="time-column">
                    <div>{order.time}</div>
                    <div className="time-detail">{order.timeDetail}</div>
                  </td>
                  <td>{order.guest}</td>
                  <td>{order.room}</td>
                  <td>
                    <div className="res-dashboard-action-buttons">
                      <button className="res-dashboard-action-btn res-dashboard-view-btn">View Bill</button>
                      <button className="res-dashboard-action-btn res-dashboard-add-btn">Add Payment</button>
                      <button className="res-dashboard-action-btn res-dashboard-delete-btn">Delete Record</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="pagination-container">
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {pageNumbers.map(number => (
              <button 
                key={number} 
                className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            ))}
            
            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
}
