import { useEffect, useState } from "react";
import "./bgvRequestList.css";
import axiosInstance from "../../api/axiosInstance";
import Pagination from "../commn/Pagination";
import SearchBox from "../commn/SearchBox";
import { DownloadIcon, Edit, Search, ViewIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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


    //generate bgv form link

    const [link, setLink] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleGenerate = async () => {
        console.log("button clicked")
        try {
            const response =  await axiosInstance.post("/bgvrequest/formlink");
            setLink(response?.data?.data?.link);
            setIsModalOpen(true)
        }
        catch (err) {
            console.log(err);
            toast.error(err?.response?.message, "Faild to generate link.")
        }
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        alert("Link copied!");
    };
    const styles = {
        overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
        },

        modal: {
            background: "#fff",
            padding: "24px",
            borderRadius: "16px",
            width: "420px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            animation: "fadeIn 0.3s ease",
        },

        header: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
        },

        icon: {
            fontSize: "22px",
        },

        title: {
            margin: 0,
            fontSize: "18px",
            fontWeight: "600",
        },

        subtitle: {
            fontSize: "13px",
            color: "#666",
            marginBottom: "15px",
        },

        inputWrapper: {
            display: "flex",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "20px",
        },

        input: {
            flex: 1,
            border: "none",
            padding: "10px",
            fontSize: "13px",
            outline: "none",
        },

        copyBtn: {
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 14px",
            cursor: "pointer",
            fontSize: "13px",
        },

        footer: {
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
        },

        openBtn: {
            flex: 1,
            background: "#16a34a",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer",
        },

        closeBtn: {
            flex: 1,
            background: "#e5e7eb",
            border: "none",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer",
        },
    };

    console.log("isModalOpen:", isModalOpen);


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
                            <div className="upload-btn-group">
                                <a className="batch-upload-link" href="/batch/upload">
                                    ⬆️ Batch Upload
                                </a>

                                <button className="link-btn" onClick={handleGenerate}>
                                    Generate Link..
                                </button>

                                {/* MODAL */}
                                {isModalOpen && (
                                    <div style={styles.overlay}>
                                        <div style={styles.modal}>

                                            {/* Header */}
                                            <div style={styles.header}>
                                                <div style={styles.icon}>🔗</div>
                                                <h3 style={styles.title}>Form Link Generated</h3>
                                            </div>

                                            {/* Description */}
                                            <p style={styles.subtitle}>
                                                Share this link with the user to fill the form.
                                            </p>

                                            {/* Input + Copy */}
                                            <div style={styles.inputWrapper}>
                                                <input
                                                    value={link}
                                                    readOnly
                                                    style={styles.input}
                                                />
                                                <button style={styles.copyBtn} onClick={handleCopy}>
                                                    Copy
                                                </button>
                                            </div>

                                            {/* Footer Buttons */}
                                            <div style={styles.footer}>
                                                <button
                                                    style={styles.openBtn}
                                                    onClick={() => window.open(link, "_blank")}
                                                >
                                                    Open
                                                </button>

                                                <button
                                                    style={styles.closeBtn}
                                                    onClick={() => setIsModalOpen(false)}
                                                >
                                                    Close
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div>

                        )}

                        {/* <a className="batch-download-link" href="/batch/upload">
                            ⬇️ Report download
                        </a> */}
                    </div>
                </div>
            </div>

            <div className="bgv-table-wrapper">
                <table className="bgv-table">

                    <thead>
                        <tr>
                            <th>Sl no</th>
                            <th>Candidate Name</th>
                            <th>Request No</th>
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
                                    <td>{req.req_code}</td>
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
                                            <ViewIcon size={16} />
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
                                                <Edit size={16} />
                                            </button> : <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    navigate(`/bgv-update/${req.id}`)
                                                }
                                            >
                                                <Edit size={16} />
                                            </button>
                                        }
                                        <button
                                            className="download-btn"
                                            onClick={() =>
                                                navigate("/bgv-report", {
                                                    state: { data: req, mode: "report" }
                                                })
                                            }
                                        >
                                            <DownloadIcon size={16} />
                                        </button>

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