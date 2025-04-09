import React from "react";
import Reservation1 from "../../../../../components/reception/Reservation/reservation1";
import Reservation2 from "../../../../../components/reception/Reservation/reservation2";
import Reservation3 from "../../../../../components/reception/Reservation/reservation3";
import Sidebar from "../../../../../components/reception/recSidebar/Recsidebar";

const Info2 = () => {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: '20% 80%',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <div style={{ overflowY: 'auto' }}>
        <Sidebar />
      </div>

      <div style={{
        padding: '20px',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}>
        <div className="reservation-wrapper">
          <Reservation1 />
          <Reservation2 />
          <Reservation3 />
        </div>
      </div>
    </div>
  );
};

export default Info2;
