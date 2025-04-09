import React, { useEffect, useState, useContext } from "react";
import interceptor from "../utils/interceptor";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Modal from "../components/ItemDetailModal";
import "../styles/SummaryDashboard.css";

function BlockSummaryPage() {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState([]);
  const [filteredSummary, setFilteredSummary] = useState([]);
  const [filterType, setFilterType] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await interceptor.get(`/verification-summary/block-summary/${user.block_id}`);
        const clusters = Object.values(
          res.data.data.reduce((acc, item) => {
            const code = item.cluster_code;
            if (!acc[code]) {
              acc[code] = {
                ...item,
                verified: Number(item.verified_items) || 0,
                unverified: Number(item.unverified_items) || 0,
                remarks: Number(item.remarks_found) || 0,
              };
            } else {
              acc[code].verified += Number(item.verified_items) || 0;
              acc[code].unverified += Number(item.unverified_items) || 0;
              acc[code].remarks += Number(item.remarks_found) || 0;
            }
            return acc;
          }, {})
        );
        setSummary(clusters);
      } catch (error) {
        toast.error("Failed to fetch block summary");
      }
    };
    if (user?.role === "BEO") fetchSummary();
  }, [user]);

  const totalClusters = summary.length;
  const verifiedClusters = summary.filter(c => c.verified > 0).length;
  const unverifiedClusters = summary.filter(c => c.unverified > 0 && c.verified === 0).length;
  const remarksClusters = summary.filter(c => c.remarks > 0).length;

  const handleFilter = (type) => {
    setFilterType(type);
    if (type === "verified") {
      setFilteredSummary(summary.filter(c => c.verified > 0));
    } else if (type === "unverified") {
      setFilteredSummary(summary.filter(c => c.unverified > 0 && c.verified === 0));
    } else if (type === "remarks") {
      setFilteredSummary(summary.filter(c => c.remarks > 0));
    } else {
      setFilteredSummary([]);
    }
  };

  return (
    <div className="summary-container">
      <h2 className="summary-title">📊 Block Summary Dashboard</h2>
      <div className="summary-cards">
        <div className="card card-blue">📍 Total Clusters: {totalClusters}</div>
        <div className="card card-green" onClick={() => handleFilter("verified")}>✅ Verified: {verifiedClusters}</div>
        <div className="card card-red" onClick={() => handleFilter("unverified")}>❌ Unverified: {unverifiedClusters}</div>
        <div className="card card-yellow" onClick={() => handleFilter("remarks")}>📝 With Remarks: {remarksClusters}</div>
      </div>

      {filterType && filteredSummary.length > 0 && (
        <table className="summary-table">
          <thead>
            <tr>
              <th>Cluster Code</th>
              <th className="text-green">✅ Verified</th>
              <th className="text-red">❌ Unverified</th>
              <th className="text-blue">📦 Total Items</th>
              <th className="text-orange">📑 Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredSummary.map((item, index) => (
              <tr key={index}>
                <td>{item.cluster_code}</td>
                <td>{item.verified}</td>
                <td>{item.unverified}</td>
                <td>{item.verified + item.unverified}</td>
                <td>{item.remarks || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BlockSummaryPage;
