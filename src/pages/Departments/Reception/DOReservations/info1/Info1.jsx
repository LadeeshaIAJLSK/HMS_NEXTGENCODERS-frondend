import React from "react";
import CheckInForm from "../../../../.././components/reception/CheckInForm/CheckInForm";
import Sidebar from "../../../../../components/reception/recSidebar/Recsidebar";

const Info1 = () => {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: '20% 80%',
      
    }}>
      <div>
        <Sidebar />
      </div>
      <div style={{ padding: '20px' }}>
        <CheckInForm />
      </div>
    </div>
  );
};

export default Info1;

