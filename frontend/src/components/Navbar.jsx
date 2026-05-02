import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
      {/* LEFT: LOGO */}
      <h2 style={styles.logo}>BlogApp</h2>

      {/* RIGHT: LINKS */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Home
        </Link>

        {user && (
          <Link
            to={`/profile/${user._id}`}
            style={styles.link}
          >
            Profile
          </Link>
        )}

        {user && (
          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",

    background: "linear-gradient(145deg, #0f0f0f, #050505)",
    borderBottom: "1px solid rgba(225,29,72,0.2)",

    boxShadow: "0 0 15px rgba(225,29,72,0.2)",

    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  logo: {
    fontFamily: "Georgia, serif",
    letterSpacing: "2px",
    textShadow: "0 0 10px rgba(225,29,72,0.5)",
  },

  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },

  link: {
    color: "#ddd",
    textDecoration: "none",
    fontSize: "15px",
    position: "relative",
    transition: "0.3s",
  },

  logout: {
    background: "linear-gradient(135deg, #7f1d1d, #e11d48)",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
    boxShadow: "0 0 10px rgba(225,29,72,0.3)",
    transition: "0.3s",
  },
};

export default Navbar;