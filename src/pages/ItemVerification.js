import React, { useState, useEffect, useContext } from "react";
import interceptor from "../utils/interceptor";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ItemVerification.css";

function ItemVerification({ itemType: propItemType }) {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [verificationData, setVerificationData] = useState({});
  const [itemType, setItemType] = useState(propItemType || "");
  const [schoolInfo, setSchoolInfo] = useState({});
  const [previousVerifications, setPreviousVerifications] = useState([]);
  const [submissionCountByItem, setSubmissionCountByItem] = useState({});

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const response = await interceptor.get(`/school/details?school_code=${user.school_code}`);
        setSchoolInfo(response.data);
      } catch {
        toast.error("Failed to fetch school details");
      }
    };
    fetchSchoolDetails();
  }, [user.school_code]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!itemType) return;
      try {
        const response = await interceptor.get(
          `/school/items?school_code=${user.school_code}&item_type=${itemType}`
        );
        setItems(response.data.data || []);
      } catch {
        toast.error("Failed to load items");
      }
    };
    fetchItems();
  }, [user.school_code, itemType]);

  useEffect(() => {
    const fetchPreviousVerification = async () => {
      try {
        const res = await interceptor.get("/verification/all");
        const data = res.data.verifications;
        const schoolVerifications = data.filter(
          (entry) => entry.receiver_id === user.school_code
        );
        setPreviousVerifications(schoolVerifications);

        const grouped = schoolVerifications.reduce((acc, curr) => {
          acc[curr.item_id] = (acc[curr.item_id] || 0) + 1;
          return acc;
        }, {});

        setSubmissionCountByItem(grouped);
      } catch {
        toast.error("Failed to load previous verification");
      }
    };

    fetchPreviousVerification();
  }, [user.school_code]);

  useEffect(() => {
    if (items.length === 0 || previousVerifications.length === 0) return;

    const filledData = {};

    items.forEach((item) => {
      const match = previousVerifications.find(
        (v) => v.item_id === item.item_id
      );

      if (match) {
        filledData[item.item_id] = {
          status: match.verified ? "Received" : "Not Received",
          remarks: match.remarks || "",
          distribution_id: match.distribution_id || null
        };
      }
    });

    setVerificationData(filledData);
  }, [items, previousVerifications]);

  const handleChange = (itemId, field, value) => {
    setVerificationData(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleVerifyAll = () => {
    const updatedData = {};
    items.forEach(item => {
      updatedData[item.item_id] = {
        verified: true,
        remarks: "",
        status: "Received"
      };
    });
    setVerificationData(updatedData);
    toast.success("All items marked as Received");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedItems = Object.entries(verificationData)
      .filter(([_, data]) => data.status)
      .map(([itemId, data]) => ({
        item_id: parseInt(itemId),
        distribution_id: data.distribution_id || null,
        receiver_role: "School",
        receiver_id: user.school_code,
        verified: data.status === "Received",
        received_quantity: 1,
        remarks: data.remarks || ""
      }));

    if (selectedItems.length === 0) {
      toast.error("Please mark at least one item");
      return;
    }

    const exceededItems = selectedItems.filter(item => (submissionCountByItem[item.item_id] || 0) >= 2);

    if (exceededItems.length > 0) {
      toast.error("आप 2 बार सत्यापन कर चुके हैं। पुनः सत्यापन हेतु कृपया संकुल समन्वयक से संपर्क करें। सत्यापित।");
      return;
    }

    try {
      await interceptor.post("/verification/add", selectedItems);
      toast.success("Items verified successfully!");
      setVerificationData({});
    } catch (error) {
      // toast.error(error.response?.data?.error || "Verification failed");
   
      const errMsg = error.response?.data?.error || error.message || "Verification failed";

      toast.error(errMsg);
  

    }
  };

  return (
    <div className="verification-container">
      <h2 className="heading">School Item Verification</h2>

      <div className="user-details">
        <p><strong>School Name:</strong> {schoolInfo.school_name}</p>
        <p><strong>UDISE Code:</strong> {user.school_code}</p>
      </div>

      <form onSubmit={handleSubmit} className="verification-form">
        <table className="verification-table">
          <thead>
            <tr>
              <th width='120'>Reference ID</th>
              <th>Item Name</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map(item => {
                const selected = verificationData[item.item_id]?.status;
                const rowClass =
                  selected === "Received" ? "received-row"
                  : selected === "Not Received" ? "not-received-row"
                  : "";

                const match = previousVerifications.find(
                  (v) => v.item_id === item.item_id
                );

                return (
                  <tr key={item.item_id} className={rowClass}>
                    <td>{item.reference_id}</td>
                    <td>{item.item_name}</td>
                    <td>
                      <div className="status-radio">
                        <label>
                          <input
                            type="radio"
                            name={`status-${item.item_id}`}
                            value="Received"
                            checked={selected === "Received"}
                            onChange={(e) => handleChange(item.item_id, "status", e.target.value)}
                          /> Received
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`status-${item.item_id}`}
                            value="Not Received"
                            checked={selected === "Not Received"}
                            onChange={(e) => handleChange(item.item_id, "status", e.target.value)}
                          /> Not Received
                        </label>
                        {match && (
                          <small style={{ color: "#3f214b", display: "block", marginTop: "4px" }}>
                            Already Verified (Past Attempt)
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter remarks (optional)"
                        className="remarks-input"
                        value={verificationData[item.item_id]?.remarks || ""}
                        onChange={(e) => handleChange(item.item_id, "remarks", e.target.value)}
                        disabled={selected !== "Received"}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="no-data">No items found</td>
              </tr>
            )}
          </tbody>
        </table>

        {items.length > 0 && (
          <div className="summary-controls">
            <div><strong>Total Items: {items.length}</strong></div>
            <button type="button" onClick={handleVerifyAll} className="verify-all-btn">
              Mark All as Received
            </button>
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={items.length === 0}>
          Submit Verification
        </button>
      </form>
    </div>
  );
}

export default ItemVerification;
