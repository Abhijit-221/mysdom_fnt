import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { ArrowLeft, Edit2, Save, X } from "lucide-react";
import "./viewOrEditProduct.css";

const FIXED_TITLES = [
  "Employment check",
  "Education check",
  "Criminal check",
  "ID verification",
  "Due diligence",
  "Address verification",
  "Social media checks",
  "Database checks",
  "Credit checks",
];

const ViewOrEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableTitles, setAvailableTitles] = useState(FIXED_TITLES);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchProduct();
    fetchAvailableTitles();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/product/getby/${id}`);
      const productData = response.data?.data || {};
      setProduct(productData);
      setTitle(productData.name || productData.title || "");
      setDescription(productData.description || "");
    } catch (error) {
      toast.error("Failed to load product details");
      navigate("/product");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTitles = async () => {
    try {
      const response = await axiosInstance.get("/product/list");
      const products = response.data?.data || [];
      const usedTitles = products
        .filter((p) => p.id) // Exclude current product
        .map((item) => (item.name || item.title || "").toString().trim().toLowerCase())
        .filter(Boolean);

      setAvailableTitles(
        FIXED_TITLES.filter(
          (item) => !usedTitles.includes(item.toLowerCase())
        )
      );
    } catch (error) {
      // Keep all titles available if fetch fails
      setAvailableTitles(FIXED_TITLES);
    }
  };

  const handleSave = async () => {
    if (!title) {
      toast.error("Please select a product title");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        id: id,
        name: title,
        title,
        description,
      };

      const response = await axiosInstance.put(`/product/update`, payload);
      toast.success(response.data?.message || "Product updated successfully");

      setEditMode(false);
      fetchProduct(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (editMode) {
      // Reset form to original values
      setTitle(product.name || product.title || "");
      setDescription(product.description || "");
      setEditMode(false);
    } else {
      navigate("/product");
    }
  };

  if (loading) {
    return (
      <div className="view-edit-product-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-edit-product-wrapper">
      {/* Hero Banner */}
      <div className="product-hero-banner">
        <div className="banner-content">
          <button className="back-btn" onClick={handleCancel}>
            <ArrowLeft size={18} />
            Back to Products
          </button>
          <div className="banner-title-section">
            <h1 className="product-page-title">{editMode ? "Edit Product" : "Product Details"}</h1>
            <p className="product-page-subtitle">{title}</p>
          </div>
        </div>
      </div>

      <div className="view-edit-product-container">
        <div className="view-edit-product-content">
          <div className="product-form-section">
            <div className="form-card">
              <div className="card-header">
                <h3>Product Information</h3>
              </div>
              
              <div className="card-body">
                <div className="form-group">
                  <label>
                    Product Title<span className="required">*</span>
                  </label>
                  {editMode ? (
                    <select
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={saving}
                      className="form-input"
                    >
                      <option value="">Select product title</option>
                      {availableTitles.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                      {title && !availableTitles.includes(title) && (
                        <option value={title}>{title} (Current)</option>
                      )}
                    </select>
                  ) : (
                    <div className="view-value">{title}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Description</label>
                  {editMode ? (
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter a detailed product description"
                      disabled={saving}
                      className="form-input"
                    />
                  ) : (
                    <div className="view-value description-view">{description || "No description available"}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions-section">
              {!editMode && (
                <button
                  className="btn btn-primary"
                  onClick={() => setEditMode(true)}
                >
                  <Edit2 size={18} />
                  Edit Product
                </button>
              )}
              {editMode && (
                <div className="edit-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSave}
                    disabled={saving || !title}
                  >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrEditProduct;