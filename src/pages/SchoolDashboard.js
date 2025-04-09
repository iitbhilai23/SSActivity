import React, { useEffect, useState, useContext } from "react";
import "../styles/DashboardHome1.css";
import { AuthContext } from "../context/AuthContext";
import ItemTable from "../components/ItemTable";
import axios from "../utils/interceptor";

function SchoolDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [items, setItems] = useState([]);
  const schoolCode = user?.school_code;

  const requiredTypes = [
    "FLN Book",
    "FLN Books",
    "Library Book",
    "Sports Equipment",
    "Sanitary Vending Machine",
  ];

  useEffect(() => {
    if (!schoolCode) return;
    axios
      .get(`/school/items-stats?school_code=${schoolCode}`)
      .then((res) => {
        const filteredStats = res.data?.data?.filter((stat) =>
          requiredTypes.includes(stat.item_type)
        );
        setStats(filteredStats || []);
      })
      .catch((err) => console.error("Error loading stats:", err));
  }, [schoolCode]);

  const fetchItems = (type) => {
    setSelectedType(type);
    axios
      .get(
        `/school/unverified-items?school_code=${schoolCode}&item_type=${type}`
      )
      .then((res) => setItems(res.data?.data || []))
      .catch((err) => console.error("Error loading items:", err));
  };

  return (
    <div className="school-dashboard modern-ui">
      <h2 className="dashboard-heading gradient-text">📊 Welcome, {user?.name || `School ${user?.school_code}`}</h2>
      <p className="dashboard-subtitle">Your Item Summary & Actions</p>

      {/* Stat Cards Section */}
      <div className="dashboard-card-grid">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="dashboard-card-style"
            onClick={() => fetchItems(stat.item_type)}
          >
            <div className="card-top">
              <div className="card-icon-circle">
                {stat.item_type.toLowerCase().includes("fln") && "📘"}
                {stat.item_type.toLowerCase().includes("library") && "📚"}
                {stat.item_type.toLowerCase().includes("sports") && "🏀"}
                {stat.item_type.toLowerCase().includes("sanitary") && "🚺"}
              </div>
              <div className="card-count"><span style={{color:"#663399"}}>Total Items</span> &nbsp;<span style={{color:"#FF7588"}}>{stat.total_items}</span></div>
            </div>
            <div className="card-label">{stat.item_type}</div>
            <div className="card-footer">
              ✅ {stat.total_verified} Verify | ❌ {stat.total_items - stat.total_verified} Unverified
            </div>
          </div>
        ))}
      </div>

      {/* Unverified Item Table */}
      {selectedType && (
        <div className="item-table-section refined-table">
          <h3 className="selected-title">📋 {selectedType} - Unverified Items</h3>
          <ItemTable items={items} />
        </div>
      )}
    </div>
  );
}

export default SchoolDashboard;