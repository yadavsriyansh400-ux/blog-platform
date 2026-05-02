import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function Profile() {
    const { id } = useParams();

    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);

    const [bio, setBio] = useState("");
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);

    const currentUser = JSON.parse(sessionStorage.getItem("user"));

    const isOwner = currentUser?._id === id;

    const fetchProfile = async () => {
        try {
            const userRes = await API.get(`/users/${id}`);
            setUserData(userRes.data);
            setBio(userRes.data.bio || "");

            const postRes = await API.get(`/posts/user/${id}`);
            setPosts(postRes.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const uploadImage = async (file) => {
        if (!file) return;

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "unsigned_upload");

        try {
            setUploading(true);

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dzfefigam/image/upload",
                { method: "POST", body: data }
            );

            const result = await res.json();
            setImage(result.secure_url);
        } catch {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        await API.put(`/users/${id}`, {
            bio,
            profilePic: image,
        });

        fetchProfile();
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <div style={styles.container}>
            {/* PROFILE CARD */}
            <div style={styles.profileCard}>
                <h2 style={styles.username}>{userData.username}</h2>

                {userData.profilePic && (
                    <img src={userData.profilePic} style={styles.avatar} />
                )}

                <p style={styles.bio}>{userData.bio || "No bio yet"}</p>

                {/* EDIT PROFILE */}
                {isOwner && (
                    <form onSubmit={handleUpdate} style={styles.form}>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Update bio..."
                        />

                        <input
                            type="file"
                            onChange={(e) => uploadImage(e.target.files[0])}
                        />

                        {uploading && <p style={styles.muted}>Uploading...</p>}

                        <button>Update Profile</button>
                    </form>
                )}
            </div>

            {/* POSTS */}
            <h3 style={styles.sectionTitle}>Posts</h3>

            {posts.map((post) => (
                <div key={post._id} style={styles.card}>
                    <h4 style={styles.title}>{post.title}</h4>

                    {post.image && (
                        <img src={post.image} style={styles.image} />
                    )}

                    <p style={styles.content}>{post.content}</p>
                </div>
            ))}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "720px",
        margin: "auto",
        padding: "25px",
    },

    profileCard: {
        background: "linear-gradient(145deg, #0f0f0f, #050505)",
        padding: "20px",
        borderRadius: "14px",
        border: "1px solid rgba(225,29,72,0.2)",
        boxShadow:
            "0 0 12px rgba(225,29,72,0.15), inset 0 0 10px rgba(0,0,0,0.8)",
        textAlign: "center",
    },

    username: {
        fontFamily: "Georgia, serif",
        letterSpacing: "2px",
        textShadow: "0 0 10px rgba(225,29,72,0.4)",
    },

    avatar: {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        marginTop: "10px",
        objectFit: "cover",
        border: "2px solid rgba(225,29,72,0.3)",
    },

    bio: {
        marginTop: "10px",
        color: "#ccc",
    },

    form: {
        marginTop: "15px",
    },

    sectionTitle: {
        marginTop: "25px",
        fontFamily: "Georgia, serif",
        letterSpacing: "2px",
        textShadow: "0 0 8px rgba(225,29,72,0.3)",
    },

    card: {
        background: "linear-gradient(145deg, #0f0f0f, #050505)",
        padding: "18px",
        marginTop: "20px",
        borderRadius: "12px",
        border: "1px solid rgba(225,29,72,0.2)",
        boxShadow:
            "0 0 10px rgba(225,29,72,0.15), inset 0 0 8px rgba(0,0,0,0.8)",
        transition: "0.3s",
    },

    title: {
        textShadow: "0 0 6px rgba(225,29,72,0.3)",
    },

    content: {
        marginTop: "10px",
        color: "#ddd",
    },

    image: {
        width: "100%",
        maxHeight: "250px",
        objectFit: "cover",
        borderRadius: "8px",
        marginTop: "10px",
    },

    muted: {
        color: "#aaa",
    },
};

export default Profile;