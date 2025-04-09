import React, { useState, useEffect, useContext } from "react";
import interceptor from "../utils/interceptor";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/DistributeItem.css";

function DistributeItem() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [distributionData, setDistributionData] = useState({
    item_id: "",
    from_role: user?.role || "",
    from_id: user?.user_id || "",
    to_role: "",
    to_id: "",
    quantity: "",
    distributed_by: user?.user_id || ""
  });

  // ✅ Fetch items from item_master table
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await interceptor.get("/items/all");
        console.log(response);

        // Check if response is array
        if (Array.isArray(response.data)) {
          setItems(response.data);
        } else if (Array.isArray(response.data.data)) {
          setItems(response.data.data); // In case of { data: [...] }
        } else {
          console.error("❌ Invalid /items/all response:", response.data);
          setItems([]);
        }
      } catch (error) {
        toast.error("Failed to load item list");
        setItems([]);
      }
    };
    fetchItems();
  }, []);

  // ✅ Update from_id and distributed_by when user updates
  useEffect(() => {
    if (user) {
      setDistributionData(prev => ({
        ...prev,
        from_role: user.role,
        from_id: user.user_id,
        distributed_by: user.user_id
      }));
    }
  }, [user]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setDistributionData({ ...distributionData, [e.target.name]: e.target.value });
  };

  // ✅ Set item_id when item is selected from dropdown
  const handleItemSelect = (e) => {
    const selectedItemId = e.target.value;
    setDistributionData(prev => ({
      ...prev,
      item_id: selectedItemId
    }));
  };

  // ✅ Submit the distribution form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await interceptor.post("/distribution/add", distributionData);
      toast.success(response.data.message || "Item distributed successfully");

      // Reset form (except from_ fields)
      setDistributionData({
        item_id: "",
        from_role: user?.role || "",
        from_id: user?.user_id || "",
        to_role: "",
        to_id: "",
        quantity: "",
        distributed_by: user?.user_id || ""
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to distribute item");
    }
  };

  const handleReset = () => {
    setDistributionData({
      item_id: "",
      from_role: user?.role || "",
      from_id: user?.user_id || "",
      to_role: "",
      to_id: "",
      quantity: "",
      distributed_by: user?.user_id || ""
    });
  };
  

  return (
    <div className="fln-container">
      <h2>Distribute Item</h2>
      <form onSubmit={handleSubmit} className="fln-form">

<div className="form-group">
  <label>Select Item</label>
  <select name="item_id" value={distributionData.item_id} onChange={handleItemSelect} required>
    <option value="">-- Select Item --</option>
    {items.map(item => (
      <option key={item.item_id} value={item.item_id}>
        {item.item_name} ({item.item_type})
      </option>
    ))}
  </select>
</div>

<div className="form-group">
  <label>From ID</label>
  <input type="text" name="from_id" value={distributionData.from_id} readOnly />
</div>

<div className="form-group">
  <label>From Role</label>
  <input type="text" name="from_role" value={distributionData.from_role} readOnly />
</div>

<div className="form-group">
  <label>To Role</label>
  <select
    name="to_role"
    value={distributionData.to_role}
    onChange={handleChange}
    required
  >
    <option value="">-- Select To Role --</option>
    <option value="Cluster">Cluster</option>
    <option value="BEO">BEO</option>
    <option value="DEO">DEO</option>
    <option value="School">School</option>
    <option value="CIIL">CIIL</option>
    <option value="NBT">NBT</option>
    <option value="EOI">EOI</option>
  </select>
</div>

<div className="form-group">
  <label>To ID</label>
  <input
    type="text"
    name="to_id"
    value={distributionData.to_id}
    onChange={handleChange}
    required
  />
</div>

<div className="form-group">
  <label>Quantity</label>
  <input
    type="number"
    name="quantity"
    value={distributionData.quantity}
    onChange={handleChange}
    required
  />
</div>

<div className="single-button">
  <button type="submit" className="btn-submit" onClick={handleReset}>Distribute</button>

</div>
</form>
    </div>
  );
}

export default DistributeItem;
