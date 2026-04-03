import { useEffect, useState } from "react";
import "./bgvRequestList.css";
import axiosInstance from "../../api/axiosInstance";
import Pagination from "../commn/Pagination";
import SearchBox from "../commn/SearchBox";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BgvRequestList() {
    const [requests, setRequests] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    // const [statusFilter, setStatusFilter] = useState('');

    const fetchRequests = async () => {
        try {
            const res = await axiosInstance.get("/bgvrequest/get", {
                params: {
                    search,
                    page,
                    limit,
                    // status:statusFilter
                },
            });
            setRequests(res?.data?.data?.bgvRequests || []);
            const totalCount = res?.data?.data?.count || 0;
            setTotalPages(Math.ceil(totalCount / limit));
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchRequests();
    }, [page, search]);
    // console.log("user:", user);


    function StatusFilter({ statusFilter, setStatusFilter }) {
        return (
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-dropdown"
            >
                <option value="">All Statuses</option>
                <option value="NEW">NEW</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="ON_HOLD">ON HOLD</option>
                <option value="REJECTED">REJECTED</option>
                <option value="COMPLETED">COMPLETED</option>
            </select>
        );
    }



    return (
        <div className="bgv-container">
            <div className="mysdom-bgv-header">
                <div className="left-section">
                    <h2>BGV <span>Requests</span></h2>

                    <div className="search-input">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search client..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                </div>

                <div className="right-section">

                    <div className="report-section">
                        {user.role === 'user' && (
                            <button className="add-request-btn" onClick={() => navigate('/bgv/add')}>
                                + Add Request
                            </button>
                        )}
                        {user.role === 'user' && (
                            <a className="batch-upload-link" href="/batch/upload">
                                ⬆️ Batch Upload
                            </a>
                        )}

                        <a className="batch-download-link" href="/batch/upload">
                            ⬇️ Report download
                        </a>
                    </div>
                </div>
            </div>

            <div className="bgv-table-wrapper">
                <table className="bgv-table">

                    <thead>
                        <tr>
                            <th>Sl no</th>
                            <th>Candidate Name</th>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Requested Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">
                                    No Requests Found
                                </td>
                            </tr>
                        ) : (
                            requests.map((req, index) => (
                                <tr key={req.id}>
                                    <td>{index + 1}</td>
                                    <td>{req.candidate_name}</td>
                                    <td>{req.client.companyName}</td>
                                    <td>{req.candidate_email}</td>
                                    <td>{req.candidate_phone}</td>
                                    <td>
                                        <span className={`status ${req.status}`}>
                                            {req.status = req.status === 'IN_PROGRESS' ? 'IN PROGRESS' : req.status === 'ON_HOLD' ? 'ON HOLD' : req.status}
                                        </span>
                                    </td>
                                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>

                                    <td className="actions">
                                        {/* <button
                                            className="view-btn"
                                            onClick={() => navigate("/bgv-view", { state: { data: req } })}
                                        >
                                            View
                                        </button> */}
                                        <button
                                            className="view-btn"
                                            onClick={() =>
                                                navigate("/bgv-view", {
                                                    state: { data: req, mode: "view" }
                                                })
                                            }
                                        >
                                            View
                                        </button>
                                        {
                                            user.role === 'user' ? <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    navigate(`/bgv-view`, {
                                                        state: { data: req, mode: "edit", role: user.role }
                                                    })
                                                }
                                            >
                                                Edit
                                            </button> : <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    navigate(`/bgv-update/${req.id}`)
                                                }
                                            >
                                                Edit
                                            </button>
                                        }

                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
            {/* pagination section */}
            <Pagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />
        </div>
    );
}

export default BgvRequestList;