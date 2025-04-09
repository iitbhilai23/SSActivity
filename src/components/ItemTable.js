import React from "react";
import "../styles/DashboardHome.css";
import "../styles/ItemTable.css";

function ItemTable({ items }) {
    return (
        <table className="item-table">
            <thead>
                <tr>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>Item Type</th>
                </tr>
            </thead>
            <tbody>
                {items.length === 0 ? (
                    <tr><td colSpan="3">No unverified items</td></tr>
                ) : (
                    items.map((item) => (
                        <tr key={item.item_id}>
                            <td>{item.item_id}</td>
                            <td>{item.item_name}</td>
                            <td>{item.item_type}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}

export default ItemTable;
