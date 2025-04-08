import React from "react";
import Reservation1 from "../../../../../components/reception/Reservation/reservation1";
import Reservation2 from "../../../../../components/reception/Reservation/reservation2";
import Sidebar from "../../../../../components/reception/recSidebar/Recsidebar";

const Info2 = () => {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: '20% 80%',
     
     
      overflowX: 'hidden'
    }}>
      <div style={{ overflowY: 'auto' }}>
        <Sidebar />
      </div>
    
      <div style={{ 
        padding: '20px',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}>
        <Reservation1 />
        <Reservation2 />
      </div>
    </div>
  );
};

export default Info2;
