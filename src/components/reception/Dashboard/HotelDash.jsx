import React, { useState, useEffect } from 'react';
import { DollarSign, LogIn, LogOut, Users, Home, TrendingUp, CreditCard, Clock, RefreshCw, Calendar } from 'lucide-react';
import './HotelDash.css';

const HotelDash = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Enhanced dummy data generator
  const generateDummyData = () => {
    const roomTypes = ['Deluxe', 'Standard', 'Suite', 'Executive', 'Family'];
    const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis'];
    const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer'];
    
    // Generate detailed check-ins (5-10)
    const checkInCount = Math.floor(Math.random() * 6) + 5;
    const checkIns = Array.from({ length: checkInCount }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const roomCount = Math.floor(Math.random() * 3) + 1;
      const rooms = Array.from({ length: roomCount }, () => {
        const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
        const roomNumber = Math.floor(Math.random() * 100) + 100;
        return `${roomType} ${roomNumber}`;
      });
      
      const baseAmount = roomCount * (Math.random() * 150 + 50);
      const taxes = baseAmount * 0.12;
      const totalAmount = parseFloat((baseAmount + taxes).toFixed(2));
      
      return {
        id: `checkin-${i}-${Date.now()}`,
        guestName: `${firstName} ${lastName}`,
        rooms,
        checkInTime: new Date(new Date().setHours(8 + i, Math.floor(Math.random() * 60))),
        duration: Math.floor(Math.random() * 7) + 1,
        baseAmount: parseFloat(baseAmount.toFixed(2)),
        taxes: parseFloat(taxes.toFixed(2)),
        totalAmount,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        status: ['Confirmed', 'Paid', 'Pending'][Math.floor(Math.random() * 3)]
      };
    });
    
    // Generate detailed check-outs (4-8)
    const checkOutCount = Math.floor(Math.random() * 5) + 4;
    const checkOuts = Array.from({ length: checkOutCount }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const roomCount = Math.floor(Math.random() * 2) + 1;
      const rooms = Array.from({ length: roomCount }, () => {
        const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
        const roomNumber = Math.floor(Math.random() * 100) + 200;
        return `${roomType} ${roomNumber}`;
      });
      
      const baseAmount = roomCount * (Math.random() * 200 + 80) * (Math.floor(Math.random() * 7) + 1);
      const extraCharges = Math.random() > 0.7 ? Math.random() * 100 : 0;
      const taxes = (baseAmount + extraCharges) * 0.12;
      const totalAmount = parseFloat((baseAmount + extraCharges + taxes).toFixed(2));
      
      return {
        id: `checkout-${i}-${Date.now()}`,
        guestName: `${firstName} ${lastName}`,
        rooms,
        checkOutTime: new Date(new Date().setHours(10 + i, Math.floor(Math.random() * 60))),
        duration: Math.floor(Math.random() * 7) + 1,
        baseAmount: parseFloat(baseAmount.toFixed(2)),
        extraCharges: parseFloat(extraCharges.toFixed(2)),
        taxes: parseFloat(taxes.toFixed(2)),
        totalAmount,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        status: ['Completed', 'Paid', 'Pending Payment'][Math.floor(Math.random() * 3)]
      };
    });
    
    // Calculate revenue breakdown
    const checkInRevenue = checkIns.reduce((sum, checkin) => sum + checkin.totalAmount, 0);
    const checkOutRevenue = checkOuts.reduce((sum, checkout) => sum + checkout.totalAmount, 0);
    const totalRevenue = checkInRevenue + checkOutRevenue;
    
    // Payment method breakdown
    const paymentBreakdown = {
      cash: checkIns.concat(checkOuts)
        .filter(t => t.paymentMethod === 'Cash')
        .reduce((sum, t) => sum + t.totalAmount, 0),
      cards: checkIns.concat(checkOuts)
        .filter(t => t.paymentMethod.includes('Card'))
        .reduce((sum, t) => sum + t.totalAmount, 0),
      bankTransfer: checkIns.concat(checkOuts)
        .filter(t => t.paymentMethod === 'Bank Transfer')
        .reduce((sum, t) => sum + t.totalAmount, 0)
    };
    
    // Room occupancy
    const totalRooms = 120;
    const occupiedRooms = Math.floor(Math.random() * 40) + 80; // 80-120 rooms occupied
    const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
    
    return {
      success: true,
      totalRevenue,
      totalCheckIns: checkIns.length,
      totalCheckOuts: checkOuts.length,
      occupancyRate,
      rooms: {
        total: totalRooms,
        occupied: occupiedRooms,
        available: totalRooms - occupiedRooms
      },
      revenue: {
        checkIns: checkInRevenue,
        checkOuts: checkOutRevenue,
        cash: paymentBreakdown.cash,
        cards: paymentBreakdown.cards,
        bankTransfer: paymentBreakdown.bankTransfer,
        other: 0
      },
      checkIns,
      checkOuts,
      dailyTrend: {
        labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
        checkIns: Array.from({ length: 6 }, () => Math.floor(Math.random() * 5)),
        checkOuts: Array.from({ length: 6 }, () => Math.floor(Math.random() * 4))
      }
    };
  };

  // Fetch dashboard data - using dummy data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = generateDummyData();
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error generating dummy data:', error);
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
                {dashboardData?.revenue?.checkOuts > dashboardData?.revenue?.checkIns ? 
                  'Checkout heavy day' : 'Check-in heavy day'
                }
              </span>
            </div>
          </div>

          {/* Check-ins */}
          <div className="hdb-metric-card hdb-checkin-card">
            <div className="hdb-metric-content">
              <div className="hdb-metric-info">
                <p className="hdb-metric-label">Today's Check-ins</p>
                <p className="hdb-metric-value hdb-checkin">
                  {dashboardData?.totalCheckIns || 0}
                </p>
              </div>
              <div className="hdb-metric-icon hdb-checkin-icon">
                <LogIn />
              </div>
            </div>
            <div className="hdb-metric-footer">
              <span className="hdb-revenue-text">
                Revenue: ${dashboardData?.revenue?.checkIns?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Check-outs */}
          <div className="hdb-metric-card hdb-checkout-card">
            <div className="hdb-metric-content">
              <div className="hdb-metric-info">
                <p className="hdb-metric-label">Today's Check-outs</p>
                <p className="hdb-metric-value hdb-checkout">
                  {dashboardData?.totalCheckOuts || 0}
                </p>
              </div>
              <div className="hdb-metric-icon hdb-checkout-icon">
                <LogOut />
              </div>
            </div>
            <div className="hdb-metric-footer">
              <span className="hdb-revenue-text">
                Revenue: ${dashboardData?.revenue?.checkOuts?.toFixed(2) || '0.00'}
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
                  <span className="hdb-breakdown-label">Check-ins</span>
                </div>
                <span className="hdb-breakdown-value hdb-checkin">
                  ${dashboardData?.revenue?.checkIns?.toFixed(2) || '0.00'}
                </span>
              </div>
              
              <div className="hdb-breakdown-item hdb-checkout-item">
                <div className="hdb-breakdown-info">
                  <LogOut className="hdb-breakdown-icon" />
                  <span className="hdb-breakdown-label">Check-outs</span>
                </div>
                <span className="hdb-breakdown-value hdb-checkout">
                  ${dashboardData?.revenue?.checkOuts?.toFixed(2) || '0.00'}
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
              
              {dashboardData?.revenue?.bankTransfer > 0 && (
                <div className="hdb-breakdown-item hdb-transfer-item">
                  <div className="hdb-breakdown-info">
                    <CreditCard className="hdb-breakdown-icon" />
                    <span className="hdb-breakdown-label">Bank Transfer</span>
                  </div>
                  <span className="hdb-breakdown-value hdb-transfer">
                    ${dashboardData?.revenue?.bankTransfer?.toFixed(2) || '0.00'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guest Activity */}
        <div className="hdb-activity-grid">
          {/* Today's Check-ins */}
          <div className="hdb-activity-card">
            <h3 className="hdb-activity-title">
              Today's Check-ins ({dashboardData?.checkIns?.length || 0})
            </h3>
            <div className="hdb-activity-list">
              {dashboardData?.checkIns?.length > 0 ? (
                dashboardData.checkIns.map((checkin, index) => (
                  <div key={checkin.id || index} className="hdb-activity-item hdb-checkin-activity">
                    <div className="hdb-activity-details">
                      <p className="hdb-guest-name">{checkin.guestName}</p>
                      <p className="hdb-room-info">Rooms: {checkin.rooms?.join(', ')}</p>
                      <p className="hdb-time-info">
                        {new Date(checkin.checkInTime).toLocaleTimeString()} | {checkin.duration} night(s)
                      </p>
                      <p className="hdb-status-info">Status: {checkin.status}</p>
                    </div>
                    <div className="hdb-activity-amount">
                      <p className="hdb-amount hdb-checkin">${checkin.totalAmount?.toFixed(2)}</p>
                      <p className="hdb-payment-method">{checkin.paymentMethod}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="hdb-empty-state">
                  <LogIn className="hdb-empty-icon" />
                  <p>No check-ins today</p>
                </div>
              )}
            </div>
          </div>

          {/* Today's Check-outs */}
          <div className="hdb-activity-card">
            <h3 className="hdb-activity-title">
              Today's Check-outs ({dashboardData?.checkOuts?.length || 0})
            </h3>
            <div className="hdb-activity-list">
              {dashboardData?.checkOuts?.length > 0 ? (
                dashboardData.checkOuts.map((checkout, index) => (
                  <div key={checkout.id || index} className="hdb-activity-item hdb-checkout-activity">
                    <div className="hdb-activity-details">
                      <p className="hdb-guest-name">{checkout.guestName}</p>
                      <p className="hdb-room-info">Rooms: {checkout.rooms?.join(', ')}</p>
                      <p className="hdb-time-info">
                        {new Date(checkout.checkOutTime).toLocaleTimeString()} | Stayed {checkout.duration} night(s)
                      </p>
                      <p className="hdb-status-info">Status: {checkout.status}</p>
                    </div>
                    <div className="hdb-activity-amount">
                      <p className="hdb-amount hdb-checkout">${checkout.totalAmount?.toFixed(2)}</p>
                      <p className="hdb-payment-method">{checkout.paymentMethod}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="hdb-empty-state">
                  <LogOut className="hdb-empty-icon" />
                  <p>No check-outs today</p>
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