import React from 'react';
import DashboardStats from './Dashboard/DashboardStats';
import TimezoneClock from './Dashboard/TimezoneClock';
import HotelCalendar from './Dashboard/Calenderview';
import './HotelDashboard.css';

const HotelDashboard = () => {
  return (
    <div className="hotel-dashboard">
      {/* Top Section - Dashboard Stats */}
      <div className="dashboard-top-section">
        <DashboardStats />
      </div>
      
      {/* Bottom Section - Divided into two columns */}
      <div className="dashboard-bottom-section">
        {/* Left Column - Timezone Clock */}
        <div className="dashboard-left-column">
          <TimezoneClock />
        </div>
        
        {/* Right Column - Calendar */}
        <div className="dashboard-right-column">
          <HotelCalendar />
        </div>
      </div>
    </div>
  );
};

export default HotelDashboard;