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
    // console.log("requests:", requests);


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

            <div className="bgv-header">
                <h2>BGV Request List</h2>
                <div className="filter-section">
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
                    {/* <StatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} /> */}
                    {user.role==='user' && <button className="add-request-btn" onClick={()=>(navigate('/bgv/add'))}>
                        + Add Request
                    </button>}
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
                                    <td>
                                        <span className={`status ${req.status}`}>
                                            {req.status = req.status === 'IN_PROGRESS' ? 'IN PROGRESS' : req.status === 'ON_HOLD' ? 'ON HOLD' : req.status}
                                        </span>
                                    </td>
                                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>

                                    <td className="actions">
                                        <button className="view-btn">View</button>
                                        {/* <button className="edit-btn">Edit</button> */}
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