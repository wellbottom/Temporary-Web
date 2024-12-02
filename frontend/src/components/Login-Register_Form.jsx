import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constant";
import "../style/style.css"
function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        {name}
      </h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "16px",
        }}
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "16px",
        }}
      />
      <button
        className="form-button"
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        {name}
      </button>
    </form>
  );
}

export default Form;
