import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constant";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { Typography } from "@mui/material";
import "../style/style.css"
function Profile() {
    
  const token = localStorage.getItem(ACCESS_TOKEN);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.user_id;

  const [profile,setProfile] = useState({});

  const [formData, setFormData] = useState({
    user: userId,
    mail: "",
    address: "",
    profile_picture: null,
  });

  useEffect(()=>{
    getProfile();
  },[])

  const getProfile =() => {
    api
      .get(`/api/userprofile/?userId=${userId}`)
      .then((res) => res.data)
      .then((data) => {
        setProfile(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  }


  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_picture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({}); // Reset errors before each submission

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await api.post("/api/userprofile/", formDataToSend);

      if (response.status === 201) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      
      console.log(error.response.data);
      alert("An error occurred: " + error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
  <div className="profile-display">
    <h1>Your Profile</h1>
    {profile.length > 0 ? (
      <div className="profile-info">
        <p className="profile-detail">Address: {profile[0].address}</p>
        <p className="profile-detail">Mail: {profile[0].mail}</p>
        <div className="profile-picture">
          <img
            src={"http://127.0.0.1:8000" + profile[0].profile_picture}
            alt="Profile"
          />
        </div>
      </div>
    ) : (
      <div className="no-profile">kekw</div>
    )}
  </div>
  <form
    className="profile-form"
    onSubmit={handleSubmit}
    encType="multipart/form-data"
  >
    <div className="form-group">
      <label>Email:</label>
      <input
        type="email"
        name="mail"
        value={formData.mail}
        onChange={handleChange}
        required
      />
      {errors.mail && <p className="error">{errors.mail}</p>}
    </div>

    <div className="form-group">
      <label>Address:</label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      {errors.address && <p className="error">{errors.address}</p>}
    </div>

    <div className="form-group">
      <label>Profile Picture:</label>
      <input
        type="file"
        name="profile_picture"
        accept="image/*"
        onChange={handleFileChange}
      />
      {errors.profile_picture && (
        <p className="error">{errors.profile_picture}</p>
      )}
    </div>

    <button type="submit" disabled={loading}>
      {loading ? "Submitting..." : "Submit"}
    </button>

    {errors.detail && <p className="error">{errors.detail}</p>}
  </form>
</div>

  );
}

export default Profile;
