import React from 'react';
import DashboardStats from './Dashboard/DashboardStats';



const HotelDashboard = () => {
  return (
    <div className="hotel-dashboard">
      {/* Top Section - Dashboard Stats */}
      <div className="dashboard-top-section">
        <DashboardStats />
      </div>
      
      
    </div>
  );
};

export default HotelDashboard;