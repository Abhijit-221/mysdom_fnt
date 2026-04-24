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
    const [products, setProducts] = useState([]);
    const handleGenerate = async () => {
        console.log("button clicked")
        try {
            if (selectProduct.length) {
                const response = await axiosInstance.post("/bgvrequest/formlink", {
                    products: selectProduct
                });

                setLink(response?.data?.data?.link);
            }
            else {
                toast.error("Select any product")
            }
            // setIsModalOpen(true)
        }
        catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.message, "Faild to generate link.")
        }
    };
    const handleLink = async () => {
        console.log("button clicked")
        try {
            const response = await axiosInstance.get("product/list");
            setProducts(response?.data?.data);
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
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px"
        },
        modal: {
            width: "100%",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
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

        inputSection: {
            display: "flex",
            flexDirection: "column",
            gap: "12px"
        },
        inputWrapper: {
            display: "flex",
            gap: "10px"
        },
        input: {
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px"
        },
        copyBtn: {
            padding: "10px 14px",
            backgroundColor: "#7c3aed",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
        },
        emailBox: {
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "8px",
            minHeight: "48px"
        },
        tagContainer: {
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "center"
        },
        emailTag: {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#ede9fe",
            color: "#5b21b6",
            padding: "6px 10px",
            borderRadius: "20px",
            fontSize: "13px"
        },
        removeBtn: {
            border: "none",
            background: "transparent",
            color: "#5b21b6",
            cursor: "pointer",
            fontSize: "14px"
        },
        emailInput: {
            border: "none",
            outline: "none",
            flex: 1,
            minWidth: "220px",
            padding: "8px",
            fontSize: "14px"
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

    const [selectProduct, setSelectProduct] = useState([]);
    const handleCheckboxChange = (productId) => {
        setSelectProduct((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setProducts([]);
        setSelectProduct([]);
        setLink("")
    }



    //let sent link to user email
    const [emailInput, setEmailInput] = useState("");
    const [emails, setEmails] = useState([]);
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    const addEmails = (value) => {
        const splitEmails = value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "");

        const validEmails = splitEmails.filter(validateEmail);

        setEmails((prev) => [...new Set([...prev, ...validEmails])]);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addEmails(emailInput);
            setEmailInput("");
        }
    };
     const removeEmail = (email) => {
        setEmails((prev) => prev.filter((item) => item !== email));
    };
    const handleBlur = () => {
        if (emailInput.trim()) {
            addEmails(emailInput);
            setEmailInput("");
        }
    };
    const handelSendMail = async () => {
        try {
            const payload = {
                formLink:link,
                emails
            };
            let response=await axiosInstance.post(`/mail/send-formlink`,payload);

            console.log("payload:", payload);
            toast.success(response?.data.message);
        }
        catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.message, "Faild to generate link.")

        }
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

                                <button className="link-btn" onClick={handleLink}>
                                    Generate Link..
                                </button>

                                {/* MODAL */}
                                {isModalOpen && (
                                    <div style={styles.overlay}>
                                        <div style={styles.modal}>
                                            <div className="product-select-box">
                                                <h2>Select Products</h2>

                                                <div className="product-list">
                                                    {products.map((product) => (
                                                        <label key={product.id} className="product-item">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectProduct.includes(product.id)}
                                                                onChange={() => handleCheckboxChange(product.id)}
                                                            />
                                                            <span>{product.title}</span>
                                                        </label>
                                                    ))}
                                                </div>

                                                <div className="selected-output">
                                                    <h3>Selected Products:</h3>
                                                    {selectProduct.length > 0 ? (
                                                        <ul>
                                                            {products
                                                                .filter((product) => selectProduct.includes(product.id))
                                                                .map((product) => (
                                                                    <li key={product.id}>{product.title}</li>
                                                                ))}
                                                        </ul>
                                                    ) : (
                                                        <p>No product selected</p>
                                                    )}
                                                </div>
                                                <div className="link-btn-section">
                                                    <button className="generate-link-btn" onClick={handleGenerate}>Create link..</button>
                                                    <button className="clear-link-btn" onClick={() => setLink("")}>Clear</button>
                                                </div>
                                            </div>
                                            {/* Header */}
                                            <div style={styles.header}>
                                                <div style={styles.icon}>🔗</div>
                                                <h3 style={styles.title}>Form Link</h3>
                                            </div>

                                            {/* Description */}
                                            <p style={styles.subtitle}>
                                                Share this link with the user to fill the form.
                                            </p>


                                            <div>
                                                {
                                                    link &&
                                                    <div style={styles.inputSection}>
                                                        <div style={styles.inputWrapper}>
                                                            <input value={link} readOnly style={styles.input} />
                                                            <button style={styles.copyBtn} onClick={handleCopy}>
                                                                Copy
                                                            </button>
                                                        </div>

                                                        <div style={styles.emailBox}>
                                                            <div style={styles.tagContainer}>
                                                                {emails.map((email) => (
                                                                    <div key={email} style={styles.emailTag}>
                                                                        <span>{email}</span>
                                                                        <button
                                                                            type="button"
                                                                            style={styles.removeBtn}
                                                                            onClick={() => removeEmail(email)}
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    </div>
                                                                ))}

                                                                <input
                                                                    type="text"
                                                                    value={emailInput}
                                                                    onChange={(e) => setEmailInput(e.target.value)}
                                                                    onKeyDown={handleKeyDown}
                                                                    onBlur={handleBlur}
                                                                    placeholder="Enter email and press comma or Enter"
                                                                    style={styles.emailInput}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* <button onClick={handelSendMail}>Send</button> */}
                                                    </div>
                                                }

                                                {/* Footer Buttons */}
                                                <div style={styles.footer}>
                                                    {link &&
                                                        <button
                                                            style={styles.openBtn}
                                                            // type={!link || !payload.length?"hidden":"button"}
                                                            // onClick={() => window.open(link, "_blank")}
                                                            onClick={handelSendMail}
                                                        >
                                                            Send
                                                        </button>}

                                                    <button
                                                        style={styles.closeBtn}
                                                        onClick={handleClose}
                                                    >
                                                        Close
                                                    </button>
                                                </div>
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
                                        {['admin', 'superadmin'].includes(user.role) && <button
                                            className="edit-btn"
                                            onClick={() =>
                                                navigate(`/bgv-update/${req.id}`)
                                            }
                                        >
                                            <Edit size={16} />
                                        </button>
                                            //  ? <button
                                            //     className="edit-btn"
                                            //     onClick={() =>
                                            //         navigate(`/bgv-view`, {
                                            //             state: { data: req, mode: "edit", role: user.role }
                                            //         })
                                            //     }
                                            // >
                                            //     <Edit size={16} />
                                            // </button> : 
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