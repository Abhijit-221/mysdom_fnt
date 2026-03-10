import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./addClientService.css";
import toast from "react-hot-toast";

function AddClientService({ clientId }) {

    const [client, setClient] = useState(null);
    const [clientServices, setClientServices] = useState([]);
    const [services, setServices] = useState([]);

    const [selectedService, setSelectedService] = useState("");

    useEffect(() => {
        fetchClientDetails();
        fetchAllServices();
        fetchClientServices();
    }, []);

    const fetchClientDetails = async () => {
        try {
            const res = await axiosInstance.get(`/clients/${clientId}`);
            setClient(res.data.data);
        } catch (err) {
            toast.error("Failed to load client");
        }
    };

    const fetchAllServices = async () => {
        try {
            const res = await axiosInstance.get("/services");
            setServices(res.data.data);
        } catch (err) {
            toast.error("Failed to load services");
        }
    };

    const fetchClientServices = async () => {
        try {
            const res = await axiosInstance.get(`/client-services/${clientId}`);
            setClientServices(res.data.data);
        } catch (err) {
            toast.error("Failed to load client services");
        }
    };

    const handleAddService = async () => {
        if (!selectedService) {
            toast.error("Select a service first");
            return;
        }

        try {
            await axiosInstance.post("/client-services/add", {
                clientId,
                serviceId: selectedService
            });

            toast.success("Service added successfully");
            fetchClientServices();
            setSelectedService("");

        } catch (err) {
            toast.error(err?.response?.data?.message || "Error adding service");
        }
    };

    return (
        <div className="add-client-service">

            {/* Client Details */}
            <div className="client-info-card">

                <h2>Client Details</h2>

                {client && (
                    <div className="client-details">
                        <p><strong>Name:</strong> {client.name}</p>
                        <p><strong>Email:</strong> {client.email}</p>
                        <p><strong>Phone:</strong> {client.phone}</p>
                        <p><strong>Company:</strong> {client.company}</p>
                    </div>
                )}

            </div>


            {/* Add Service */}
            <div className="add-service-section">

                <h3>Add Service</h3>

                <div className="service-form">

                    <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                    >
                        <option value="">Select Service</option>

                        {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.service_name}
                            </option>
                        ))}

                    </select>

                    <button onClick={handleAddService}>
                        Add Service
                    </button>

                </div>

            </div>


            {/* Client Services */}
            <div className="client-service-list">

                <h3>Client Services</h3>

                <table>

                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {clientServices.length === 0 && (
                            <tr>
                                <td colSpan="3">No services assigned</td>
                            </tr>
                        )}

                        {clientServices.map((service) => (
                            <tr key={service.id}>
                                <td>{service.service_name}</td>
                                <td>{service.description}</td>
                                <td>
                                    <span className="active-badge">
                                        Active
                                    </span>
                                </td>
                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default AddClientService;