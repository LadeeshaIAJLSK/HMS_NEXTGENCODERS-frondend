import React, { useState, useEffect } from 'react';
import { DollarSign, LogIn, LogOut, Users, Home, TrendingUp, CreditCard, Clock, RefreshCw, Calendar } from 'lucide-react';
import './HotelDash.css';

const HotelDash = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch dashboard data
  const fetchDashboardData = async (date = null) => {
    setLoading(true);
    try {
      const targetDate = date || selectedDate;
      const response = await fetch(`/api/daily-data?date=${targetDate}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data);
        setLastUpdated(new Date());
      } else {
        console.error('Error fetching dashboard data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading && !dashboardData) {
    return (
      <div className="hdb-dashboard-loading">
        <div className="hdb-loading-content">
          <RefreshCw className="hdb-loading-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hdb-dashboard-container">
      <div className="hdb-dashboard-wrapper">
        {/* Header */}
        <div className="hdb-dashboard-header">
          <div className="hdb-header-content">
            <div className="hdb-header-title">
              <h1>Hotel Dashboard</h1>
              <p>Daily operations overview for {new Date(selectedDate).toLocaleDateString()}</p>
            </div>
            
            <div className="hdb-header-controls">
              <div className="hdb-date-picker">
                <Calendar className="hdb-date-icon" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="hdb-date-input"
                />
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`hdb-refresh-btn ${loading ? 'hdb-loading' : ''}`}
              >
                <RefreshCw className={`hdb-refresh-icon ${loading ? 'hdb-spinning' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          
          <div className="hdb-last-updated">
            <Clock className="hdb-clock-icon" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="hdb-metrics-grid">
          {/* Total Revenue */}
          <div className="hdb-metric-card hdb-revenue-card">
            <div className="hdb-metric-content">
              <div className="hdb-metric-info">
                <p className="hdb-metric-label">Total Revenue</p>
                <p className="hdb-metric-value hdb-revenue">
                  ${dashboardData?.totalRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="hdb-metric-icon hdb-revenue-icon">
                <DollarSign />
              </div>
            </div>
            <div className="hdb-metric-footer">
              <TrendingUp className="hdb-trend-icon" />
              <span className="hdb-trend-text">
                {dashboardData?.revenue?.checkouts > dashboardData?.revenue?.bookings ? 
                  'Checkout heavy day' : 'Booking heavy day'
                }
              </span>
            </div>
          </div>

          {/* Check-ins */}
          <div className="hdb-metric-card hdb-checkin-card">
            <div className="hdb-metric-content">
              <div className="hdb-metric-info">
                <p className="hdb-metric-label">Today's Bookings</p>
                <p className="hdb-metric-value hdb-checkin">
                  {dashboardData?.totalBookings || 0}
                </p>
              </div>
              <div className="hdb-metric-icon hdb-checkin-icon">
                <LogIn />
              </div>
            </div>
            <div className="hdb-metric-footer">
              <span className="hdb-revenue-text">
                Revenue: ${dashboardData?.revenue?.bookings?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Check-outs */}
          <div className="hdb-metric-card hdb-checkout-card">
            <div className="hdb-metric-content">
              <div className="hdb-metric-info">
                <p className="hdb-metric-label">Today's Checkouts</p>
                <p className="hdb-metric-value hdb-checkout">
                  {dashboardData?.totalCheckouts || 0}
                </p>
              </div>
              <div className="hdb-metric-icon hdb-checkout-icon">
                <LogOut />
              </div>
            </div>
            <div className="hdb-metric-footer">
              <span className="hdb-revenue-text">
                Revenue: ${dashboardData?.revenue?.checkouts?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Occupancy */}
          <div className="hdb-metric-card hdb-occupancy-card">
            <div className="hdb-metric-content">
              <div className="hdb-metric-info">
                <p className="hdb-metric-label">Occupancy Rate</p>
                <p className="hdb-metric-value hdb-occupancy">
                  {dashboardData?.occupancyRate || 0}%
                </p>
              </div>
              <div className="hdb-metric-icon hdb-occupancy-icon">
                <Home />
              </div>
            </div>
            <div className="hdb-metric-footer">
              <span className="hdb-room-text">
                {dashboardData?.rooms?.occupied || 0} of {dashboardData?.rooms?.total || 0} rooms
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="hdb-breakdown-grid">
          {/* Revenue Sources */}
          <div className="hdb-breakdown-card">
            <h3 className="hdb-breakdown-title">Revenue Sources</h3>
            <div className="hdb-breakdown-content">
              <div className="hdb-breakdown-item hdb-checkin-item">
                <div className="hdb-breakdown-info">
                  <LogIn className="hdb-breakdown-icon" />
                  <span className="hdb-breakdown-label">New Bookings</span>
                </div>
                <span className="hdb-breakdown-value hdb-checkin">
                  ${dashboardData?.revenue?.bookings?.toFixed(2) || '0.00'}
                </span>
              </div>
              
              <div className="hdb-breakdown-item hdb-checkout-item">
                <div className="hdb-breakdown-info">
                  <LogOut className="hdb-breakdown-icon" />
                  <span className="hdb-breakdown-label">Checkouts</span>
                </div>
                <span className="hdb-breakdown-value hdb-checkout">
                  ${dashboardData?.revenue?.checkouts?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="hdb-breakdown-card">
            <h3 className="hdb-breakdown-title">Payment Methods</h3>
            <div className="hdb-breakdown-content">
              <div className="hdb-breakdown-item hdb-cash-item">
                <div className="hdb-breakdown-info">
                  <DollarSign className="hdb-breakdown-icon" />
                  <span className="hdb-breakdown-label">Cash</span>
                </div>
                <span className="hdb-breakdown-value hdb-cash">
                  ${dashboardData?.revenue?.cash?.toFixed(2) || '0.00'}
                </span>
              </div>
              
              <div className="hdb-breakdown-item hdb-card-item">
                <div className="hdb-breakdown-info">
                  <CreditCard className="hdb-breakdown-icon" />
                  <span className="hdb-breakdown-label">Cards</span>
                </div>
                <span className="hdb-breakdown-value hdb-card">
                  ${dashboardData?.revenue?.cards?.toFixed(2) || '0.00'}
                </span>
              </div>
              
              {dashboardData?.revenue?.other > 0 && (
                <div className="hdb-breakdown-item hdb-other-item">
                  <div className="hdb-breakdown-info">
                    <Users className="hdb-breakdown-icon" />
                    <span className="hdb-breakdown-label">Other</span>
                  </div>
                  <span className="hdb-breakdown-value hdb-other">
                    ${dashboardData?.revenue?.other?.toFixed(2) || '0.00'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guest Activity */}
        <div className="hdb-activity-grid">
          {/* Today's Bookings */}
          <div className="hdb-activity-card">
            <h3 className="hdb-activity-title">
              Today's New Bookings ({dashboardData?.bookings?.length || 0})
            </h3>
            <div className="hdb-activity-list">
              {dashboardData?.bookings?.length > 0 ? (
                dashboardData.bookings.map((booking, index) => (
                  <div key={booking.id || index} className="hdb-activity-item hdb-checkin-activity">
                    <div className="hdb-activity-details">
                      <p className="hdb-guest-name">{booking.guestName}</p>
                      <p className="hdb-room-info">Rooms: {booking.rooms?.join(', ')}</p>
                      <p className="hdb-time-info">
                        {new Date(booking.bookingTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="hdb-activity-amount">
                      <p className="hdb-amount hdb-checkin">${booking.amount?.toFixed(2)}</p>
                      <p className="hdb-payment-method">{booking.paymentMethod}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="hdb-empty-state">
                  <LogIn className="hdb-empty-icon" />
                  <p>No new bookings today</p>
                </div>
              )}
            </div>
          </div>

          {/* Today's Checkouts */}
          <div className="hdb-activity-card">
            <h3 className="hdb-activity-title">
              Today's Checkouts ({dashboardData?.checkouts?.length || 0})
            </h3>
            <div className="hdb-activity-list">
              {dashboardData?.checkouts?.length > 0 ? (
                dashboardData.checkouts.map((checkout, index) => (
                  <div key={checkout.id || index} className="hdb-activity-item hdb-checkout-activity">
                    <div className="hdb-activity-details">
                      <p className="hdb-guest-name">{checkout.guestName}</p>
                      <p className="hdb-room-info">Rooms: {checkout.rooms?.join(', ')}</p>
                      <p className="hdb-time-info">
                        {new Date(checkout.checkoutTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="hdb-activity-amount">
                      <p className="hdb-amount hdb-checkout">${checkout.amount?.toFixed(2)}</p>
                      <p className="hdb-payment-method">{checkout.paymentMethod}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="hdb-empty-state">
                  <LogOut className="hdb-empty-icon" />
                  <p>No checkouts today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDash;