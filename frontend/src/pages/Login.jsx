import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data));

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <p style={styles.text}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "#1a1a1a",
    padding: "30px",
    borderRadius: "10px",
    border: "1px solid #222",
    width: "300px",
    display: "flex",
    flexDirection: "column",
  },

  title: {
    marginBottom: "20px",
    textAlign: "center",
  },

  text: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#aaa",
  },

  link: {
    color: "#e11d48",
    textDecoration: "none",
  },
};

export default Login;