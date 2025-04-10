// import React, { useEffect, useState, useContext } from "react";
// import interceptor from "../utils/interceptor";
// import { AuthContext } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import Modal from "../components/ItemDetailModal";
// import "../styles/SummaryDashboard.css";

// function ClusterSummaryPage() {
//   const { user } = useContext(AuthContext);
//   const [summary, setSummary] = useState([]);
//   const [filteredSummary, setFilteredSummary] = useState([]);
//   const [filterType, setFilterType] = useState(null);
//   const [modalData, setModalData] = useState(null);

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const response = await interceptor.get(
//           `/verification-summary/cluster-summary/${user.cluster_id}`
//         );
//         const uniqueSchools = Object.values(
//           response.data.data.reduce((acc, item) => {
//             const code = item.school_code;
//             if (!acc[code]) {
//               acc[code] = {
//                 ...item,
//                 verified: Number(item.verified) || 0,
//                 unverified: Number(item.unverified) || 0,
//                 remarks: Number(item.remarks) || 0,
//               };
//             } else {
//               acc[code].verified += Number(item.verified) || 0;
//               acc[code].unverified += Number(item.unverified) || 0;
//               acc[code].remarks += Number(item.remarks) || 0;
//             }
//             return acc;
//           }, {})
//         );
//         setSummary(uniqueSchools);
//       } catch (error) {
//         toast.error("Failed to fetch cluster summary");
//       }
//     };
//     if (user?.role === "Cluster") fetchSummary();
//   }, [user]);

//   const totalSchools = summary.length;
//   const totalVerified = summary.reduce((sum, item) => sum + item.verified, 0);
//   const totalUnverified = summary.reduce((sum, item) => sum + item.unverified, 0);
//   const totalRemarks = summary.filter(item => item.remarks && item.remarks > 0).length;

//   const handleFilter = (type) => {
//     setFilterType(type);
//     if (type === "verified") {
//       setFilteredSummary(summary.filter(item => item.verified > 0));
//     } else if (type === "unverified") {
//       setFilteredSummary(summary.filter(item => item.unverified > 0));
//     } else if (type === "remarks") {
//       setFilteredSummary(summary.filter(item => item.remarks > 0));
//     } else {
//       setFilteredSummary([]);
//     }
//   };

//   const openSchoolDetail = async (school_code, school_name) => {
//     try {
//       const res = await interceptor.get(`/verification-summary/school-items/${school_code}`);
//       setModalData({ school_code, school_name, items: res.data.data });
//     } catch (error) {
//       toast.error("Failed to load school items");
//     }
//   };

//   return (
//     <div className="summary-container">
//       <h2 className="summary-title">📊 Cluster Summary Dashboard</h2>
//       <div className="summary-cards">
//         <div className="card card-blue">🟦 Total Schools: {totalSchools}</div>
//         <div className="card card-green" onClick={() => handleFilter("verified")}>🟩 Verified Items: {totalVerified}</div>
//         <div className="card card-red" onClick={() => handleFilter("unverified")}>🟥 Unverified Items: {totalUnverified}</div>
//         <div className="card card-yellow" onClick={() => handleFilter("remarks")}>🟨 Remarks Found: {totalRemarks}</div>
//       </div>

//       {filterType && (
//         <table className="summary-table">
//           <thead>
//             <tr>
//               <th>School Code</th>
//               <th>School Name</th>
//               <th className="text-green">✅ Verified</th>
//               <th className="text-red">❌ Unverified</th>
//               <th className="text-blue">📦 Total Items</th>
//               <th className="text-orange">📑 Remarks</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredSummary.map((item, index) => (
//               <tr key={index} onClick={() => openSchoolDetail(item.school_code, item.school_name)} className="clickable-row">
//                 <td>{item.school_code}</td>
//                 <td>{item.school_name || "-"}</td>
//                 <td>{item.verified}</td>
//                 <td>{item.unverified}</td>
//                 <td>{item.verified + item.unverified}</td>
//                 <td>{item.remarks || "-"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {modalData && (
//         <Modal
//           data={modalData}
//           onClose={() => setModalData(null)}
//         />
//       )}
//     </div>
//   );
// }

// export default ClusterSummaryPage;


import React, { useEffect, useState, useContext } from "react";
import interceptor from "../utils/interceptor";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Modal from "../components/ItemDetailModal";
import "../styles/SummaryDashboard.css";

function ClusterSummaryPage() {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState([]);
  const [filteredSummary, setFilteredSummary] = useState([]);
  const [filterType, setFilterType] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await interceptor.get(
          `/verification-summary/cluster-summary/${user.cluster_id}`
        );
        const uniqueSchools = Object.values(
          response.data.data.reduce((acc, item) => {
            const code = item.school_code;
            if (!acc[code]) {
              acc[code] = {
                ...item,
                verified: Number(item.verified) || 0,
                unverified: Number(item.unverified) || 0,
                remarks: Number(item.remarks) || 0,
              };
            } else {
              acc[code].verified += Number(item.verified) || 0;
              acc[code].unverified += Number(item.unverified) || 0;
              acc[code].remarks += Number(item.remarks) || 0;
            }
            return acc;
          }, {})
        );
        setSummary(uniqueSchools);
      } catch (error) {
        toast.error("Failed to fetch cluster summary");
      }
    };
    if (user?.role === "Cluster") fetchSummary();
  }, [user]);

  const totalSchools = summary.length;
  const verifiedSchools = summary.filter(s => s.verified > 0 && s.unverified === 0).length;
  const unverifiedSchools = summary.filter(s => s.unverified > 0 && s.verified === 0).length;
  const remarksSchools = summary.filter(s => s.remarks > 0).length;

  const handleFilter = (type) => {
    setFilterType(type);
    if (type === "verified") {
      setFilteredSummary(summary.filter(item => item.verified > 0 && item.unverified === 0));
    } else if (type === "unverified") {
      setFilteredSummary(summary.filter(item => item.unverified > 0 && item.verified === 0));
    } else if (type === "remarks") {
      setFilteredSummary(summary.filter(item => item.remarks > 0));
    } else {
      setFilteredSummary([]);
    }
  };

  const openSchoolDetail = async (school_code, school_name) => {
    try {
      const res = await interceptor.get(`/verification-summary/school-items/${school_code}`);
      setModalData({ school_code, school_name, items: res.data.data });
    } catch (error) {
      toast.error("Failed to load school items");
    }
  };

  return (
    <div className="summary-container">
      <h2 className="summary-title">📊 Cluster Summary Dashboard</h2>
      <div className="summary-cards">
        <div className="card card-blue">🏫 Total Schools: {totalSchools}</div>
        <div className="card card-green" onClick={() => handleFilter("verified")}>✅ Verified Schools: {verifiedSchools}</div>
        <div className="card card-red" onClick={() => handleFilter("unverified")}>❌ Unverified Schools: {unverifiedSchools}</div>
        <div className="card card-yellow" onClick={() => handleFilter("remarks")}>📝 Schools with Remarks: {remarksSchools}</div>
      </div>

      {filterType && filteredSummary.length > 0 && (
        <table className="summary-table">
          <thead>
            <tr>
              <th>School Code</th>
              <th>School Name</th>
              <th className="text-green">✅ Verified</th>
              <th className="text-red">❌ Unverified</th>
              <th className="text-blue">📦 Total Items</th>
              <th className="text-orange">📑 Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredSummary.map((item, index) => (
              <tr key={index} onClick={() => openSchoolDetail(item.school_code, item.school_name)} className="clickable-row">
                <td>{item.school_code}</td>
                <td>{item.school_name || "-"}</td>
                <td>{item.verified}</td>
                <td>{item.unverified}</td>
                <td>{item.verified + item.unverified}</td>
                <td>{item.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalData && (
        <Modal
          data={modalData}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
}

export default ClusterSummaryPage;

