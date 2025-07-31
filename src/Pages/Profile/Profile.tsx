import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

interface Post {
  id: number;
  title: string;
  price: number;
  location: string;
  conditions: string;
  photo: string;
}

interface ProfileData {
  fname: string;
  email: string;
  adsPosted: number;
  posts: Post[];
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handlePostClick = (postId: number) => {
    window.open(`/post/${postId}`, "_blank");
  };

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/profile");

        if (response.data.status === "success") {
          setProfile(response.data.data);
        } else {
          localStorage.removeItem("isLoggedIn");
          navigate("/login");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            localStorage.removeItem("isLoggedIn");
            navigate("/login");
          }
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8081/logout");
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:8081/api/posts/${postId}`
      );
      if (response.data.status === "success") {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                posts: prev.posts.filter((post) => post.id !== postId),
                adsPosted: prev.adsPosted - 1,
              }
            : prev
        );
      } else {
        alert(response.data.message || "Failed to delete post");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem("isLoggedIn");
          navigate("/login");
        } else {
          alert("Error deleting post");
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userData = profile || {
    fname: "Loading...",
    email: "Loading...",
    adsPosted: 0,
    posts: [],
  };

  return (
    <div className="px-4 py-10 font-[Poppins]">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleHome}
          className="text-[#bb2649] border border-[#bb2649] bg-transparent px-3 py-1.5 rounded-lg font-medium transition duration-200 hover:bg-[#bb2649] hover:text-white"
        >
          🏠 Home
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
        <button
          onClick={handleLogout}
          className="text-[#bb2649] border border-[#bb2649] bg-transparent px-3 py-1.5 rounded-lg font-medium transition duration-200 hover:bg-[#bb2649] hover:text-white"
        >
          🚪 Logout
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mb-5">
          <div className="bg-[#bb2649] text-white px-4 py-3 font-semibold text-base">
            User Information
          </div>
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="bg-gray-100 p-2.5 rounded-full flex items-center justify-center">
                <i className="bi bi-person-fill text-2xl text-[#bb2649]"></i>
              </div>
              <h4 className="text-xl font-medium ml-3">{userData.fname}</h4>
            </div>
            <ul className="list-none p-0 m-0">
              <li className="flex justify-between border-b border-gray-200 py-2.5 px-4 text-sm">
                <span>📧 Email</span>
                <span>{userData.email}</span>
              </li>
              <li className="flex justify-between border-b border-gray-200 py-2.5 px-4 text-sm">
                <span>📢 Ads Posted</span>
                <span className="bg-pink-500 text-white px-3 py-1.5 rounded-full font-semibold text-xs">
                  {userData.adsPosted}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mb-5">
          <div className="bg-[#bb2649] text-white px-4 py-3 font-semibold text-base">
            My Ads
          </div>
          <div className="p-4">
            <p className="text-gray-500 mb-4">
              Your posted ads will appear here. You can edit or delete them.
            </p>
            {userData.posts.length > 0 ? (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {userData.posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden cursor-pointer"
                    onClick={() => handlePostClick(post.id)}
                  >
                    <img
                      src={`http://localhost:8081/uploads/${post.photo}`}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h5 className="text-base font-semibold mb-2">{post.title}</h5>
                      <p className="text-sm text-gray-600 mb-2.5">
                        💰 <strong>Rs. {post.price.toFixed(2)}</strong>
                        <br />
                        📍 {post.location}
                        <br />
                        🛠️ {post.conditions}
                      </p>
                      <div className="flex justify-between">
                        <Link
                          to={`/edit-post/${post.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-[#bb2649] text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border-0"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(post.id);
                          }}
                          className="bg-gray-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border-0"
                        >
                          ❌ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-blue-50 text-gray-700 px-4 py-3 border-l-4 border-[#bb2649] rounded-lg text-sm">
                ℹ️ You haven't posted any ads yet. Start by creating your first
                ad!
              </div>
            )}
            <Link
              to="/post"
              className="mt-5 bg-[#bb2649] text-white px-5 py-2.5 rounded-xl font-semibold inline-block transition-colors duration-200 hover:bg-[#9a1d3a]"
            >
              ➕ Create New Ad
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
