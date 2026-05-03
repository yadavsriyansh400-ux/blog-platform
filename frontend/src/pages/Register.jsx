import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            return alert("All fields are required");
        }

        try {
            await API.post("/auth/register", {
                username,
                email,
                password,
            });

            alert("Registration successful! Please verify your email.");
            navigate("/login");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || error.message);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleRegister} style={styles.card}>
                <h2 style={styles.title}>Create Account</h2>

                <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />

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

                <button type="submit">Register</button>

                <p style={styles.text}>
                    Already have an account?{" "}
                    <Link to="/login" style={styles.link}>
                        Login
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

export default Register;