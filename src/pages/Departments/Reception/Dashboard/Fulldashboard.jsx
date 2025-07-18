import React from "react";
import Sidebar2 from "../../../../components/reception/recSidebar/Recsidebar";
import HotelDash from "../../../../components/reception/Dashboard/HotelDash";

const Newdashboard = () => {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: '20% 80%',
      
    }}>
      <div>
        <Sidebar2/>
      </div>
      <div style={{ padding: '20px' }}>
        <HotelDash />
        
      </div>
    </div>
  );
};

export default Newdashboard;
