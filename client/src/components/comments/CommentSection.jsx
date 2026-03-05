import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import commentService from "../../services/comment.api";
import { FaThumbsUp } from "react-icons/fa";

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  /* =========================
     Load Comments
  ========================= */
  const loadComments = async () => {
    const data = await commentService.getComments(videoId);
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, [videoId]);

  /* =========================
     Add Comment
  ========================= */
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    await commentService.addComment(videoId, commentText);

    setCommentText("");
    loadComments();
  };

  /* =========================
     Start Editing
  ========================= */
  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setCommentText(comment.text);
  };

  /* =========================
     Save Edited Comment
  ========================= */
  const handleSaveEdit = async () => {
    if (!commentText.trim()) return;

    await commentService.editComment(editingCommentId, commentText);

    setEditingCommentId(null);
    setCommentText("");

    loadComments();
  };

  /* =========================
     Cancel Edit
  ========================= */
  const cancelEdit = () => {
    setEditingCommentId(null);
    setCommentText("");
  };

  /* =========================
     Delete Comment
  ========================= */
  const handleDelete = async (id) => {
    await commentService.deleteComment(id);

    loadComments();
  };

  /* =========================
     Like Comment
  ========================= */
  const handleLike = async (commentId) => {
    await commentService.likeComment(commentId);

    loadComments();
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">
        Comments ({comments.length})
      </h3>

      {/* =========================
         Add / Edit Comment Input
      ========================= */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border rounded px-3 py-2"
        />

        {editingCommentId ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={cancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Comment
          </button>
        )}
      </div>

      {/* =========================
         Comment List
      ========================= */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="border p-3 rounded flex justify-between items-start"
          >
            {/* LEFT SIDE */}
            <div>
              <p className="font-semibold">{comment.userName}</p>

              <p className="text-gray-700">{comment.text}</p>

              {/* Like Button */}
              <button
                onClick={() => handleLike(comment._id)}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 mt-2"
              >
                <FaThumbsUp />
                {comment.likes?.length || 0}
              </button>
            </div>

            {/* RIGHT SIDE (Edit/Delete) */}
            {user && user._id === comment.userId && (
              <div className="flex items-center gap-4 text-blue-600">
                <FaEdit
                  className="cursor-pointer hover:text-gray-600"
                  onClick={() => handleEditClick(comment)}
                />

                <FaTrash
                  className="cursor-pointer hover:text-red-600"
                  onClick={() => handleDelete(comment._id)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
