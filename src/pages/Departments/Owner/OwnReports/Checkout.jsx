import React, { useEffect, useState } from "react";
import axios from "axios";
import Ownsidebar from "../../../../components/owner/ownSidebar/Ownsidebar";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Checkout.css";

const CheckoutPage = () => {
  const [data, setData] = useState([]);
  const [entriesToShow, setEntriesToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    nic: "",
    roomno: "",
    fromDate: "",
    toDate: "",
    remarks: "",
    CheckoutHandledBy: ""
  });

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const fetchCheckouts = async () => {
    try {
      const response = await axios.get("http://localhost:5003/api/checkouts");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching checkout data:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const { nic, roomno, remarks, CheckoutHandledBy, fromDate, toDate } = filters;
    const filtered = data.filter((d) => {
      const matchNIC = nic ? d.nicNumber === nic : true;
      const matchRoomNo = roomno ? d.roomno === parseInt(roomno) : true;
      const matchRemarks = remarks && remarks !== "none" ? d.remarks === remarks : true;
      const matchCheckoutBy = CheckoutHandledBy
        ? d.CheckoutHandledBy.toLowerCase().includes(CheckoutHandledBy.toLowerCase())
        : true;

      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      const dateFrom = new Date(d.dateFrom);
      const dateTo = new Date(d.dateTo);

      const matchDate =
        (!from && !to) ||
        (!to && from && dateTo >= from) ||
        (to && !from && dateFrom <= to) ||
        (from && to && dateFrom <= to && dateTo >= from);

      return matchNIC && matchRoomNo && matchRemarks && matchCheckoutBy && matchDate;
    });

    setData(filtered);
    setCurrentPage(1);
  };

  const handleExport = (format) => {
    const exportData = data.map((item) => ({
      "Guest ID": item.guestId,
      "NIC Number": item.nicNumber,
      "Room-No": item.roomno,
      "Date From": new Date(item.dateFrom).toLocaleDateString(),
      "Date To": new Date(item.dateTo).toLocaleDateString(),
      Remarks: item.remarks,
      "Checkout Handled By": item.CheckoutHandledBy
    }));

    if (format === "pdf") {
      const doc = new jsPDF();
      doc.text("Checkout Report", 14, 16);
      doc.autoTable({
        head: [Object.keys(exportData[0])],
        body: exportData.map((row) => Object.values(row)),
        startY: 20
      });
      doc.save("checkout_report.pdf");
    } else {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Checkouts");
      XLSX.writeFile(wb, `checkout.${format}`);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5003/api/checkouts/${id}`);
      const data = response.data;

      const detailString = `
Guest ID: ${data.guestId}
Guest Name: ${data.guestName}
NIC: ${data.nicNumber}
Phone: ${data.guestPhone}
Email: ${data.guestEmail}
Room No: ${data.roomno}
Date From: ${new Date(data.dateFrom).toLocaleDateString()}
Date To: ${new Date(data.dateTo).toLocaleDateString()}
Remarks: ${data.remarks}
Checkout Handled By: ${data.CheckoutHandledBy}
      `;

      alert(detailString);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const indexOfLastEntry = currentPage * entriesToShow;
  const indexOfFirstEntry = indexOfLastEntry - entriesToShow;
  const currentData = data.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(data.length / entriesToShow);

  return (
    <div className="checkout-report-wrapper">
      <Ownsidebar />
      <div className="checkout-report-container">
        <div className="checkout-filter-section">
          <h2>Filter Checkouts</h2>
          <div className="checkout-filter-grid">
            <div className="checkout-form-group">
              <label>Date From</label>
              <input name="fromDate" type="date" onChange={handleFilterChange} />
            </div>
            <div className="checkout-form-group">
              <label>Date To</label>
              <input name="toDate" type="date" onChange={handleFilterChange} />
            </div>
            <div className="checkout-form-group">
              <label>Remarks</label>
              <select name="remarks" onChange={handleFilterChange}>
                <option value="none">None</option>
                <option value="Late Checkout">Late Checkout</option>
                <option value="VIP Guest">VIP Guest</option>
                <option value="Discount Applied">Discount Applied</option>
              </select>
            </div>
            <div className="checkout-form-group">
              <label>Checkout Handled By</label>
              <input name="CheckoutHandledBy" type="text" onChange={handleFilterChange} />
            </div>
          </div>
          <div className="checkout-filter-buttons">
            <button className="checkout-search-btn" onClick={handleSearch}>Search</button>
            <select className="checkout-export-btn" onChange={(e) => handleExport(e.target.value)}>
              <option value="">Export As...</option>
              <option value="pdf">PDF</option>
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>

        <div className="checkout-table-section">
          <div className="checkout-table-controls">
            <div>
              Show
              <select
                value={entriesToShow}
                onChange={(e) => setEntriesToShow(parseInt(e.target.value))}
                className="checkout-entries-select"
              >
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
              entries
            </div>
          </div>

          <table className="checkout-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Guest ID</th>
                <th>NIC Number</th>
                <th>Room-No</th>
                <th>Date From</th>
                <th>Date To</th>
                <th>Remarks</th>
                <th>Checkout Handled by</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>{item.guestId}</td>
                  <td>{item.nicNumber}</td>
                  <td>{item.roomno}</td>
                  <td>{new Date(item.dateFrom).toLocaleDateString()}</td>
                  <td>{new Date(item.dateTo).toLocaleDateString()}</td>
                  <td>{item.remarks}</td>
                  <td>{item.CheckoutHandledBy}</td>
                  <td>
                    <button className="checkout-view-button" onClick={() => handleView(item._id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="checkout-pagination">
            <span>
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, data.length)} of {data.length} entries
            </span>
            <div className="checkout-pagination-buttons">
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
