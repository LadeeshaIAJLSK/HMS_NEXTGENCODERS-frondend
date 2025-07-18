import React from "react";
import Sidebar2 from "../../../../components/reception/recSidebar/Recsidebar";
import DashboardStats from  "../../../../components/reception/Dashboard/DashboardStats"// Adjust the path to your CheckInForm component

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
        <DashboardStats />
        
      </div>
    </div>
  );
};

export default Fulldashboard;
