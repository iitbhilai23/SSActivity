import React, { useEffect, useState } from "react";
import interceptor from "../utils/interceptor";
import "../styles/FLNBookEntry.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AllItems() {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchItems();
    }, [currentPage, searchTerm]);

    const fetchItems = async () => {
        try {
            const response = await interceptor.get("/items/all", {
                params: {
                    page: currentPage,
                    limit: 50,
                    item_name: searchTerm
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setItems(response.data.items);
            setTotalPages(Math.ceil(response.data.total / 50));
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error("Access Denied. Check your user role or login again.");
            } else {
                toast.error("Failed to load items. Please try again.");
            }
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleDelete = async (item_id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await interceptor.delete(`/items/delete/${item_id}`);
                toast.success("Item deleted successfully!");
                fetchItems();
            } catch (error) {
                toast.error("Failed to delete item.");
            }
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="fln-container">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="header-section">
                <h2 className="left-title">All Items</h2>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by Item Name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <table className="fln-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Reference ID</th>
                        <th>Item Type</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Agency</th>
                        <th>Total Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <tr key={item.item_id}>
                                <td>{item.item_id}</td>
                                <td>{item.reference_id}</td>
                                <td>{item.item_type}</td>
                                <td>{item.item_name}</td>
                                <td>{item.category_name}</td>
                                <td>{item.agency_name}</td>
                                <td>{item.total_quantity}</td>
                                <td>
                                    <FaTrashAlt
                                        className="icon delete-icon"
                                        onClick={() => handleDelete(item.item_id)}
                                        style={{ cursor: "pointer" }}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No Items Available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
}

export default AllItems;
