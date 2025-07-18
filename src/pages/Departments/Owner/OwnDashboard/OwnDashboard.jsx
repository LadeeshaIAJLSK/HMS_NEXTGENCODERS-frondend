import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';
import './OwnDashboard.css';
import Ownsidebar from "../../../../components/owner/ownSidebar/Ownsidebar";

// Pie chart colors
const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

const OwnerDashboard = () => {
  const [receptionData, setReceptionData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [todayCheckIns, setTodayCheckIns] = useState(0);
  const [todayCheckOuts, setTodayCheckOuts] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [period, setPeriod] = useState("yearly");

  const fetchReceptionData = async () => {
    try {
      const res = await axios.get('http://localhost:5003/api/reception/latest');
      const data = res.data;

      if (!data) {
        console.warn('No reception data found');
        return;
      }

      const formattedData = [
        { name: 'Booked', value: data.booked },
        { name: 'Occupied', value: data.occupied },
        { name: 'Vacant', value: data.vacant },
        { name: 'Out of Service', value: data.outOfService }
      ];

      setReceptionData(formattedData);
      setTodayCheckIns(data.todayCheckIns);
      setTodayCheckOuts(data.todayCheckOuts);
      setEditData(data);
    } catch (err) {
      console.error('Error fetching reception data:', err);
    }
  };

  const fetchSalesData = async (selectedPeriod) => {
    try {
      const res = await axios.get(`http://localhost:5003/api/sales?period=${selectedPeriod}`);
      setSalesData(res.data);
    } catch (err) {
      console.error('Error fetching sales data:', err);
    }
  };

  useEffect(() => {
    fetchReceptionData();
    fetchSalesData(period);
  }, [period]);

  const handleSalesFilterChange = (e) => {
    const selectedPeriod = e.target.value;
    setPeriod(selectedPeriod);
  };

  const handleUpdate = async () => {
    try {
      await axios.post('http://localhost:5003/api/reception', editData);
      fetchReceptionData();  // Refresh charts
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <>
      <Ownsidebar />
      <div className="Owndashboard-container">
        <div className="dash-metrics-row">
          <div className="dash-metric-box">
            <div className="dash-metric-value">{todayCheckIns}</div>
            <div className="dash-metric-label">Today Check-Ins</div>
          </div>
          <div className="dash-metric-box">
            <div className="dash-metric-value">{todayCheckOuts}</div>
            <div className="dash-metric-label">Today Check-Outs</div>
          </div>
        </div>

        <div className="dash-chart-box">
          <div className="dash-chart-header">Reception Status Overview</div>
          <div className="chart-table-row">
            <div className="chart-column">
              <PieChart width={250} height={250}>
                <Pie data={receptionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {receptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <div className="chart-column">
              <LineChart width={400} height={250} data={receptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#4BC0C0" activeDot={{ r: 8 }} />
              </LineChart>
            </div>
          </div>

          <div className="dash-update-button-container">
            <button className="dash-update-label" onClick={handleUpdate}>Update</button>
          </div>
        </div>

        <div className="dash-chart-row">
          <div className="dash-chart-box">
            <div className="dash-chart-header">
              Sales
              <select value={period} onChange={handleSalesFilterChange}>
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
              <Bar dataKey="sales" fill="#153279" />
            </BarChart>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;
