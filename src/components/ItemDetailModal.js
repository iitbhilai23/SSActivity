import React, { useState } from "react";
import "../styles/ItemDetailModal.css";

function ItemDetailModal({ data, onClose }) {
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedItems = [...data.items].sort((a, b) => {
    if (sortOrder === "asc") {
      return (a.verified === true) - (b.verified === true);
    } else {
      return (b.verified === true) - (a.verified === true);
    }
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        {/* TOP RIGHT CLOSE BUTTON */}
        <button className="top-close-btn" onClick={onClose}>✖</button>

        {/* School Header */}
        <div className="modal-header">
          <h3 className="school-name">SchoolName: {data.school_name || "-"}</h3>
          <span className="school-code">UDISE: {data.school_code}</span>
        </div>

        {/*  Items Table data */}
        <table>
          <thead>
            <tr>
              <th>Item ID</th>
              <th onClick={toggleSortOrder} style={{ cursor: "pointer" }}>
                Status {sortOrder === "asc" ? "⬆️" : "⬇️"}
              </th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.item_id}</td>
                <td>{item.verified ? "✅ Verified" : "❌ Unverified"}</td>
                <td>{item.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔽 Bottom Close */}
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ItemDetailModal;
