import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Trash } from "lucide-react";
import { keyframes } from "@emotion/react";
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    IconButton,
    Button,
    Dialog,
    DialogContent,
    TextField,
    Chip,
    GlobalStyles,
    Fade,
    Grow,
} from "@mui/material";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import Badge from "@mui/icons-material/ConfirmationNumberRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// ── Brand-locked tokens ──
const INK = "#0B2B33";
const INK_SOFT = "#123B45";
const AMBER = "#F2A65A";
const CREAM = "#FBF6EF";
const LINE = "rgba(11,43,51,0.08)";
const MUTED = "#5C7178";
const ROW_HOVER = "rgba(242,166,90,0.06)";

const rowRise = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Reveals a section the first time it scrolls into view
const useReveal = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return [ref, visible];
};

function AddClientService() {

    const { client_id } = useParams();

    const [client, setClient] = useState(null);
    const [allServices, setAllServices] = useState([]);
    const [clientServices, setClientServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");

    const [infoRef, infoVisible] = useReveal();
    const [assignedRef, assignedVisible] = useReveal();
    const [availableRef, availableVisible] = useReveal();

    useEffect(() => {
        fetchClientDetails();
        fetchAllServices();
        fetchClientServices();
    }, []);

    // Client Details
    const fetchClientDetails = async () => {
        try {
            const res = await axiosInstance.get(`/client/get/${client_id}`);
            setClient(res.data.data);
        } catch {
            toast.error("Failed to load client");
        }
    };

    // Fetch ALL services
    const fetchAllServices = async () => {
        try {
            const res = await axiosInstance.get(`/service/get`);
            setAllServices(res.data.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load services");
        }
    };

    // Fetch client assigned services
    const fetchClientServices = async () => {
        try {
            const res = await axiosInstance.get(`/client-service/getby/${client_id}`);
            const services = res.data.data.map(item => ({
                ...item.service,
                clientServiceId: item.id,
                tatDays: item.tatDays
            }));
            console.log('res:', services)
            setClientServices(services);
        } catch {
            toast.error("Failed to load client services");
        }
    };

    // Services NOT assigned
    const availableServices = allServices.filter(
        service => !clientServices.some(cs => cs.id === service.id)
    );

    // Add Service
    const [showModal, setShowModal] = useState(false);
    const [tatDays, setTatDays] = useState("");
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [deleteServiceid, setDeleteServiceid] = useState();

    const submitService = async () => {

        if (!tatDays) {
            toast.error("Enter TAT days");
            return;
        }

        try {

            await axiosInstance.post("/client-service/add", {
                clientId: client_id,
                serviceId: selectedServiceId,
                tatDays: tatDays
            });

            toast.success("Service added");

            setShowModal(false);
            setTatDays("");
            fetchClientServices();

        } catch (err) {
            toast.error("Failed to add service");
        }

    };

    // remove client service
    const handleDeleteClientService = async (id) => {
        console.log("clientServices:", clientServices);
        console.log('client service id:', id);
        try {
            const response = await axiosInstance.post(`/client-service/delete`, {
                clientserv_id: id
            });
            fetchAllServices();
            fetchClientServices();
            toast.success("Assigned service removed")

        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <GlobalStyles
                styles={{
                    "@import":
                        "url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap')",
                }}
            />
            <Box sx={{ fontFamily: "'Inter', sans-serif", bgcolor: "#F5F1E9", minHeight: "100%", px: { xs: 2, md: 24 } , py:5 }}>

                {/* ── CLIENT DETAILS ── */}
                <Box ref={infoRef} sx={{ mb: 3.5 }}>
                    <Fade in={infoVisible} timeout={600}>
                        <Box
                            sx={{
                                position: "relative",
                                bgcolor: INK,
                                background: `linear-gradient(155deg, ${INK} 0%, ${INK_SOFT} 100%)`,
                                color: "#fff",
                                borderRadius: "18px",
                                p: { xs: 3, md: 4 },
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: -70,
                                    right: "6%",
                                    width: 200,
                                    height: 200,
                                    borderRadius: "50%",
                                    background: `radial-gradient(circle, ${AMBER} 0%, rgba(242,166,90,0) 70%)`,
                                    opacity: 0.3,
                                }}
                            />
                            <Typography
                                sx={{
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: 700,
                                    fontSize: 20,
                                    mb: 2.5,
                                    position: "relative",
                                }}
                            >
                                Client Details
                            </Typography>

                            {client && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: { xs: 3, md: 5 },
                                        position: "relative",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: "9px", bgcolor: "rgba(242,166,90,0.15)", color: AMBER, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Badge sx={{ fontSize: 18 }} />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>Company Code</Typography>
                                            <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>{client.clientCode}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: "9px", bgcolor: "rgba(242,166,90,0.15)", color: AMBER, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <BusinessRoundedIcon sx={{ fontSize: 18 }} />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>Company Name</Typography>
                                            <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>{client.companyName}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: "9px", bgcolor: "rgba(242,166,90,0.15)", color: AMBER, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <MailOutlineRoundedIcon sx={{ fontSize: 18 }} />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>Email</Typography>
                                            <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>{client.contactEmail}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: "9px", bgcolor: "rgba(242,166,90,0.15)", color: AMBER, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <CallRoundedIcon sx={{ fontSize: 18 }} />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>Phone</Typography>
                                            <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>{client.contactPhone}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Fade>
                </Box>

                {/* ── ASSIGNED SERVICES ── */}
                <Box ref={assignedRef} sx={{ mb: 3.5 }}>
                    <Grow in={assignedVisible} timeout={700}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: "18px",
                                border: `1px solid ${LINE}`,
                                boxShadow: "0 18px 40px -26px rgba(11,43,51,0.22)",
                                overflow: "hidden",
                            }}
                        >
                            <Box sx={{ p: { xs: 2.5, md: 3 }, borderBottom: `1px solid ${LINE}` }}>
                                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 17, color: INK }}>
                                    Client Services
                                </Typography>
                            </Box>
                            <TableContainer>
                                <Table sx={{ minWidth: 640 }}>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: INK }}>
                                            {["Sl No.", "Service Name", "Description", "Total Days", "Action"].map((h) => (
                                                <TableCell
                                                    key={h}
                                                    sx={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", border: "none" }}
                                                >
                                                    {h}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {clientServices.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ border: "none", py: 5, color: MUTED, fontSize: 14.5 }}>
                                                    No services assigned
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {clientServices.map((service, index) => (
                                            <TableRow
                                                key={service.id}
                                                sx={{
                                                    opacity: assignedVisible ? 1 : 0,
                                                    animation: assignedVisible ? `${rowRise} 0.45s ease ${index * 0.06}s both` : "none",
                                                    "&:hover": { bgcolor: ROW_HOVER },
                                                    "&:not(:last-child) td": { borderBottom: `1px solid ${LINE}` },
                                                }}
                                            >
                                                <TableCell sx={{ border: "none", fontSize: 14, color: MUTED }}>{index + 1}</TableCell>
                                                <TableCell sx={{ border: "none", fontSize: 14.5, fontWeight: 600, color: INK }}>{service.name}</TableCell>
                                                <TableCell sx={{ border: "none", fontSize: 14, color: MUTED }}>{service.description}</TableCell>
                                                <TableCell sx={{ border: "none" }}>
                                                    <Chip
                                                        label={`${service.tatDays} days`}
                                                        size="small"
                                                        sx={{ fontWeight: 600, fontSize: 12.5, bgcolor: "rgba(242,166,90,0.15)", color: "#B5732A" }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ border: "none" }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteClientService(service.clientServiceId)}
                                                        sx={{
                                                            color: "#B3431E",
                                                            bgcolor: "rgba(179,67,30,0.08)",
                                                            borderRadius: "8px",
                                                            transition: "transform 0.2s ease, background-color 0.2s ease",
                                                            "&:hover": { bgcolor: "rgba(179,67,30,0.16)", transform: "scale(1.08)" },
                                                        }}
                                                    >
                                                        <Trash size={15} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grow>
                </Box>

                {/* ── AVAILABLE SERVICES ── */}
                <Box ref={availableRef}>
                    <Grow in={availableVisible} timeout={700}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: "18px",
                                border: `1px solid ${LINE}`,
                                boxShadow: "0 18px 40px -26px rgba(11,43,51,0.22)",
                                overflow: "hidden",
                            }}
                        >
                            <Box sx={{ p: { xs: 2.5, md: 3 }, borderBottom: `1px solid ${LINE}` }}>
                                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 17, color: INK }}>
                                    Add Service
                                </Typography>
                            </Box>
                            <TableContainer>
                                <Table sx={{ minWidth: 560 }}>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: INK }}>
                                            {["Sl No.", "Service Name", "Description", "Action"].map((h) => (
                                                <TableCell
                                                    key={h}
                                                    sx={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", border: "none" }}
                                                >
                                                    {h}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {availableServices.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center" sx={{ border: "none", py: 5, color: MUTED, fontSize: 14.5 }}>
                                                    No services available to add
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {availableServices.map((service, index) => (
                                            <TableRow
                                                key={service.id}
                                                sx={{
                                                    opacity: availableVisible ? 1 : 0,
                                                    animation: availableVisible ? `${rowRise} 0.45s ease ${index * 0.06}s both` : "none",
                                                    "&:hover": { bgcolor: ROW_HOVER },
                                                    "&:not(:last-child) td": { borderBottom: `1px solid ${LINE}` },
                                                }}
                                            >
                                                <TableCell sx={{ border: "none", fontSize: 14, color: MUTED }}>{index + 1}</TableCell>
                                                <TableCell sx={{ border: "none", fontSize: 14.5, fontWeight: 600, color: INK }}>{service.name}</TableCell>
                                                <TableCell sx={{ border: "none", fontSize: 14, color: MUTED }}>{service.description}</TableCell>
                                                <TableCell sx={{ border: "none" }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedServiceId(service.id);
                                                            setShowModal(true);
                                                        }}
                                                        sx={{
                                                            color: INK,
                                                            bgcolor: AMBER,
                                                            borderRadius: "8px",
                                                            transition: "transform 0.2s ease",
                                                            "&:hover": { bgcolor: AMBER, transform: "scale(1.1) rotate(90deg)" },
                                                        }}
                                                    >
                                                        <AddRoundedIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grow>
                </Box>

                {/* ── ADD SERVICE MODAL ── */}
                <Dialog
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    TransitionComponent={Grow}
                    PaperProps={{ sx: { borderRadius: "16px", width: 380, maxWidth: "90vw" } }}
                >
                    <DialogContent sx={{ p: 3.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                            <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18, color: INK }}>
                                Add Service
                            </Typography>
                            <IconButton size="small" onClick={() => setShowModal(false)} sx={{ color: MUTED }}>
                                <CloseRoundedIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <TextField
                            fullWidth
                            type="number"
                            label="TAT Days"
                            value={tatDays}
                            onChange={(e) => setTatDays(e.target.value)}
                            placeholder="Enter TAT days"
                            sx={{
                                mb: 3,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px",
                                    "& fieldset": { borderColor: LINE },
                                    "&.Mui-focused fieldset": { borderColor: AMBER, borderWidth: "2px" },
                                },
                            }}
                        />

                        <Box sx={{ display: "flex", gap: 1.5 }}>
                            <Button
                                fullWidth
                                onClick={() => setShowModal(false)}
                                sx={{
                                    border: `1px solid ${LINE}`,
                                    color: INK,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    py: 1.2,
                                    "&:hover": { bgcolor: "rgba(11,43,51,0.04)" },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                fullWidth
                                onClick={submitService}
                                sx={{
                                    bgcolor: AMBER,
                                    color: INK,
                                    fontWeight: 700,
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    py: 1.2,
                                    boxShadow: "none",
                                    "&:hover": { bgcolor: "#E4934A" },
                                }}
                            >
                                Add Service
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
        </>
    );
}

export default AddClientService;