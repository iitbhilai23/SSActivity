import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import interceptor from "../utils/interceptor";
import { toast } from "react-toastify";
import "../styles/ItemDetailModal.css";

function SchoolItemDetailPage() {
  const { school_code } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
 
    console.log("useEffect ट्रिगर हुआ, school_code:", school_code);
    let isMounted = true; 

    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("API कॉल शुरू, URL:", `${interceptor.defaults.baseURL}/verification-summary/school-items/${school_code}`);
        const response = await interceptor.get(`/verification-summary/school-items/${school_code}`);
        console.log("API रिस्पॉन्स प्राप्त हुआ:", response.data);
        if (isMounted && response.data.success && Array.isArray(response.data.data)) {
          setItems(response.data.data);
        } else {
          console.log("डेटा नहीं मिला या संरचना गलत, response:", response.data);
          if (isMounted) setItems([]);
        }
      } catch (error) {
        console.error("API त्रुटि:", error.message, error.response?.data || "कोई रिस्पॉन्स नहीं");
        if (isMounted) {
          setError("डेटा लोड करने में त्रुटि हुई।");
          toast.error("स्कूल आइटम लोड करने में त्रुटि।");
        }
      } finally {
        if (isMounted) setLoading(false);
        console.log("लोडिंग खत्म, items:", items);
      }
    };

    if (school_code) fetchItems();


    return () => {
      isMounted = false;
    };
  }, [school_code]);

  if (loading) return <div>लोड हो रहा है...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="school-item-detail-container">
      <h2>📚 स्कूल कोड: {school_code} के लिए आइटम</h2>
      <button className="back-btn" onClick={() => navigate(-1)}>⬅️ डैशबोर्ड पर वापस</button>
      <table>
        <thead>
          <tr>
            <th>आइटम ID</th>
            <th>स्थिति</th>
            <th>टिप्पणियाँ</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="3">कोई आइटम नहीं मिला</td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={index}>
                <td>{item.item_id || "-"}</td>
                <td>{item.verified ? "✅ सत्यापित" : "❌ असत्यापित"}</td>
                <td>{item.remarks || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SchoolItemDetailPage;