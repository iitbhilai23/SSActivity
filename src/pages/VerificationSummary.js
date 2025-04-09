import React, { useEffect, useState, useContext } from "react";
import interceptor from "../utils/interceptor";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VerificationSummary() {
  const { user } = useContext(AuthContext);
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        let url = "";

        if (user.role === "Admin") {
          url = "/api/verification-summary/state-summary";
        } else if (user.role === "DEO") {
          url = `/api/verification-summary/district-summary/${user.district_code}`;
        } else if (user.role === "BEO") {
          url = `/api/verification-summary/block-summary/${user.block_code}`;
        } else if (user.role === "Cluster") {
          url = `/api/verification-summary/cluster-summary/${user.cluster_code}`;
        } else {
          toast.error("Role not supported for summary.");
          return;
        }

        const response = await interceptor.get(url);
        setSummaryData(response.data.data);
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to fetch summary data");
      }
    };

    fetchSummary();
  }, [user]);

  return (
    <div className="summary-container">
      <h2>Verification Summary ({user.role})</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            {user.role === "Admin" && <th>District Code</th>}
            {user.role === "DEO" && <th>Block Code</th>}
            {user.role === "BEO" && <th>Cluster Code</th>}
            {user.role === "Cluster" && <th>School Code</th>}
            <th>Item ID</th>
            <th>Total Schools/Entities</th>
            <th>Verified Count</th>
            <th>Unverified Count</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.length > 0 ? (
            summaryData.map((item, index) => (
              <tr key={index}>
                {user.role === "Admin" && <td>{item.district_code}</td>}
                {user.role === "DEO" && <td>{item.block_code}</td>}
                {user.role === "BEO" && <td>{item.cluster_code}</td>}
                {user.role === "Cluster" && <td>{item.school_code}</td>}
                <td>{item.item_id}</td>
                <td>{item.total_schools || "-"}</td>
                <td>{item.verified_count || item.verified_items || 0}</td>
                <td>{item.unverified_count || item.unverified_items || 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VerificationSummary;
