import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import './bgvStatusUpdate.css';
import { ArrowLeft } from 'lucide-react';
import BGVVerificationForm from './Bgvverificationform';

const STATUS_OPTIONS = [
  { value: 'SUBMITED', label: 'SUBMITED' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'REJECTED', label: 'Rejected' },
];

const STATUS_CLASS = {
  SUBMITED: 'badge-new',
  IN_PROGRESS: 'badge-progress',
  ON_HOLD: 'badge-hold',
  COMPLETED: 'badge-done',
  REJECTED: 'badge-rejected',
};

function BGVStatusUpdate() {
  const { req_id } = useParams();
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState({});
  const [updateProduct, setUpdateProduct] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [verificationModal, setVerificationModal] = useState({
    open: false,
    productId: '',
  });

  let checkStatus =(status)=>{
    if(status === "ON_HOLD"){
      return "ON HOLD"
    }
    if(status === "IN_PROGRESS"){
      return "IN PROGRESS"
    }
    return status;
  }
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const fetchSingleRequest = async () => {
    try {
      const response = await axiosInstance.get(`/bgvrequest/getby/${req_id}`);
      setRequestData(response.data.data);
      return response.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        (error.request ? 'Server not responding.' : error.message)
      );
      return null;
    }
  };

  useEffect(() => {
    fetchSingleRequest();
  }, []);

  const getProductId = (product) => product?.productId || product?.id;
  const getRequestId = (product) => product?.requestId || requestData?.id;
  const getProductName = (product) =>
    product?.Product?.title ||
    product?.product?.title ||
    // product?.Product?.name ||
    // product?.product?.name ||
    // product?.services?.name ||
    // product?.service?.name ||
    'Unnamed Product';

  const patchProduct = (productId, requestId, patch) => {
    setUpdateProduct((prev) => ({
      ...prev,
      [productId]: {
        request_id: requestId,
        product_id: productId,
        ...prev[productId],
        ...patch,
      },
    }));
  };

  const handleStatusChange = (requestId, productId, e) =>
    patchProduct(productId, requestId, { status: e.target.value });

  const handleRemarkChange = (requestId, productId, e) =>
    patchProduct(productId, requestId, { remark: e.target.value });

  const handleModeOfVerification = (requestId, productId, e) =>
    patchProduct(productId, requestId, { mode_of_verification: e.target.value });

  const handleVerifierComment = (requestId, productId, e) =>
    patchProduct(productId, requestId, { verifier_comment: e.target.value });

  const handleFinalDisposition = (requestId, productId, e) =>
    patchProduct(productId, requestId, { final_desc: e.target.value });

  const handleDocChange = (requestId, productId, e, docField) => {
    const file = e.target.files[0] || null;
    patchProduct(productId, requestId, { [docField]: file });
  };

  const isDirty = (product) => {
    const productId = getProductId(product);
    const draft = updateProduct[productId];
    if (!draft) return false;

    return (
      (draft.status !== undefined && draft.status !== product.status) ||
      (draft.remark !== undefined && draft.remark !== (product.remark || '')) ||
      (draft.mode_of_verification !== undefined && draft.mode_of_verification !== (product.mode_of_verification || '')) ||
      (draft.verifier_comment !== undefined && draft.verifier_comment !== (product.verifier_comment || '')) ||
      (draft.final_desc !== undefined && draft.final_desc !== (product.final_desc || '')) ||
      draft.doc_1 instanceof File ||
      draft.doc_2 instanceof File
    );
  };

  const handleStatusSubmit = async (productId) => {
    const payload = updateProduct[productId];
    if (!payload) return;

    try {
      setSubmitting((prev) => ({ ...prev, [productId]: true }));

      const hasFile = payload.doc_1 instanceof File || payload.doc_2 instanceof File;

      if (hasFile) {
        const fd = new FormData();
        fd.append('request_id', payload.request_id);
        fd.append('product_id', payload.product_id);
        if (payload.status !== undefined) fd.append('status', payload.status);
        if (payload.remark !== undefined) fd.append('remark', payload.remark);

        if (payload.mode_of_verification !== undefined) fd.append('mode_of_verification', payload.mode_of_verification);
        if (payload.verifier_comment !== undefined) fd.append('verifier_comment', payload.verifier_comment);
        if (payload.final_desc !== undefined) fd.append('final_desc', payload.final_desc);

        if (payload.doc_1 instanceof File) fd.append('doc_1', payload.doc_1);
        if (payload.doc_2 instanceof File) fd.append('doc_2', payload.doc_2);

        await axiosInstance.put('/bgvrequest/status/update', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axiosInstance.put('/bgvrequest/status/update', {
          request_id: payload.request_id,
          product_id: payload.product_id,
          ...(payload.status !== undefined && { status: payload.status }),
          ...(payload.remark !== undefined && { remark: payload.remark }),
          ...(payload.mode_of_verification !== undefined && { mode_of_verification: payload.mode_of_verification }),
          ...(payload.verifier_comment !== undefined && { verifier_comment: payload.verifier_comment }),
          ...(payload.final_desc !== undefined && { final_desc: payload.final_desc }),
        });
      }

      toast.success('Updated successfully');
      fetchSingleRequest();
      setUpdateProduct((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        (error.request ? 'Server not responding.' : error.message)
      );
    } finally {
      setSubmitting((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const ExistingFile = ({ path, label }) => {
    if (!path) return <span className="no-file">No file</span>;
    const fileName = path.split(/[\\/]/).pop();

    return (
      <a
        href={`${baseUrl}/${path.replace(/\\/g, '/')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="file-pill"
        title={fileName}
      >
        {label}
      </a>
    );
  };

  const DocCell = ({ product, docField, label }) => {
    const productId = getProductId(product);
    const requestId = getRequestId(product);
    const existingPath = product[docField];
    const draft = updateProduct[productId];
    const newFile = draft?.[docField];

    return (
      <div className="doc-cell">
        <ExistingFile path={existingPath} label={label} />
        <label className="file-pick-label">
          <span className="file-pick-btn">
            {newFile ? `Selected: ${newFile.name}` : 'Upload new'}
          </span>
          <input
            type="file"
            className="file-pick-input"
            onChange={(e) => handleDocChange(requestId, productId, e, docField)}
          />
        </label>
        {newFile && <span className="new-file-badge">New file ready</span>}
      </div>
    );
  };

  return (
    <div>
      <div className="admin-section">
        <div className="back-btn-section">
          <button onClick={() => navigate('/bgv/list')}>
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

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
                {checkStatus(requestData?.status) || '—'}
              </span>
            </p>
          </div>
        </div>

        <div className="table-section">
          <h3>Update Product Status</h3>

          <div style={{ overflowX: 'auto' }}>
            <table className="service-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Mode of Verification</th>
                  <th>Verifier's Comment</th>
                  <th>Final Disposition</th>
                  {/* <th>Document 1</th>
                  <th>Document 2</th> */}
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {requestData?.BGVRequestProducts?.map((product) => {
                  const productId = getProductId(product);
                  const requestId = getRequestId(product);
                  const dirty = isDirty(product);
                  const loading = submitting[productId];
                  const draft = updateProduct[productId];

                  return (
                    <tr key={productId} className={dirty ? 'row-dirty' : ''}>
                      <td>
                        <span className="service-name">{getProductName(product)}</span>
                      </td>

                      <td>
                        {checkStatus(product.status)}
                        {/* <select
                          value={draft?.status ?? product.status}
                          onChange={(e) => handleStatusChange(requestId, productId, e)}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select> */}
                      </td>

                      <td>
                        {product.remark || 'NA'}
                        {/* <input
                          type="text"
                          value={draft?.remark ?? (product.remark || '')}
                          placeholder="Enter remarks..."
                          onChange={(e) => handleRemarkChange(requestId, productId, e)}
                        /> */}
                      </td>
                      <td>
                        {product.mode_of_verification || 'NA'}
                        {/* <select
                          value={draft?.mode_of_verification ?? product.mode_of_verification ?? ''}
                          onChange={(e) => handleModeOfVerification(requestId, productId, e)}
                        >
                          <option value="">Select verification mode..</option>
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                        </select> */}
                      </td>
                      <td>
                        {product.verifier_comment || 'NA'}
                        {/* <textarea
                          type="text"
                          value={draft?.verifier_comment ?? (product.verifier_comment || '')}
                          placeholder=""
                          onChange={(e) => handleVerifierComment(requestId, productId, e)}
                        /> */}
                      </td>
                      <td>
                        {product.final_desc || 'NA'}
                        {/* <textarea
                          type="text"
                          value={draft?.final_desc ?? (product.final_desc || '')}
                          placeholder=""
                          onChange={(e) => handleFinalDisposition(requestId, productId, e)}
                        /> */}
                      </td>
                      {/* <td>
                        <DocCell product={product} docField="doc_1" label="Doc 1" />
                      </td>

                      <td>
                        <DocCell product={product} docField="doc_2" label="Doc 2" />
                      </td> */}

                      <td>
                        {/* <button
                          className={`update-btn${dirty ? ' btn-active' : ''}`}
                          disabled={!dirty || loading}
                          onClick={() => handleStatusSubmit(productId)}
                        >
                          {loading ? <span className="bsu-spinner" /> : dirty ? 'Update' : 'No Changes'}
                        </button> */}
                        <button
                          className={`update-btn btn-active`}
                          onClick={() =>
                            setVerificationModal({
                              open: true,
                              productId,
                            })
                          }
                        >
                          verify
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

      {verificationModal.open && (
        <BGVVerificationForm
          bgvData={requestData}
          initialProductId={verificationModal.productId}
          onUpdated={fetchSingleRequest}
          isModal
          onClose={() => setVerificationModal({ open: false, productId: '' })}
        />
      )}
    </div>
  );
}

export default BGVStatusUpdate;
