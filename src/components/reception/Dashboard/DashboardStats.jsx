import React, { useState, useEffect } from 'react';
import './DashboardStats.css';

const DashboardStats = () => {
  // State to hold all dashboard data
  const [dashboardData, setDashboardData] = useState({
    loading: true,
    error: null,
    data: null
  });

  // Mock data structure that matches what you'd get from backend
  const mockBackendData = {
    checkIns: {
      onr: 7,
      dor: 14
    },
    checkOuts: {
      onr: 7,
      dor: 14
    },
    reservations: {
      total: 46,
      confirmed: 40,
      pending: 40,
      rejected: 6
    },
    payments: {
      accepted: 30,
      pending: 40,
      rejected: 5
    },
    lastUpdated: new Date().toISOString()
  };

  // Simulate API fetch
  const fetchData = async () => {
    try {
      // In real app, you would do:
      // const response = await fetch('/api/dashboard');
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        setDashboardData({
          loading: false,
          error: null,
          data: mockBackendData
        });
      }, 800); // Simulate network delay
    } catch (error) {
      setDashboardData({
        loading: false,
        error: 'Failed to fetch data',
        data: null
      });
    }
  };

  useEffect(() => {
    fetchData();
    
    // Optional: Set up refresh interval
    const interval = setInterval(fetchData, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  if (dashboardData.loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (dashboardData.error) {
    return <div className="error">{dashboardData.error}</div>;
  }

  const { checkIns, checkOuts, reservations, payments } = dashboardData.data;

  return (
    <div className="dashboard-container">
      <div className="stats-header">
        <h2>Hotel Dashboard</h2>
        <div className="last-updated">
          Last updated: {new Date(dashboardData.data.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
      
      <div className="stats-grid">
        {/* Check Ins Section */}
        <div className="stat-card">
          <div className="stat-value">{checkIns.onr}</div>
          <div className="stat-label">Today Check Ins(ONR)</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{checkIns.dor}</div>
          <div className="stat-label">Today Check Ins(DOR)</div>
        </div>
        
        {/* Check Outs Section */}
        <div className="stat-card">
          <div className="stat-value">{checkOuts.onr}</div>
          <div className="stat-label">Today Check Outs(ONR)</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{checkOuts.dor}</div>
          <div className="stat-label">Today Check Outs(DOR)</div>
        </div>
        
        {/* Reservation Overview */}
        <div className="overview-card">
          <h3 className="overview-title">Reservation Overview</h3>
          <div className="overview-stats">
            <div className="overview-item">
              <div className="overview-value">{reservations.total}</div>
              <div className="overview-label">Total</div>
            </div>
            <div className="overview-item">
              <div className="overview-value">{reservations.confirmed}</div>
              <div className="overview-label">Confirmed</div>
            </div>
            <div className="overview-item">
              <div className="overview-value">{reservations.pending}</div>
              <div className="overview-label">Pending</div>
            </div>
            <div className="overview-item">
              <div className="overview-value">{reservations.rejected}</div>
              <div className="overview-label">Rejected</div>
            </div>
          </div>
        </div>
        
        {/* Payment Overview */}
        <div className="overview-card">
          <h3 className="overview-title">Payment Overview</h3>
          <div className="overview-stats">
            <div className="overview-item">
              <div className="overview-value">{payments.accepted}</div>
              <div className="overview-label">Accepted</div>
            </div>
            <div className="overview-item">
              <div className="overview-value">{payments.pending}</div>
              <div className="overview-label">Pending</div>
            </div>
            <div className="overview-item">
              <div className="overview-value">{payments.rejected}</div>
              <div className="overview-label">Rejected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;