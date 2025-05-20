import React from "react";
import Sidebar2 from "../../../../components/reception/recSidebar/Recsidebar";
import HotelDashboard from "../../../../components/reception/HotelDashboard"; // Adjust the path to your CheckInForm component

const Fulldashboard = () => {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: '20% 80%',
      
    }}>
      <div>
        <Sidebar2/>
      </div>
      <div style={{ padding: '20px' }}>
        <HotelDashboard/>
      </div>
    </div>
  );
};

export default Fulldashboard;
