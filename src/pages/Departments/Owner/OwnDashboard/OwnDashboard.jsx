import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import "./OwnDashboard.css";
import Ownsidebar from "../../../../components/owner/ownSidebar/Ownsidebar";

const COLORS = ["#FF6384", "#36A2EB", "#d1a83f", "#9e15a0"];

const OwnerDashboard = () => {
  const [receptionData, setReceptionData] = useState([]);
  const [todayCheckIns, setTodayCheckIns] = useState(0);
  const [todayCheckOuts, setTodayCheckOuts] = useState(0);
  const [receptionRevenue, setReceptionRevenue] = useState(0);
  const [restaurantRevenue, setRestaurantRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [period, setPeriod] = useState("yearly");

  const [receptionCounts, setReceptionCounts] = useState({
    booked: 0,
    occupied: 0,
    vacant: 0,
    outOfService: 0,
  });

  const [showPopup, setShowPopup] = useState(false);

  const fetchReceptionData = async () => {
    try {
      const res = await axios.get("http://localhost:5004/api/dashboard/latest");
      const data = res.data;

      setTodayCheckIns(data.todayCheckIns || 0);
      setTodayCheckOuts(data.todayCheckOuts || 0);
      setReceptionRevenue(data.receptionRevenue || 0);
      setRestaurantRevenue(data.restaurantRevenue || 0);

      setTotalRevenue(
        (data.receptionRevenue || 0) + (data.restaurantRevenue || 0)
      );

      setReceptionCounts({
        booked: data.booked || 0,
        occupied: data.occupied || 0,
        vacant: data.vacant || 0,
        outOfService: data.outOfService || 0,
      });

      setReceptionData([
        { name: "Booked", value: data.booked },
        { name: "Occupied", value: data.occupied },
        { name: "Vacant", value: data.vacant },
        { name: "Out of Service", value: data.outOfService },
      ]);
    } catch (error) {
      console.error("Error fetching reception data:", error);
    }
  };

  const fetchSalesData = async (selectedPeriod) => {
    try {
      const res = await axios.get(
        `http://localhost:5004/api/sales?period=${selectedPeriod}`
      );
      setSalesData(res.data);
    } catch (err) {
      console.error("Error fetching sales data:", err);
    }
  };

  const storeBackupData = async () => {
    try {
      const date = new Date().toISOString().split("T")[0];

      await axios.post("http://localhost:5004/api/dashboard/backup", {
        date,
        todayCheckIns,
        todayCheckOuts,
        booked: receptionCounts.booked,
        occupied: receptionCounts.occupied,
        vacant: receptionCounts.vacant,
        outOfService: receptionCounts.outOfService,
        receptionRevenue,
        restaurantRevenue,
      });

      setShowPopup(true);
    } catch (err) {
      console.error("Failed to store backup:", err);
    }
  };

  useEffect(() => {
    fetchReceptionData();
    fetchSalesData(period);
  }, [period]);

  useEffect(() => {
    setTotalRevenue(receptionRevenue + restaurantRevenue);
  }, [receptionRevenue, restaurantRevenue]);

  return (
    <>
      <Ownsidebar />
      <main className={`Owndashboard-container ${showPopup ? "Owndashboard-blur" : ""}`}>
        <section className="Owndashboard-metrics-row">
          <div className="Owndashboard-metric-card small-card">
            <h3>Today's Guest Activity</h3>
            <div className="Owndashboard-metric-values">
              <div>
                <p>{todayCheckIns}</p>
                <span>Check-Ins</span>
              </div>
              <div>
                <p>{todayCheckOuts}</p>
                <span>Check-Outs</span>
              </div>
            </div>
          </div>

          <div className="Owndashboard-metric-card large-card">
            <h3>Today's Revenue</h3>
            <div className="Owndashboard-metric-values">
              <div>
                <p>{receptionRevenue ? `Rs. ${receptionRevenue.toFixed(2)}` : "Rs. 0.00"}</p>
                <span>Reception</span>
              </div>
              <div>
                <p>{restaurantRevenue ? `Rs. ${restaurantRevenue.toFixed(2)}` : "Rs. 0.00"}</p>
                <span>Restaurant</span>
              </div>
              <div>
                <p>{`Rs. ${totalRevenue.toFixed(2)}`}</p>
                <span>Total</span>
              </div>
            </div>
          </div>
        </section>

        <section className="Owndashboard-chart-section">
          <h2>Room Occupancy Overview</h2>
          <div className="Owndashboard-chart-row fixed-chart-row">
            <div className="Owndashboard-chart pie-container">
              <PieChart width={300} height={300}>
                <Pie
                  data={receptionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {receptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <div className="Owndashboard-chart line-container">
              <LineChart width={470} height={300} data={receptionData}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#008080" activeDot={{ r: 8 }} />
              </LineChart>
            </div>
          </div>
          <button className="Owndashboard-backup-btn" onClick={storeBackupData}>Store Backup</button>
        </section>

        <section className="Owndashboard-chart-section">
          <div className="Owndashboard-sales-header">
            <h2>Sales Overview</h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="Owndashboard-period-select"
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          <BarChart width={900} height={400} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#008080" />
          </BarChart>
        </section>
      </main>

      {showPopup && (
        <div className="Owndashboard-popup-success">
          <div className="Owndashboard-popup-box">
            <div className="Owndashboard-popup-icon">✅</div>
            <h3>Stored Successfully!</h3>
            <p>Dashboard backup has been stored.</p>
            <button className="Owndashboard-popup-ok" onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerDashboard;
