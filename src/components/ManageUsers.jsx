import { useEffect, useState } from "react";
import AddUserModal from "./AddUserModal";
import toast from "react-hot-toast";
import { Eye, Pencil, UsersRound, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
    Box,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Chip,
    Avatar,
    Button,
    GlobalStyles,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

// ── Brand-locked tokens ──
const INK = "#0B2B33";
const AMBER = "#F2A65A";
const LINE = "rgba(11,43,51,0.08)";
const MUTED = "#5C7178";
const ROW_HOVER = "rgba(242,166,90,0.06)";

const ROLE_COLORS = {
    admin: { bg: "rgba(11,43,51,0.08)", color: INK },
    user: { bg: "rgba(90,140,255,0.12)", color: "#3457C7" },
};

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
            toast.success(user2.data.message);
            fetchUsers();

        } catch (err) {
            if (err.response) {
                console.log("Status:", err.response.status);
                console.log("Data:", err.response.data);
                toast.error(err.response.data.message || "Server Error");
            }
            else if (err.request) {
                console.log("No response received:", err.request);
                toast.error("No response from server");
            }
            else {
                console.log("Error:", err.message);
                toast.error(err.message);
            }
        }
    };

    const isSearching = search.trim().length > 0;

    return (
        <>
            <GlobalStyles
                styles={{
                    "@import":
                        "url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap')",
                }}
            />
            <Box sx={{ fontFamily: "'Inter', sans-serif", bgcolor: "#F5F1E9", minHeight: "100%", px: { xs: 2, md: 24 }, py: 5 }}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: "20px",
                        border: `1px solid ${LINE}`,
                        boxShadow: "0 20px 45px -28px rgba(11,43,51,0.25)",
                        overflow: "hidden",
                    }}
                >
                    {/* ── Header ── */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", sm: "center" },
                            gap: 2,
                            p: { xs: 3, md: 3.5 },
                            borderBottom: `1px solid ${LINE}`,
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 700,
                                fontSize: 21,
                                color: INK,
                            }}
                        >
                            User Management
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <TextField
                                size="small"
                                placeholder="Search user..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchRoundedIcon sx={{ fontSize: 18, color: MUTED }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    width: { xs: "100%", sm: 230 },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "10px",
                                        bgcolor: "#fff",
                                        "& fieldset": { borderColor: "rgba(11,43,51,0.15)" },
                                        "&.Mui-focused fieldset": { borderColor: AMBER, borderWidth: "2px" },
                                    },
                                }}
                            />
                            <Button
                                onClick={() => setShowModal(true)}
                                startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
                                sx={{
                                    bgcolor: AMBER,
                                    color: INK,
                                    fontWeight: 700,
                                    fontSize: 14,
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    px: 2.5,
                                    py: 1.1,
                                    boxShadow: "none",
                                    whiteSpace: "nowrap",
                                    "&:hover": { bgcolor: AMBER },
                                }}
                            >
                                Add User
                            </Button>
                        </Box>
                    </Box>

                    {/* ── Table or Empty State ── */}
                    {users.length === 0 ? (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                py: { xs: 8, md: 10 },
                                px: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: "50%",
                                    bgcolor: "rgba(242,166,90,0.12)",
                                    color: AMBER,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 2.5,
                                }}
                            >
                                <UsersRound size={32} />
                            </Box>
                            <Typography
                                sx={{
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: 700,
                                    fontSize: 18,
                                    color: INK,
                                    mb: 1,
                                }}
                            >
                                {isSearching ? "No matching users" : "No users yet"}
                            </Typography>
                            <Typography sx={{ fontSize: 14.5, color: MUTED, maxWidth: 340, mb: isSearching ? 0 : 3 }}>
                                {isSearching
                                    ? `We couldn't find any users matching "${search}". Try a different search term.`
                                    : "Once you add a user, they'll show up here with their role and status."}
                            </Typography>
                            {!isSearching && (
                                <Button
                                    onClick={() => setShowModal(true)}
                                    startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
                                    sx={{
                                        bgcolor: AMBER,
                                        color: INK,
                                        fontWeight: 700,
                                        fontSize: 14,
                                        textTransform: "none",
                                        borderRadius: "10px",
                                        px: 3,
                                        py: 1.1,
                                        boxShadow: "none",
                                        "&:hover": { bgcolor: AMBER },
                                    }}
                                >
                                    Add User
                                </Button>
                            )}
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 720 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: INK }}>
                                        {["Name", "Email", "Role", "Status"].map((head) => (
                                            <TableCell
                                                key={head}
                                                sx={{
                                                    color: "rgba(255,255,255,0.85)",
                                                    fontSize: 12.5,
                                                    fontWeight: 700,
                                                    letterSpacing: "0.06em",
                                                    textTransform: "uppercase",
                                                    border: "none",
                                                }}
                                            >
                                                {head}
                                            </TableCell>
                                        ))}
                                        <TableCell
                                            align="right"
                                            sx={{
                                                color: "rgba(255,255,255,0.85)",
                                                fontSize: 12.5,
                                                fontWeight: 700,
                                                letterSpacing: "0.06em",
                                                textTransform: "uppercase",
                                                border: "none",
                                            }}
                                        >
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {users.map((user) => {
                                        const roleStyle = ROLE_COLORS[user.role] || { bg: "rgba(11,43,51,0.06)", color: MUTED };
                                        return (
                                            <TableRow
                                                key={user.id}
                                                sx={{
                                                    "&:hover": { bgcolor: ROW_HOVER },
                                                    "&:not(:last-child) td": { borderBottom: `1px solid ${LINE}` },
                                                }}
                                            >
                                                <TableCell sx={{ border: "none" }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 34,
                                                                height: 34,
                                                                bgcolor: "rgba(242,166,90,0.15)",
                                                                color: AMBER,
                                                                fontSize: 13,
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {user.username?.charAt(0)?.toUpperCase() || "?"}
                                                        </Avatar>
                                                        <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: INK }}>
                                                            {user.username}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ border: "none", fontSize: 14, color: MUTED }}>{user.email}</TableCell>
                                                <TableCell sx={{ border: "none" }}>
                                                    <Chip
                                                        label={user.role}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: 12.5,
                                                            textTransform: "capitalize",
                                                            bgcolor: roleStyle.bg,
                                                            color: roleStyle.color,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ border: "none" }}>
                                                    <Chip
                                                        label={user.isActive ? "Active" : "Inactive"}
                                                        size="small"
                                                        onClick={() => handleStatusToggle(user)}
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: 12.5,
                                                            cursor: "pointer",
                                                            bgcolor: user.isActive ? "rgba(46,125,50,0.1)" : "rgba(179,67,30,0.1)",
                                                            color: user.isActive ? "#2E7D32" : "#B3431E",
                                                            "&:hover": {
                                                                bgcolor: user.isActive ? "rgba(46,125,50,0.18)" : "rgba(179,67,30,0.18)",
                                                            },
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right" sx={{ border: "none" }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
                                                        <Tooltip title="View user">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => navigate(`/users/${user.id}`)}
                                                                sx={{
                                                                    color: INK,
                                                                    bgcolor: "rgba(11,43,51,0.06)",
                                                                    borderRadius: "8px",
                                                                    "&:hover": { bgcolor: "rgba(11,43,51,0.06)" },
                                                                }}
                                                            >
                                                                <Eye size={15} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Edit user">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => navigate(`/users/${user.id}`)}
                                                                sx={{
                                                                    color: "#B5732A",
                                                                    bgcolor: "rgba(242,166,90,0.12)",
                                                                    borderRadius: "8px",
                                                                    "&:hover": { bgcolor: "rgba(242,166,90,0.12)" },
                                                                }}
                                                            >
                                                                <Pencil size={15} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* ── Pagination ── */}
                    {users.length > 0 && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 2.5,
                                p: { xs: 2.5, md: 3 },
                                borderTop: `1px solid ${LINE}`,
                            }}
                        >
                            <IconButton
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                size="small"
                                sx={{
                                    border: `1px solid ${LINE}`,
                                    borderRadius: "8px",
                                    color: INK,
                                    "&.Mui-disabled": { color: "rgba(11,43,51,0.25)" },
                                }}
                            >
                                <ChevronLeft size={18} />
                            </IconButton>

                            <Typography sx={{ fontSize: 14, color: MUTED }}>
                                Page {page} of {totalPages || 1}
                            </Typography>

                            <IconButton
                                disabled={page === totalPages || totalPages === 0}
                                onClick={() => setPage(page + 1)}
                                size="small"
                                sx={{
                                    border: `1px solid ${LINE}`,
                                    borderRadius: "8px",
                                    color: INK,
                                    "&.Mui-disabled": { color: "rgba(11,43,51,0.25)" },
                                }}
                            >
                                <ChevronRight size={18} />
                            </IconButton>
                        </Box>
                    )}
                </Paper>

                {showModal && (
                    <AddUserModal
                        close={() => setShowModal(false)}
                        refresh={fetchUsers}
                    />
                )}
            </Box>
        </>
    );
}

export default ManageUsers;