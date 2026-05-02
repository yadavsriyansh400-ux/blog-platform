import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Home() {
  const [posts, setPosts] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});

  const user = JSON.parse(sessionStorage.getItem("user"));

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Fill all fields");

    await API.post("/posts", { title, content, image });

    setTitle("");
    setContent("");
    setImage("");

    fetchPosts();
  };

  const handleDelete = async (id) => {
    await API.delete(`/posts/${id}`);
    fetchPosts();
  };

  const fetchComments = async (postId) => {
    try {
      const res = await API.get(`/comments/${postId}`);
      setComments((prev) => ({
        ...prev,
        [postId]: res.data || [],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText[postId]) return;

    await API.post(`/comments/${postId}`, {
      text: commentText[postId],
    });

    setCommentText((prev) => ({
      ...prev,
      [postId]: "",
    }));

    fetchComments(postId);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Feed</h1>

      {/* CREATE POST */}
      <form onSubmit={handleCreate} style={styles.form}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input type="file" onChange={(e) => uploadImage(e.target.files[0])} />

        {uploading && <p style={styles.muted}>Uploading...</p>}

        <button>Create Post</button>
      </form>

      {/* POSTS */}
      {posts.map((post) => (
        <div
          key={post._id}
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-6px) scale(1.01)";
            e.currentTarget.style.boxShadow =
              "0 0 30px rgba(225,29,72,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow =
              "0 0 12px rgba(225,29,72,0.15)";
          }}
        >
          <h3 style={styles.title}>{post.title}</h3>

          {post.image && (
            <img src={post.image} style={styles.image} />
          )}

          <p style={styles.content}>{post.content}</p>

          <small style={styles.author}>
            By: {post.author?.username}{" "}
            <Link to={`/profile/${post.author?._id}`} style={styles.profileLink}>
              View Profile
            </Link>
          </small>

          {user && post.author?._id === user._id && (
            <button style={styles.delete} onClick={() => handleDelete(post._id)}>
              Delete
            </button>
          )}

          {/* COMMENTS */}
          <div style={styles.commentBox}>
            <button onClick={() => fetchComments(post._id)}>
              Load Comments
            </button>

            <div style={styles.commentInput}>
              <input
                placeholder="Write comment"
                value={commentText[post._id] || ""}
                onChange={(e) =>
                  setCommentText({
                    ...commentText,
                    [post._id]: e.target.value,
                  })
                }
              />
              <button onClick={() => handleAddComment(post._id)}>
                Add
              </button>
            </div>

            {(comments[post._id] || []).map((c) => (
              <div key={c._id} style={styles.comment}>
                <b style={styles.commentUser}>
                  {c.user?.username}
                </b>: {c.text}
              </div>
            ))}
          </div>
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

  heading: {
    fontFamily: "Georgia, serif",
    letterSpacing: "3px",
    fontSize: "36px",
    textShadow: "0 0 12px rgba(225,29,72,0.4)",
  },

  form: {
    background: "linear-gradient(145deg, #0f0f0f, #050505)",
    padding: "18px",
    borderRadius: "14px",
    border: "1px solid rgba(225,29,72,0.2)",
    boxShadow:
      "0 0 12px rgba(225,29,72,0.15), inset 0 0 10px rgba(0,0,0,0.8)",
  },

  card: {
    background: "linear-gradient(145deg, #0f0f0f, #050505)",
    padding: "20px",
    marginTop: "25px",
    borderRadius: "14px",
    border: "1px solid rgba(225,29,72,0.2)",
    boxShadow:
      "0 0 12px rgba(225,29,72,0.15), inset 0 0 10px rgba(0,0,0,0.8)",
    transition: "all 0.3s ease",
  },

  title: {
    letterSpacing: "1px",
    textShadow: "0 0 8px rgba(225,29,72,0.3)",
  },

  content: {
    marginTop: "10px",
    lineHeight: "1.6",
    color: "#ddd",
  },

  author: {
    color: "#aaa",
    fontSize: "13px",
  },

  profileLink: {
    color: "#e11d48",
    marginLeft: "8px",
    textDecoration: "none",
  },

  image: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "cover",
    marginTop: "10px",
    borderRadius: "8px",
    filter: "brightness(0.85)",
  },

  delete: {
    marginTop: "10px",
    background: "#7f1d1d",
  },

  muted: {
    color: "#aaa",
  },

  commentBox: {
    marginTop: "15px",
    borderTop: "1px solid #222",
    paddingTop: "12px",
  },

  commentInput: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },

  comment: {
    marginTop: "8px",
    background: "linear-gradient(145deg, #0a0a0a, #050505)",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid rgba(225,29,72,0.15)",
    boxShadow: "0 0 6px rgba(225,29,72,0.08)",
  },

  commentUser: {
    color: "#e11d48",
  },
};

export default Home;