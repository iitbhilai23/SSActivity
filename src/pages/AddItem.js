import React, { useState } from "react";
import interceptor from "../utils/interceptor";
import { toast } from "react-toastify";
import '../styles/AddItem.css';

const AddItem = () => {
    const [itemData, setItemData] = useState({
      reference_id: '',
      item_type: '',
      item_name: '',
      category_id: '',
      category_name: '',
      agency_code: '',
      agency_name: '',
      total_quantity: ''
    });

    const handleChange = (e) => {
      setItemData({
        ...itemData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await interceptor.post("/items/add", itemData); // Updated endpoint to match backend
        toast.success(response.data.message);
        setItemData({
          reference_id: '',
          item_type: '',
          item_name: '',
          category_id: '',
          category_name: '',
          agency_code: '',
          agency_name: '',
          total_quantity: ''
        });
      } catch (error) {
        toast.error(error.response?.data?.error || "Something went wrong");
      }
    };

    return (
      <div className="add-item-container">
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit} noValidate>
          <input type="text" name="reference_id" placeholder="Reference ID" value={itemData.reference_id} onChange={handleChange} required />

          <select name="item_type" value={itemData.item_type} onChange={handleChange} required>
            <option value="">Select Item Type</option>
            <option value="FLN Book">FLN Book</option>
            <option value="Sports Equipment">Sports Equipment</option>
            <option value="Library Book">Library Book</option>
            <option value="Sanitary Vending Machine">Sanitary Vending Machine</option>
          </select>

          <input type="text" name="item_name" placeholder="Item Name" value={itemData.item_name} onChange={handleChange} required />

          <select name="category_id" value={itemData.category_id} onChange={handleChange} required>
            <option value="">Select Category ID</option>
            <option value="91">91</option>
            <option value="92">92</option>
            <option value="93">93</option>
            <option value="94">94</option>
          </select>

          <select name="category_name" value={itemData.category_name} onChange={handleChange} required>
            <option value="">Select Category Name</option>
            <option value="Primary">Primary</option>
            <option value="Upper Primary">Upper Primary</option>
            <option value="High School">High School</option>
            <option value="Higher Secondary">Higher Secondary</option>
          </select>

          <select name="agency_code" value={itemData.agency_code} onChange={handleChange} required>
            <option value="">Select Agency Code</option>
            <option value="1">1 (CIIL)</option>
            <option value="2">2 (NBT)</option>
            <option value="3">3 (EOI)</option>
          </select>

          <select name="agency_name" value={itemData.agency_name} onChange={handleChange} required>
            <option value="">Select Agency Name</option>
            <option value="CIIL">CIIL</option>
            <option value="NBT">NBT</option>
            <option value="EOI">EOI</option>
          </select>

          <input type="number" name="total_quantity" placeholder="Total Quantity" value={itemData.total_quantity} onChange={handleChange} required />

          <button type="submit">Add Item</button>
        </form>
      </div>
    );
  };

  export default AddItem;
