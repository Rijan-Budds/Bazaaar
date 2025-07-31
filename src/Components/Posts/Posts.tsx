import React, { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  photo?: string;
  category: string;
  conditions: string;
  price: number | string;
  negotiable: boolean;
  description: string;
  created_at: string;
  location?: string;
  seller_name?: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios
      .get<Post[]>("http://localhost:8081/api/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const handlePostClick = (postId: number) => {
    window.open(`/post/${postId}`, "_blank");
  };

  return (
    <div className="pt-5 pb-5 pl-[500px] flex flex-col gap-4">
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => handlePostClick(post.id)}
          className="flex items-center max-w-4xl w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-200"
        >
          {post.photo && (
            <img
              src={`http://localhost:8081/uploads/${post.photo}`}
              alt="Post"
              className="w-30 h-22 object-cover rounded-md mr-4 flex-shrink-0"
            />
          )}
          <div className="flex flex-col justify-center flex-1">
            <h3 className="text-base font-semibold text-gray-800 mb-1">{post.title}</h3>
            <p className="text-sm text-gray-600 mb-1">
              Category: {post.category} | Condition: {post.conditions}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              Price: Rs. {post.price} ({post.negotiable ? "Negotiable" : "Fixed"})
            </p>
            <p
              className="text-xs text-gray-500 truncate max-w-full mb-1"
              title={post.description}
            >
              {post.description.length > 100
                ? `${post.description.substring(0, 100)}...`
                : post.description}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Posted on {new Date(post.created_at).toLocaleString()} ·{" "}
              {post.location || "Unknown location"} · Seller: {post.seller_name || "Unknown"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
