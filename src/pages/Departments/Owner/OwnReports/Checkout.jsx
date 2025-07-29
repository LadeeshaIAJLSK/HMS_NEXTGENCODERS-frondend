import React, { useEffect, useState } from "react";
import axios from "axios";
import Ownsidebar from "../../../../components/owner/ownSidebar/Ownsidebar";
import { FaEye, FaTimes } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Checkout.css";

const CheckoutPage = () => {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [entriesToShow, setEntriesToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    guestFirstName: "",
    fromDate: "",
    toDate: "",
    city: "", // ✅ added city filter
  });
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const fetchCheckouts = async () => {
    try {
      const response = await axios.get("http://localhost:5004/api/checkouts");
      setOriginalData(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching checkout data:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const { guestFirstName, fromDate, toDate, city } = filters;
    const filtered = originalData.filter((d) => {
      const matchGuest = guestFirstName
        ? d.firstName?.toLowerCase().includes(guestFirstName.toLowerCase())
        : true;

      const matchCity = city
        ? d.city?.toLowerCase().includes(city.toLowerCase())
        : true;

      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      const checkIn = new Date(d.checkIn);
      const checkOut = new Date(d.checkOut);

      const matchDate =
        (!from && !to) ||
        (!to && from && checkOut >= from) ||
        (to && !from && checkIn <= to) ||
        (from && to && checkIn <= to && checkOut >= from);

      return matchGuest && matchCity && matchDate;
    });

    setData(filtered);
    setCurrentPage(1);
  };

  const handleExport = (format) => {
    if (data.length === 0) return alert("No data to export.");
    const exportData = data.map((item) => ({
      GuestName: `${item.firstName} ${item.surname}`,
      Mobile: item.mobile,
      City: item.city || "N/A", // ✅ include city
      RoomNo: Array.isArray(item.selectedRooms)
        ? item.selectedRooms.join(", ")
        : item.selectedRooms || "N/A",
      CheckIn: new Date(item.checkIn).toLocaleDateString(),
      CheckOut: new Date(item.checkOut).toLocaleDateString(),
    }));

    if (format === "pdf") {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("Checkout Report", 14, 15);
      doc.autoTable({
        startY: 20,
        columns: [
          { header: "Guest Name", dataKey: "GuestName" },
          { header: "Mobile", dataKey: "Mobile" },
          { header: "City", dataKey: "City" },
          { header: "Room No", dataKey: "RoomNo" },
          { header: "Check-In", dataKey: "CheckIn" },
          { header: "Check-Out", dataKey: "CheckOut" },
        ],
        body: exportData,
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
      const res = await axios.get(`http://localhost:5004/api/checkouts/${id}`);
      setSelectedGuest(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching guest details:", err);
      alert("Could not fetch guest details");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGuest(null);
  };

  const indexOfLastEntry = currentPage * entriesToShow;
  const indexOfFirstEntry = indexOfLastEntry - entriesToShow;
  const currentData = data.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(data.length / entriesToShow);

  return (
    <div className={`checkout-report-wrapper ${modalOpen ? "modal-active" : ""}`}>
      <Ownsidebar />
      <div className="checkout-report-container">
        <div className="checkout-filter-section">
          <h2>Filter Checkouts</h2>
          <div className="checkout-filter-grid">
            <div className="checkout-form-group">
              <label>Guest First Name</label>
              <input name="guestFirstName" type="text" onChange={handleFilterChange} />
            </div>
            <div className="checkout-form-group">
              <label>City</label>
              <input name="city" type="text" onChange={handleFilterChange} />
            </div>
            <div className="checkout-form-group">
              <label>Date From</label>
              <input name="fromDate" type="date" onChange={handleFilterChange} />
            </div>
            <div className="checkout-form-group">
              <label>Date To</label>
              <input name="toDate" type="date" onChange={handleFilterChange} />
            </div>
          </div>
          <div className="checkout-filter-buttons">
            <button className="checkout-search-btn" onClick={handleSearch}>Search</button>
            <select className="checkout-export-btn" onChange={(e) => handleExport(e.target.value)}>
              <option value="">Export As...</option>
              <option value="pdf">PDF</option>
              <option value="xlsx">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>

        <div className="checkout-table-section">
          <table className="checkout-table">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Surname</th>
                <th>Mobile</th>
                <th>City</th> {/* ✅ City column added */}
                <th>Room No</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((guest, index) => (
                  <tr key={guest._id}>
                    <td>{indexOfFirstEntry + index + 1}</td>
                    <td>{guest.firstName}</td>
                    <td>{guest.surname}</td>
                    <td>{guest.mobile}</td>
                    <td>{guest.city || "N/A"}</td> {/* ✅ show city */}
                    <td>
                      {Array.isArray(guest.selectedRooms)
                        ? guest.selectedRooms.join(", ")
                        : guest.selectedRooms || "N/A"}
                    </td>
                    <td>{guest.checkIn?.split("T")[0]}</td>
                    <td>{guest.checkOut?.split("T")[0]}</td>
                    <td>
                      <button className="viewBtn" onClick={() => handleView(guest._id)}>
                        <FaEye className="viewIcon" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="9">No checked out guests found.</td></tr>
              )}
            </tbody>
          </table>

          <div className="checkout-pagination">
            <span>
              Showing {data.length === 0 ? 0 : indexOfFirstEntry + 1} to{" "}
              {Math.min(indexOfLastEntry, data.length)} of {data.length} entries
            </span>
            <div className="checkout-pagination-buttons">
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} className={currentPage === i + 1 ? "active" : ""} onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && selectedGuest && ( <div className="checkout-modal-overlay">
    <div className="checkout-modal-content">
      {/* Close "x" icon */}
      <button className="modal-close-x" onClick={handleCloseModal} aria-label="Close modal">
        <FaTimes />
      </button>
              <h3>Guest Details</h3>
              <ul>
                <li><strong>Full Name:</strong> {selectedGuest.firstName} {selectedGuest.middleName} {selectedGuest.surname}</li>
                <li><strong>NIC:</strong> {selectedGuest.idNumber}</li>
                <li><strong>Mobile:</strong> {selectedGuest.mobile}</li>
                <li><strong>Email:</strong> {selectedGuest.email}</li>
                <li><strong>Gender:</strong> {selectedGuest.gender}</li>
                <li><strong>DOB:</strong> {selectedGuest.dob?.split("T")[0]}</li>
                <li><strong>Nationality:</strong> {selectedGuest.nationality}</li>
                <li><strong>City:</strong> {selectedGuest.city}</li>
                <li><strong>Address:</strong> {selectedGuest.address}</li>
                <li><strong>Adults:</strong> {selectedGuest.adults}</li>
                <li><strong>Children:</strong> {selectedGuest.children}</li>
                <li><strong>Room No:</strong> {Array.isArray(selectedGuest.selectedRooms) ? selectedGuest.selectedRooms.join(", ") : selectedGuest.selectedRooms || "N/A"}</li>
                <li><strong>Reservation Type:</strong> {selectedGuest.reservationType}</li>
                <li><strong>Check-In:</strong> {selectedGuest.checkIn?.split("T")[0]}</li>
                <li><strong>Check-Out:</strong> {selectedGuest.checkOut?.split("T")[0]}</li>
                <li><strong>Status:</strong> {selectedGuest.status}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
