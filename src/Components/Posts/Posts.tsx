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
  author_name?: string;  
  author_username?: string;  
}

interface PostsResponse {
  status: string;
  posts: Post[];
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PostsResponse>("http://localhost:8081/api/posts", {
          withCredentials: true,
        });

        console.log('Posts response:', response.data); 

        if (response.data.status === 'success') {
          setPosts(response.data.posts);
        } else {
          setError('Failed to fetch posts');
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError('Error fetching posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (postId: number) => {
    window.open(`/post/${postId}`, "_blank");
  };

  if (loading) {
    return (
      <div className="pt-5 pb-5 pl-[500px] flex justify-center">
        <div className="text-gray-600">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-5 pb-5 pl-[500px] flex justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="pt-5 pb-5 pl-[500px] flex justify-center">
        <div className="text-gray-600">No posts available</div>
      </div>
    );
  }

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
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
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
              {post.location || "Unknown location"} · Seller: {post.author_name || "Unknown"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
