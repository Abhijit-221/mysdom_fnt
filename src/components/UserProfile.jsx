import { useEffect, useState } from "react";
import axios from "axios";
import "./userProfile.css";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const token = localStorage.getItem("token");
  const { id } = useParams();

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get(
        `/auth/user/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.data);
      // console.log (`http://localhost:3000/${res.data.data.profilePicture}`);
      setPreview(`http://localhost:3000/${res.data.data.profilePicture}`);
    } catch (err) {
      if (err.response) {
                // Server responded with error (4xx, 5xx)
                console.log("Status:", err.response.status);
                console.log("Data:", err.response.data);

                toast.error(err.response.data.message || "Server Error");
            }
            else if (err.request) {
                // Request was sent but no response received
                console.log("No response received:", err.request);
                toast.error("No response from server");
            }
            else {
                // Something else happened
                console.log("Error:", err.message);
                toast.error(err.message);
            }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("id", user._id);
      formData.append("username", user.username);
    //   formData.append("email", user.email);
      formData.append("gender", user.gender);

      if (imageFile) {
        formData.append("profile_pic", imageFile);
      }

      await axiosInstance.post(
         `/auth/user-update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
      );

      toast("Profile Updated Successfully");
      fetchProfile();
    } catch (err) {
        console.log(err)
      if (err.response) {
                // Server responded with error (4xx, 5xx)
                console.log("Status:", err.response.status);
                console.log("Data:", err.response.data);

                toast.error(err.response.data.message || "Server Error");
            }
            else if (err.request) {
                // Request was sent but no response received
                console.log("No response received:", err.request);
                toast.error("No response from server");
            }
            else {
                // Something else happened
                console.log("Error:", err.message);
                toast.error(err.message);
            }
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">

        <h2>My Profile</h2>

        <div className="profile-image-section">
          <div className="profile-image-wrapper">
            <img
              src={
                preview
                  ? preview
                  : "https://via.placeholder.com/120"
              }
              alt="Profile"
            />
          </div>

          <label className="upload-btn">
            Change Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              readOnly
              value={user.email}
            //   onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={user.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className="save-btn">
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
}

export default UserProfile;