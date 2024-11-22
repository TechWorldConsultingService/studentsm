import React, { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from storage
        const response = await axios.get("http://localhost:8000/api/posts/", {
          headers: {
            Authorization: `Bearer ${token}`, // Adjust if using "Token" instead of "Bearer"
          },
        });
        // Sort posts by `created_at` in descending order to show the latest posts first
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <MainLayout>
      <div>
        <h1>Post Feed</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {posts.map((post) => (
            <table
              key={post.id}
              style={{
                width: "100%",
                border: "1px solid #ddd",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <tbody>
                <tr>
                  <th style={styles.header}>Title</th>
                  <td style={styles.cell}>{post.title}</td>
                </tr>
                <tr>
                  <th style={styles.header}>Caption</th>
                  <td style={styles.cell}>{post.caption}</td>
                </tr>
                <tr>
                  <th style={styles.header}>Image</th>
                  <td style={styles.cell}>
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                </tr>
                <tr>
                  <th style={styles.header}>Video</th>
                  <td style={styles.cell}>
                    {post.video ? (
                      <video controls style={{ maxWidth: "100%" }} src={post.video} />
                    ) : (
                      "No Video"
                    )}
                  </td>
                </tr>
                <tr>
                  <th style={styles.header}>Creator</th>
                  <td style={styles.cell}>{post.creator.username}</td>
                </tr>
                <tr>
                  <th style={styles.header}>Created At</th>
                  <td style={styles.cell}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

const styles = {
  header: {
    textAlign: "left",
    backgroundColor: "#f4f4f4",
    padding: "8px",
    border: "1px solid #ddd",
  },
  cell: {
    padding: "8px",
    border: "1px solid #ddd",
  },
};

export default HomePage;
