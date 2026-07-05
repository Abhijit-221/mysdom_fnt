import React, { useState, useContext, useEffect } from "react";
import { Search, Edit3, TrashIcon, Users } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Pagination from "../commn/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { IoAddSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ClientViewEditModal from "./ClientViewEditModal";
import toast from "react-hot-toast";
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

// ── Brand-locked tokens ──
const INK = "#0B2B33";
const AMBER = "#F2A65A";
const LINE = "rgba(11,43,51,0.08)";
const MUTED = "#5C7178";
const ROW_HOVER = "rgba(242,166,90,0.06)";

export default function ClientList() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const canEdit = ["admin", "superadmin"].includes(
    user?.role?.toLowerCase()?.trim()
  );

  let fetchedClients = async () => {
    try {
      const res = await axiosInstance.get(
        "/client/get",
        {
          params: {
            search,
            page,
            limit,
          },
        }
      );

      const clientData = res?.data?.data || [];
      const totalCount = res?.data?.count || 0;
      console.log("clients:", clients, totalCount);

      setClients(clientData);

      // 🔥 Calculate total pages
      setTotalPages(Math.ceil(totalCount / limit));

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load Clients"
      );
    }
  };

  useEffect(() => {
    fetchedClients();
  }, [page, search]);

  console.log("clients:", clients);
  const [selectedClient, setSelectedClient] = useState(null);

  const deleteClntHandler = async (id) => {
    try {
      const response = await axiosInstance.post(`/client/delete`, { id: id });
      toast.success(response?.data?.message);
      fetchedClients();
    }
    catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete Clients"
      );
    }
  }

  const columnCount = canEdit ? 8 : 7;
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
              Client List
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <TextField
                size="small"
                placeholder="Search client..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={17} color={MUTED} />
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
              <Tooltip title="Add Client">
                <IconButton
                  onClick={() => navigate('/client/add')}
                  sx={{
                    bgcolor: AMBER,
                    color: INK,
                    borderRadius: "10px",
                    width: 40,
                    height: 40,
                    "&:hover": { bgcolor: AMBER },
                  }}
                >
                  <IoAddSharp size={20} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* ── Table or Empty State ── */}
          {clients.length === 0 ? (
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
                <Users size={32} />
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
                {isSearching ? "No matching clients" : "No clients yet"}
              </Typography>
              <Typography sx={{ fontSize: 14.5, color: MUTED, maxWidth: 340, mb: isSearching ? 0 : 3 }}>
                {isSearching
                  ? `We couldn't find any clients matching "${search}". Try a different search term.`
                  : "Once you add a client, they'll show up here with their details and status."}
              </Typography>
              {!isSearching && (
                <Button
                  onClick={() => navigate('/client/add')}
                  startIcon={<IoAddSharp size={18} />}
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
                  Add Client
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: INK }}>
                    {["Company Name", "Company Code", "Email", "Contact", "Address", "SLA", "Status"].map((head) => (
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
                    {canEdit && (
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
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {clients.map((client) => (
                    <TableRow
                      key={client.id}
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
                            {client.companyName?.charAt(0)?.toUpperCase() || "?"}
                          </Avatar>
                          <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: INK }}>
                            {client.companyName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ border: "none", fontSize: 14, color: MUTED }}>{client.clientCode}</TableCell>
                      <TableCell sx={{ border: "none", fontSize: 14, color: MUTED }}>{client.contactEmail}</TableCell>
                      <TableCell sx={{ border: "none", fontSize: 14, color: MUTED }}>{client.contactPhone}</TableCell>
                      <TableCell sx={{ border: "none", fontSize: 14, color: MUTED, maxWidth: 220 }}>{client.address}</TableCell>
                      <TableCell sx={{ border: "none", fontSize: 14, color: MUTED }}>{client.slaDays}</TableCell>
                      <TableCell sx={{ border: "none" }}>
                        <Chip
                          label={client.isActive ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: 12.5,
                            bgcolor: client.isActive ? "rgba(46,125,50,0.1)" : "rgba(179,67,30,0.1)",
                            color: client.isActive ? "#2E7D32" : "#B3431E",
                          }}
                        />
                      </TableCell>

                      {canEdit && (
                        <TableCell align="right" sx={{ border: "none" }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
                            <Tooltip title="Edit client">
                              <IconButton
                                size="small"
                                onClick={() => setSelectedClient(client)}
                                sx={{
                                  color: INK,
                                  bgcolor: "rgba(11,43,51,0.06)",
                                  borderRadius: "8px",
                                  "&:hover": { bgcolor: "rgba(11,43,51,0.06)" },
                                }}
                              >
                                <Edit3 size={15} />
                              </IconButton>
                            </Tooltip>
                            <Button
                              size="small"
                              onClick={() => navigate(`/client/service-add/${client.id}`)}
                              sx={{
                                bgcolor: AMBER,
                                color: INK,
                                fontWeight: 600,
                                fontSize: 12.5,
                                textTransform: "none",
                                borderRadius: "8px",
                                px: 1.5,
                                py: 0.5,
                                minWidth: "auto",
                                whiteSpace: "nowrap",
                                boxShadow: "none",
                                "&:hover": { bgcolor: AMBER },
                              }}
                            >
                              Add Service
                            </Button>
                            <Tooltip title="Delete client">
                              <IconButton
                                size="small"
                                onClick={() => deleteClntHandler(client.id)}
                                sx={{
                                  color: "#B3431E",
                                  bgcolor: "rgba(179,67,30,0.08)",
                                  borderRadius: "8px",
                                  "&:hover": { bgcolor: "rgba(179,67,30,0.08)" },
                                }}
                              >
                                <TrashIcon size={16} />
                              </IconButton>
                            </Tooltip>
                          </Box>

                          {selectedClient && (
                            <ClientViewEditModal
                              clientData={selectedClient}
                              onClose={() => setSelectedClient(null)}
                              onUpdate={fetchedClients}
                            />
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* ── Pagination ── */}
          {clients.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", p: { xs: 2.5, md: 3 }, borderTop: `1px solid ${LINE}` }}>
              <Pagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            </Box>
          )}
        </Paper>
      </Box>
    </>
  );
}