import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    department: "",
    transactionId: "",
    activity: "",
    dateFrom: "",
    dateTo: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/reception-transactions", {
        params: filters,
      });
      const data = response.data;
      setTransactions(Array.isArray(data) ? data : data.transactions || []);
    } catch (err) {
      setError("Failed to fetch transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = transactions
    .filter((t) => t.totalAmount > 0)
    .reduce((acc, cur) => acc + cur.totalAmount, 0);
  const totalExpense = transactions
    .filter((t) => t.totalAmount < 0)
    .reduce((acc, cur) => acc + cur.totalAmount, 0);
  const netAmount = totalIncome + totalExpense;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-bold mb-4">Transactions Report</h1>

      <div className="grid grid-cols-5 gap-4 mb-4">
        <select
          className="border p-2"
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        >
          <option value="">--Select--</option>
          <option value="Front Office">Front Office</option>
        </select>&nbsp;&nbsp;&nbsp;
        <input
          className="border p-2"
          type="text"
          placeholder="Enter Transaction Id"
          value={filters.transactionId}
          onChange={(e) => setFilters({ ...filters, transactionId: e.target.value })}
        />&nbsp;&nbsp;&nbsp;
        <select
          className="border p-2"
          value={filters.activity}
          onChange={(e) => setFilters({ ...filters, activity: e.target.value })}
        >
          <option value="">--Select--</option>
          <option value="Room Amount">Room Amount</option>
          <option value="Room Advance Amount">Room Advance Amount</option>
          <option value="Expense">Expense</option>
        </select>&nbsp;&nbsp;&nbsp;
        <input
          className="border p-2"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
        />&nbsp;&nbsp;&nbsp;
        <input
          className="border p-2"
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
        />&nbsp;
      </div>

      <div className="flex justify-between items-center mb-4">
      <div className="flex gap-4">
  <button onClick={fetchTransactions} className="bg-green-500 text-black px-4 py-2 rounded">
    Search
  </button>&nbsp;&nbsp;&nbsp;
  <button className="bg-blue-500 text-black px-4 py-2 rounded">
    Export
  </button>
</div>

        <input
          className="border p-2 w-1/4"
          placeholder="Search by ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">S.No</th>
                <th className="border p-2">Transaction Id</th>
                <th className="border p-2">Activity</th>
                <th className="border p-2">Payment Mode</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, index) => (
                <tr key={tx.transactionId} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{tx.transactionId}</td>
                  <td className="border p-2">{tx.activity}</td>
                  <td className="border p-2">{tx.paymentMode}</td>
                  <td className="border p-2">{new Date(tx.date).toLocaleString()}</td>
                  <td
                    className={`border p-2 ${
                      tx.totalAmount < 0 ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    Rs {tx.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 text-right text-sm">
            <p>Total Income: <strong className="text-green-700">Rs {totalIncome.toFixed(2)}</strong></p>
            <p>Total Expense: <strong className="text-red-600">Rs {Math.abs(totalExpense).toFixed(2)}</strong></p>
            <p>Net Amount: <strong className="text-blue-600">Rs {netAmount.toFixed(2)}</strong></p>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionReport;