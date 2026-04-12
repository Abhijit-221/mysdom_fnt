import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./addClientService.css";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Trash } from "lucide-react";

function AddClientService() {

    const { client_id } = useParams();

    const [client, setClient] = useState(null);
    const [allServices, setAllServices] = useState([]);
    const [clientServices, setClientServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");

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
                clientServiceId:item.id,
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
    const [deleteServiceid,setDeleteServiceid] = useState();
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

    //remove client service 
    const handleDeleteClientService=async(id)=>{
        console.log("clientServices:",clientServices);
        console.log('client service id:',id);
        try{
            const response = await axiosInstance.post(`/client-service/delete`,{
                clientserv_id:id
            });
            fetchAllServices();
            fetchClientServices();
            toast.success("Assigned service removed")
            
        }
        catch(error){
            console.log(error);
        }
    }

    return (

        <div className="add-client-service">

            {/* CLIENT DETAILS */}
            <div className="client-info-card">

                <h2>Client Details</h2>

                {client && (
                    <div className="client-details">
                        <p><strong>Company Code:</strong> {client.clientCode}</p>
                        <p><strong>Company Name:</strong> {client.companyName}</p>
                        <p><strong>Email:</strong> {client.contactEmail}</p>
                        <p><strong>Phone:</strong> {client.contactPhone}</p>
                    </div>
                )}

            </div>
            {/* CLIENT SERVICES */}
            <div className="add-service-section">

                <h3>Client Services</h3>

                <table>

                    <thead>
                        <tr>
                            <th>Sl No.</th>
                            <th>Service Name</th>
                            <th>Description</th>
                            <th>Total Days</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {clientServices.length === 0 && (
                            <tr>
                                <td colSpan="3">No services assigned</td>
                            </tr>
                        )}

                        {clientServices.map((service, index) => (
                            <tr key={service.id}>
                                <td>{index + 1}</td>
                                <td>{service.name}</td>
                                <td>{service.description}</td>
                                <td>{service.tatDays}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={()=>handleDeleteClientService(service.clientServiceId)}
                                    >
                                        <Trash size={16}/>
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

            {/* ADD SERVICE */}
            <div className="add-service-section">

                <h3>Add Service</h3>

                {/* <div className="service-list">

                    {availableServices.length === 0 && (
                        <p>No services available to add</p>
                    )}

                    {availableServices.map(service => (

                        <div key={service.id} className="service-card">

                            <div className="service-info">
                                <h4>{service.service_name}</h4>
                                <p>{service.description}</p>
                            </div>

                            <button
                                className="add-btn"
                                onClick={() => handleAddService(service.id)}
                            >
                                + Add
                            </button>

                        </div>

                    ))}

                </div> */}

                <table>

                    <thead>
                        <tr>
                            <th>Sl No.</th>
                            <th>Service Name</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {availableServices.length === 0 && (
                            <tr>
                                <td colSpan="3">No services assigned</td>
                            </tr>
                        )}

                        {availableServices.map((service, index) => (
                            <tr key={service.id}>
                                <td>{index + 1}</td>
                                <td>{service.name}</td>
                                <td>{service.description}</td>
                                <td>
                                    <button
                                        className="add-btn"
                                        onClick={() => {
                                            setSelectedServiceId(service.id);
                                            setShowModal(true);
                                        }}
                                    >
                                        +
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>
            {showModal && (
                <div className="modal-overlay">

                    <div className="modal-box">

                        <h3>Add Service</h3>

                        <div className="modal-body">

                            <label>TAT Days</label>

                            <input
                                type="number"
                                value={tatDays}
                                onChange={(e) => setTatDays(e.target.value)}
                                placeholder="Enter TAT days"
                            />

                        </div>

                        <div className="modal-actions">

                            <button
                                className="canceled-btn"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="addsubmit-btn"
                                onClick={submitService}
                            >
                                Add Service
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>

    );
}

export default AddClientService;