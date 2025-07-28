import React, { useEffect, useState } from "react";
import axios from "axios";
import Ownsidebar from "../../../../components/owner/ownSidebar/Ownsidebar";
import { FaEye } from "react-icons/fa";
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
    mobile: "",
    roomno: "",
    fromDate: "",
    toDate: "",
    guestName: "",
    checkoutBy: ""
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
    const { mobile, roomno, guestName, checkoutBy, fromDate, toDate } = filters;
    const filtered = originalData.filter((d) => {
      const matchMobile = mobile ? d.mobile.includes(mobile) : true;
      const matchRoomNo = roomno ? d.selectedRooms?.includes(roomno) : true;
      const matchGuestName = guestName
        ? d.fullName?.toLowerCase().includes(guestName.toLowerCase())
        : true;
      const matchCheckoutBy = checkoutBy
        ? d.checkoutByName?.toLowerCase().includes(checkoutBy.toLowerCase())
        : true;

      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      const checkInDate = new Date(d.checkIn);
      const checkoutDate = new Date(d.checkoutDate);

      const matchDate =
        (!from && !to) ||
        (!to && from && checkoutDate >= from) ||
        (to && !from && checkInDate <= to) ||
        (from && to && checkInDate <= to && checkoutDate >= from);

      return matchMobile && matchRoomNo && matchGuestName && matchCheckoutBy && matchDate;
    });

    setData(filtered);
    setCurrentPage(1);
  };

  const handleExport = (format) => {
    if (data.length === 0) {
      alert("No data to export.");
      return;
    }

    const exportData = data.map((item) => ({
      GuestName: item.fullName,
      Mobile: item.mobile,
      RoomNo: item.selectedRooms?.join(", "),
      CheckIn: new Date(item.checkIn).toLocaleDateString(),
      CheckOut: new Date(item.checkoutDate).toLocaleDateString(),
      CheckoutBy: item.checkoutByName || "N/A"
    }));

    if (format === "pdf") {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("Checkout Report", 14, 15);

      const columns = [
        { header: "Guest Name", dataKey: "GuestName" },
        { header: "Mobile", dataKey: "Mobile" },
        { header: "Room No", dataKey: "RoomNo" },
        { header: "Check-In", dataKey: "CheckIn" },
        { header: "Check-Out", dataKey: "CheckOut" },
        { header: "Checkout By", dataKey: "CheckoutBy" },
      ];

      doc.autoTable({
        startY: 20,
        columns,
        body: exportData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 20 },
      });

      doc.save("checkout_report.pdf");
    } else {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Checkouts");
      XLSX.writeFile(wb, `checkout.${format}`);
    }
  };

  const handleView = (id) => {
    axios
      .get(`/api/checkout/${id}`)
      .then((res) => {
        setSelectedGuest(res.data);
        setModalOpen(true);
      })
      .catch((err) => {
        console.error("Error fetching guest details:", err);
      });
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
    <div className="checkout-report-wrapper">
      <Ownsidebar />
      <div className="checkout-report-container">
        <div className="checkout-filter-section">
          <h2>Filter Checkouts</h2>
          <div className="checkout-filter-grid">
            <div className="checkout-form-group">
              <label>NIC</label>
              <input name="mobile" type="text" onChange={handleFilterChange} />
            </div>
            <div className="checkout-form-group">
              <label>Guest Name</label>
              <input name="guestName" type="text" onChange={handleFilterChange} />
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
            <button className="checkout-search-btn" onClick={handleSearch}>
              Search
            </button>
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
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
              entries
            </div>
          </div>

          <table className="checkout-table">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Surname</th>
                <th>Mobile</th>
                <th>Room No</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((guest, index) => (
                  <tr key={guest._id}>
                    <td>{indexOfFirstEntry + index + 1}</td> {/* ✅ Row Number */}
                    <td>{guest.firstName}</td>
                    <td>{guest.surname}</td>
                    <td>{guest.mobile}</td>
                    <td>{guest.roomNumber || "N/A"}</td>
                    <td>{guest.checkInDate?.split("T")[0]}</td>
                    <td>{guest.checkoutDate?.split("T")[0]}</td>
                    <td>{guest.status}</td>
                    <td>
                      <button className="viewBtn" onClick={() => handleView(guest._id)}>
                        <FaEye className="viewIcon" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No checked out guests found.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="checkout-pagination">
            <span>
              Showing {data.length === 0 ? 0 : indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, data.length)} of {data.length} entries
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

          {modalOpen && selectedGuest && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Guest Details</h3>
                <p><strong>Name:</strong> {selectedGuest?.firstName || "N/A"} {selectedGuest?.surname || ""}</p>
                <p><strong>Mobile:</strong> {selectedGuest?.mobile || "N/A"}</p>
                <p><strong>Email:</strong> {selectedGuest?.email || "N/A"}</p>
                <p><strong>Room Number:</strong> {selectedGuest?.roomNumber || "N/A"}</p>
                <p><strong>Check-In:</strong> {selectedGuest?.checkInDate?.split("T")[0] || "N/A"}</p>
                <p><strong>Check-Out:</strong> {selectedGuest?.checkoutDate?.split("T")[0] || "N/A"}</p>
                <p><strong>Status:</strong> {selectedGuest?.status || "N/A"}</p>
                <button className="closeBtn" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
