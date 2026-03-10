import React, { useState, useContext, useEffect } from "react";
import { Search, Edit3 } from "lucide-react";
import "./clientList.css";
import { AuthContext } from "../../context/AuthContext";
import Pagination from "../commn/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { IoAddSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ClientViewEditModal from "./ClientViewEditModal";
import AddClientService from "./AddClientService";
export default function ClientList() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddService, setShowAddService] = useState(false);
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
      console.log("clients:", clients,totalCount);

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
  return (
    <div className="client-wrapper">
      <div className="client-card">

        {/* Header */}
        <div className="client-header">
          <h2>Client List</h2>

          <div className="client-header-right">
            <div className="client-search">
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
            <div className="add-btn" onClick={() => (navigate('/client/add'))}>
              <IoAddSharp size={20} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="client-table-wrapper">
          <table className="client-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Company Code</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Address</th>
                <th>SLA</th>
                <th>Status</th>
                {canEdit && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.companyName}</td>
                    <td>{client.clientCode}</td>
                    <td>{client.contactEmail}</td>
                    <td>{client.contactPhone}</td>
                    <td>{client.address}</td>
                    <td>{client.slaDays}</td>
                    <td>
                      <span
                        className={`status-badge ${client.isActive
                            ? "active"
                            : "inactive"
                          }`}
                      >
                        {client.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {canEdit && (
                      <td>
                        <div className="button-grp">
                        <button className="edit-btn" onClick={() => setSelectedClient(client)}>
                          <Edit3 size={16} />
                        </button>
                        <button className="edit-btn" onClick={() =>(navigate('/client/service-add'))}>
                          Add services
                        </button>
                        </div>
                        
                        {selectedClient && (
                          <ClientViewEditModal
                            clientData={selectedClient}
                            onClose={() => setSelectedClient(null)}
                            onUpdate={fetchedClients}
                          />
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* pagination section */}
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />

      </div>
    </div>
  );
}