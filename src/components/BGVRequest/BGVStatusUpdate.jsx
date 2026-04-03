import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import './bgvStatusUpdate.css'

function BGVStatusUpdate() {

    const { req_id } = useParams('req_id');
    // ---------states---------
    const [requestData, setRequestData] = useState({});
    const [updateService, setUpdateService] = useState({});
    // ✅ Move fetchSingleService ABOVE useEffect and use const
    const fetchSingleService = async () => {
        console.log('requestId', req_id);
        try {
            let response = await axiosInstance.get(`/bgvrequest/getby/${req_id}`);
            console.log('response:', response);
            // setData(response.data.data);
            setRequestData(response.data.data);
            console.log('response:', response);

        } catch (error) {
            console.log(error);

            let message = "Failed to submit form";

            // backend error
            if (error.response) {
                message = error.response?.data?.message || `Error ${error.response.status}`;
            }
            // request sent but no response
            else if (error.request) {
                message = "Server not responding. Please try again.";
            }
            // axios or other error
            else {
                message = error.message;
            }

            toast.error(message);
        }
    };
    useEffect(() => {
        console.log('render data');
        fetchSingleService();
    }, []);
    const handleServiceStatusChange = (requestId, serviceId, e) => {
        const value = e.target.value;

        setUpdateService(prev => ({
            ...prev,
            [serviceId]: {
                ...prev[serviceId],
                request_id: requestId,
                service_id: serviceId,
                status: value
            }
        }));
    };
    const handleRemarkChange = (requestId, serviceId, e) => {
        const value = e.target.value;

        setUpdateService(prev => ({
            ...prev,
            [serviceId]: {
                ...prev[serviceId],
                request_id: requestId,
                service_id: serviceId,
                remark: value
            }
        }));
    };
    console.log('updateService :', updateService);


    const handleStatusSubmit = async (serviceId) => {
        try {
            const payload = updateService[serviceId];

            if (!payload) return;

            await axiosInstance.put(`/bgvrequest/status/update`, payload);

            toast.success("Updated successfully");

            // refresh data
            fetchSingleService();

            // clear that row state (optional but good)
            setUpdateService(prev => {
                const updated = { ...prev };
                delete updated[serviceId];
                return updated;
            });
        } catch (error) {
            console.log(error);

            let message = "Failed to submit form";

            // backend error
            if (error.response) {
                message = error.response?.data?.message || `Error ${error.response.status}`;
            }
            // request sent but no response
            else if (error.request) {
                message = "Server not responding. Please try again.";
            }
            // axios or other error
            else {
                message = error.message;
            }

            toast.error(message);
        }
    }
    const isServiceUpdated = (service) => {
        const updated = updateService[service.serviceId];

        if (!updated) return false;

        const statusChanged =
            updated.status && updated.status !== service.status;

        const remarkChanged =
            updated.remark !== undefined &&
            updated.remark !== (service.remark || "");

        return statusChanged || remarkChanged;
    };
    return (
        <div>
            <div className="admin-section">

                {/* 🔹 Request Details Header */}
                <div className="request-header">
                    <h3>BGV Request Details</h3>

                    <div className="request-info">
                        <p><b>Candidate Name:</b> {requestData?.candidate_name}</p>
                        <p><b>Email:</b> {requestData?.candidate_email}</p>
                        <p><b>Phone:</b> {requestData?.candidate_phone}</p>
                        <p><b>Status:</b> {requestData?.status}</p>
                    </div>
                </div>

                {/* 🔹 Services Table */}
                <h3>Update Service Status</h3>

                <table className="service-table">
                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Status</th>
                            <th>Remarks</th>
                            <th>Action</th>

                        </tr>
                    </thead>

                    <tbody>
                        {requestData?.bgvReqestService?.map((service) => (
                            <tr key={service.serviceId}>
                                <td>{service.services.name}</td>
                                <td>
                                    <select
                                        name="status"
                                        defaultValue={service.status}
                                        onChange={(e) =>
                                            handleServiceStatusChange(service.requestId, service.serviceId, e)
                                        }
                                    >
                                        <option value="NEW">NEW</option>
                                        <option value="IN_PROGRESS">IN PROGRESS</option>
                                        <option value="ON_HOLD">ON HOLD</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                        <option value="REJECTED">REJECTED</option>
                                    </select>
                                </td>

                                <td>
                                    <input
                                        type="text"
                                        name="remark"
                                        defaultValue={service.remark}
                                        placeholder="Enter remarks"
                                        onChange={(e) =>
                                            handleRemarkChange(service.requestId, service.serviceId, e)
                                        }
                                    />
                                </td>
                                <td>
                                    <button
                                        className="update-btn"
                                        disabled={!isServiceUpdated(service)}
                                        onClick={() => handleStatusSubmit(service.serviceId)}
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default BGVStatusUpdate