import { useEffect, useState } from "react";
import axios from "axios";
import AddUserModal from "./AddUserModal";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import "./manageUsers.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get(
                "/auth/user-list",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    params: {
                        search,
                        page,
                        limit,
                    },
                }
            );

            const usersData = res?.data?.data?.users || [];
            const totalCount = res?.data?.data?.count || 0;
            const userDataWithStatus = usersData.filter((user) => (user.role !== "superadmin"));
            setUsers(userDataWithStatus);

            // 🔥 Calculate total pages
            setTotalPages(Math.ceil(totalCount / limit));

        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to load users"
            );
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    //update status handler 
    const handleStatusToggle = async (user) => {
        try {
            const token = localStorage.getItem("token");
            // console.log("user:-->", user);
            const formData = new FormData();
            formData.append("id", user.id);
            formData.append("isActive", !user.isActive);
            const user2 = await axiosInstance.post(
                `/auth/user-update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            // console.log(user2);
            toast.success(user2.data.message);
            // Refresh user list
            fetchUsers();

        } catch (err) {
             if (err.response) {
                // Server responded with error (4xx, 5xx)
                console.log("Status:", err.response.status);
                console.log("Data:", err.response.data);

                toast.error(err.response.data.message || "Server Error");
            }
            else if (err.request) {
                // Request was sent but no response received
                console.log("No response received:", err.request);
                toast.error("No response from server");
            }
            else {
                // Something else happened
                console.log("Error:", err.message);
                toast.error(err.message);
            }
        }
    };



    return (
        <div className="user-management">

            {/* Header */}
            <div className="user-management-header">
                <h2>User Management</h2>
                <button
                    className="um-add-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Add User
                </button>
            </div>

            {/* Search */}
            <div className="um-search-container">
                <input
                    type="text"
                    placeholder="Search user..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            {/* Table */}
            <div className="um-table">
                <div className="um-table-head">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Status</span>
                    <span>Action</span>
                </div>

                {users.length === 0 ? (
                    <div className="no-data">No users found</div>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="um-table-row">
                            <span>{user.username}</span>
                            <span>{user.email}</span>

                            <span className={`um-role-badge ${user.role}`}>
                                {user.role}
                            </span>

                            <button
                                className={`um-status-toggle ${user.isActive ? "active" : "inactive"
                                    }`}
                                onClick={() => handleStatusToggle(user)}
                            >
                                {user.isActive ? "Active" : "Inactive"}
                            </button>

                            <span className="um-actions">
                                <button className="icon-btn view"
                                    onClick={() => navigate(`/users/${user.id}`)}
                                >
                                    <FaEye />
                                </button>

                                <button className="icon-btn edit"
                                    onClick={() => navigate(`/users/${user.id}`)}
                                >
                                    <FaEdit />
                                </button>

                                <button className="icon-btn delete">
                                    <FaTrash />
                                </button>
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="um-pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </button>

                <span>
                    Page {page} of {totalPages || 1}
                </span>

                <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>

            {showModal && (
                <AddUserModal
                    close={() => setShowModal(false)}
                    refresh={fetchUsers}
                />
            )}
        </div>
    );
}

export default ManageUsers;