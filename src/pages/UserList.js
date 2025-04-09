import React, { useEffect, useState } from "react";
import interceptor from "../utils/interceptor";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      const response = await interceptor.get("/users/all", {
        params: {
          page: currentPage,
          limit: usersPerPage,
          search: searchTerm
        }
      });
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.total / usersPerPage));
    } catch (error) {
      toast.error("Error fetching users!");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      const response = await interceptor.post("/users/update-status", {
        user_id: userId,
        status: newStatus,
      });

      if (response.status === 200) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.user_id === userId ? { ...user, status: newStatus } : user
          )
        );
        toast.success(`User status updated to ${newStatus}!`);
      } else {
        toast.error("Failed to update user status.");
      }
    } catch (error) {
      toast.error("Failed to update user status.");
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="user-list">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>User Management</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="Search by Name or Email"
        value={searchTerm}
        onChange={handleSearch}
      />

      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusUpdate(user.user_id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">No users found.</td></tr>
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

export default UserList;