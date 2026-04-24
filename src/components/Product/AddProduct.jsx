import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import "./addProduct.css";

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

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [availableTitles, setAvailableTitles] = useState(FIXED_TITLES);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExistingProducts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/product/list");
        const products = response.data?.data || [];
        const usedTitles = products
          .map((item) => (item.name || item.title || "").toString().trim().toLowerCase())
          .filter(Boolean);

        setAvailableTitles(
          FIXED_TITLES.filter(
            (item) => !usedTitles.includes(item.toLowerCase())
          )
        );
      } catch (error) {
        toast.error("Failed to load existing products");
      } finally {
        setLoading(false);
      }
    };

    fetchExistingProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title) {
      toast.error("Please select a product title");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        // name: title,
        title,
        description,
      };
      const response = await axiosInstance.post("/product/add", payload);
      toast.success(response.data?.message || "Product added successfully");
      navigate("/product");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/product");
  };

  const isSubmitDisabled = saving || loading || availableTitles.length === 0;

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>

      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Product title<span className="required">*</span>
          </label>
          <select
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={loading || availableTitles.length === 0}
          >
            <option value="">Select product title</option>
            {availableTitles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {loading && <div className="empty-state">Loading existing products…</div>}
          {!loading && availableTitles.length === 0 && (
            <div className="empty-state">
              All fixed product titles are already in use.
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Enter a short description for the product"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitDisabled}>
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
