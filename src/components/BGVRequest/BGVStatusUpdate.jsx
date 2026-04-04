import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import './BGVStatusUpdate.css';

const STATUS_OPTIONS = [
  { value: 'NEW',         label: 'New'         },
  { value: 'IN_PROGRESS', label: 'In Progress'  },
  { value: 'ON_HOLD',     label: 'On Hold'      },
  { value: 'COMPLETED',   label: 'Completed'    },
  { value: 'REJECTED',    label: 'Rejected'     },
];

const STATUS_CLASS = {
  NEW:         'badge-new',
  IN_PROGRESS: 'badge-progress',
  ON_HOLD:     'badge-hold',
  COMPLETED:   'badge-done',
  REJECTED:    'badge-rejected',
};

function BGVStatusUpdate() {
  const { req_id } = useParams();

  const [requestData, setRequestData]     = useState({});
  const [updateService, setUpdateService] = useState({});
  const [submitting, setSubmitting]       = useState({});

  const base_url = import.meta.env.VITE_BASE_URL;

  /* ── fetch ── */
  const fetchSingleService = async () => {
    try {
      const response = await axiosInstance.get(`/bgvrequest/getby/${req_id}`);
      setRequestData(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        (error.request ? 'Server not responding.' : error.message)
      );
    }
  };

  useEffect(() => { fetchSingleService(); }, []);

  /* ── patch helper ── */
  const patchService = (serviceId, requestId, patch) => {
    setUpdateService(prev => ({
      ...prev,
      [serviceId]: {
        request_id: requestId,
        service_id: serviceId,
        ...prev[serviceId],
        ...patch,
      },
    }));
  };

  const handleStatusChange = (requestId, serviceId, e) =>
    patchService(serviceId, requestId, { status: e.target.value });

  const handleRemarkChange = (requestId, serviceId, e) =>
    patchService(serviceId, requestId, { remark: e.target.value });

  const handleDocChange = (requestId, serviceId, e, docField) => {
    const file = e.target.files[0] || null;
    patchService(serviceId, requestId, { [docField]: file });
  };

  /* ── dirty check ── */
  const isDirty = (service) => {
    const draft = updateService[service.serviceId];
    if (!draft) return false;
    return (
      (draft.status !== undefined && draft.status !== service.status) ||
      (draft.remark !== undefined && draft.remark !== (service.remark || '')) ||
      draft.doc_1 instanceof File ||
      draft.doc_2 instanceof File
    );
  };

  /* ── submit ── */
  const handleStatusSubmit = async (serviceId) => {
    const payload = updateService[serviceId];
    if (!payload) return;

    try {
      setSubmitting(prev => ({ ...prev, [serviceId]: true }));

      const hasFile = payload.doc_1 instanceof File || payload.doc_2 instanceof File;

      if (hasFile) {
        const fd = new FormData();
        fd.append('request_id', payload.request_id);
        fd.append('service_id', payload.service_id);
        if (payload.status !== undefined)  fd.append('status', payload.status);
        if (payload.remark !== undefined)  fd.append('remark', payload.remark);
        if (payload.doc_1 instanceof File) fd.append('doc_1',  payload.doc_1);
        if (payload.doc_2 instanceof File) fd.append('doc_2',  payload.doc_2);
        await axiosInstance.put('/bgvrequest/status/update', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axiosInstance.put('/bgvrequest/status/update', {
          request_id: payload.request_id,
          service_id: payload.service_id,
          ...(payload.status !== undefined && { status: payload.status }),
          ...(payload.remark !== undefined && { remark: payload.remark }),
        });
      }

      toast.success('Updated successfully');
      fetchSingleService();
      setUpdateService(prev => { const n = { ...prev }; delete n[serviceId]; return n; });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        (error.request ? 'Server not responding.' : error.message)
      );
    } finally {
      setSubmitting(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  /* ── existing file link ── */
  const ExistingFile = ({ path, label }) => {
    if (!path) return <span className="no-file">No file</span>;
    const fileName = path.split(/[\\/]/).pop();
    return (
      <a
        href={`${base_url}/${path.replace(/\\/g, '/')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="file-pill"
        title={fileName}
      >
        📎 {label}
      </a>
    );
  };

  /* ── doc cell: existing link + new-file picker ── */
  const DocCell = ({ service, docField, label }) => {
    const existingPath = service[docField];
    const draft        = updateService[service.serviceId];
    const newFile      = draft?.[docField];

    return (
      <div className="doc-cell">
        <ExistingFile path={existingPath} label={label} />

        <label className="file-pick-label">
          <span className="file-pick-btn">
            {newFile ? `✓ ${newFile.name}` : '↑ Upload new'}
          </span>
          <input
            type="file"
            className="file-pick-input"
            onChange={(e) =>
              handleDocChange(service.requestId, service.serviceId, e, docField)
            }
          />
        </label>

        {newFile && <span className="new-file-badge">New file ready</span>}
      </div>
    );
  };

  /* ════════════════════════════════════
     RENDER
  ════════════════════════════════════ */
  return (
    <div>
      <div className="admin-section">

        {/* ── Request Details Header ── */}
        <div className="request-header">
          <h3>BGV Request Details</h3>
          <div className="request-info">
            <p>
              <b>Candidate Name</b>
              {requestData?.candidate_name || '—'}
            </p>
            <p>
              <b>Email</b>
              {requestData?.candidate_email || '—'}
            </p>
            <p>
              <b>Phone</b>
              {requestData?.candidate_phone || '—'}
            </p>
            <p>
              <b>Status</b>
              <span className={`bsu-status-badge ${STATUS_CLASS[requestData?.status] || ''}`}>
                {requestData?.status || '—'}
              </span>
            </p>
          </div>
        </div>

        {/* ── Services Table ── */}
        <div className='table-section'>

            <h3>Update Service Status</h3>

            <div style={{ overflowX: 'auto' }}>
            <table className="service-table">
                <thead>
                <tr>
                    <th>Service Name</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th>Document 1</th>
                    <th>Document 2</th>
                    <th>Action</th>
                </tr>
                </thead>

                <tbody>
                {requestData?.bgvReqestService?.map((service) => {
                    const dirty   = isDirty(service);
                    const loading = submitting[service.serviceId];
                    const draft   = updateService[service.serviceId];

                    return (
                    <tr key={service.serviceId} className={dirty ? 'row-dirty' : ''}>

                        {/* Service name */}
                        <td>
                        <span className="service-name">{service.services.name}</span>
                        </td>

                        {/* Status */}
                        <td>
                        <select
                            value={draft?.status ?? service.status}
                            onChange={(e) =>
                            handleStatusChange(service.requestId, service.serviceId, e)
                            }
                        >
                            {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        </td>

                        {/* Remarks */}
                        <td>
                        <input
                            type="text"
                            value={draft?.remark ?? (service.remark || '')}
                            placeholder="Enter remarks…"
                            onChange={(e) =>
                            handleRemarkChange(service.requestId, service.serviceId, e)
                            }
                        />
                        </td>

                        {/* Doc 1 */}
                        <td>
                        <DocCell service={service} docField="doc_1" label="Doc 1" />
                        </td>

                        {/* Doc 2 */}
                        <td>
                        <DocCell service={service} docField="doc_2" label="Doc 2" />
                        </td>

                        {/* Action */}
                        <td>
                        <button
                            className={`update-btn${dirty ? ' btn-active' : ''}`}
                            disabled={!dirty || loading}
                            onClick={() => handleStatusSubmit(service.serviceId)}
                        >
                            {loading
                            ? <span className="bsu-spinner" />
                            : dirty ? 'Update' : 'No Changes'}
                        </button>
                        </td>

                    </tr>
                    );
                })}
                </tbody>
            </table>
            </div>
        </div>

      </div>
    </div>
  );
}

export default BGVStatusUpdate;