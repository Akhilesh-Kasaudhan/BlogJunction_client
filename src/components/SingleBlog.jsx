import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  toggleLike,
  getSummarizeContent,
} from "../redux/slices/postThunk";
import {
  getCommentsForPost,
  writeComments,
  deleteComment,
} from "../redux/slices/commentSlice";
import draftToHtml from "draftjs-to-html";

const SingleBlog = () => {
  const { postId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts, loading, error } = useSelector((state) => state.posts);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const blog = posts.find((post) => post._id === postId);

  const { comments, loading: commentsLoading } = useSelector(
    (state) => state.comments
  );

  const { summary, summaryLoading, summaryError } = useSelector(
    (state) => state.posts
  );

  const [newComment, setNewComment] = useState("");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isSummaryRequested, setIsSummaryRequested] = useState(false);

  useEffect(() => {
    if (!blog) {
      dispatch(getPostById(postId));
    }
  }, [dispatch, postId, blog]);

  const handleLike = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    dispatch(toggleLike(postId)).then(() => dispatch(getPostById(postId)));
  };

  const handleSummarize = () => {
    setIsSummaryRequested(true);
    dispatch(getSummarizeContent(postId));
  };

  useEffect(() => {
    dispatch(getCommentsForPost(postId));
  }, [dispatch, postId]);

  const handleAddComment = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    if (newComment.trim() === "") {
      alert("Please enter a comment before posting.");
      return;
    }

    dispatch(writeComments({ content: newComment, id: postId }));
    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    if (user?.role !== "admin") {
      alert("You don't have permission to delete comments.");
      return;
    }

    dispatch(deleteComment(commentId));
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const hasUserLiked =
    blog && isAuthenticated && user
      ? blog.likes.includes(user._id || user.id)
      : false;

  if (loading || !blog) {
    return <div className="text-center mt-20 text-lg">Loading blog...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-lg text-red-500">
        Error loading blog: {error}
      </div>
    );
  }

  let htmlContent = "";
  try {
    const contentState = JSON.parse(blog.content);
    htmlContent = draftToHtml(contentState);
  } catch (e) {
    htmlContent = "<p>Error rendering blog content</p>";
  }

  return (
    <div className="max-w-4xl mx-auto mt-24 p-4 space-y-6 bg-base-100 shadow-lg rounded-xl">
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Authentication Required</h3>
            <p className="text-gray-600 mb-6">
              You need to be logged in to like posts and add comments. Please
              login or create an account to continue.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={handleAuthPromptClose} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleGoToLogin} className="btn btn-primary">
                Login
              </button>
            </div>
          </div>
        </div>
      )}
      {blog.image?.secure_url && (
        <div className="w-full h-64 overflow-hidden rounded-lg">
          <img
            src={blog.image.secure_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold text-primary">{blog.title}</h1>
      <p className="text-lg text-gray-600">{blog.desc}</p>
      <div className="flex items-center justify-start gap-8">
        <p className="text-sm text-gray-500">Author : {blog.author?.email}</p>
        <p className="text-sm text-gray-500">
          Posted at :{" "}
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div
        className="bg-base-200 p-4 rounded-lg"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleLike}
          className={`btn btn-outline ${
            hasUserLiked ? "btn-primary bg-primary text-white" : "btn-primary"
          }`}
          title={!isAuthenticated ? "Login required to like posts" : ""}
        >
          👍 {hasUserLiked ? "Liked" : "Like"} ({blog.likes.length})
        </button>

        {isAuthenticated ? (
          isSummaryRequested ? (
            summaryLoading ? (
              <p>Loading summary...</p>
            ) : summaryError ? (
              <p className="text-red-500">{summaryError}</p>
            ) : summary?.summary ? (
              <div className="alert alert-info mt-4 whitespace-pre-line">
                <span className="font-bold">Summary:</span> {summary.summary}
              </div>
            ) : null
          ) : (
            <button onClick={handleSummarize} className="btn btn-primary">
              Summarize Blog
            </button>
          )
        ) : (
          <p className="text-gray-500">Please log in to view the summary.</p>
        )}
      </div>

      <div className="divider">Comments ({comments.length})</div>

      {!isAuthenticated && (
        <div className="alert alert-warning">
          <span>
            Please{" "}
            <button onClick={handleGoToLogin} className="link link-primary">
              login
            </button>
          </span>
        </div>
      )}

      {commentsLoading ? (
        <p>Loading comments...</p>
      ) : (
        comments.map((c) => (
          <div
            key={c._id}
            className="bg-base-200 p-3 rounded-md flex justify-between"
          >
            <div>
              <span className="font-semibold text-secondary">
                {c.user?.username || "User"}:
              </span>{" "}
              <span>{c.content}</span>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(c.createdAt).toLocaleDateString()}
              </div>
            </div>

            {isAuthenticated && user?.role === "admin" && (
              <button
                className="text-red-500 text-sm hover:text-red-700"
                onClick={() => handleDeleteComment(c._id)}
                title="Delete comment (Admin only)"
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder={
            isAuthenticated
              ? "Add a comment..."
              : "Please login to add comments"
          }
          className="input input-bordered w-full"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!isAuthenticated}
        />
        <button
          className="btn btn-success"
          onClick={handleAddComment}
          disabled={!isAuthenticated || newComment.trim() == ""}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default SingleBlog;
