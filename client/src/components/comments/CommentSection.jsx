import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import commentService from "../../services/comment.api";
import { FaThumbsUp } from "react-icons/fa";
import defaultAvatar from "../../assets/default-avatar.png";

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
            // console.log(comment),
          <div key={comment._id} className="flex gap-3 border-b pb-4">
            {/* Profile Image */}
            <img
              src={
                comment.profileImage ||
                defaultAvatar
              }
              alt={comment.userName}
              className="w-10 h-10 rounded-full object-cover"
            />

            {/* Comment Content */}
            <div className="flex-1">
              <p className="font-semibold text-sm">{comment.userName}</p>

              <p className="text-gray-700">{comment.text}</p>

              {/* Like Button */}
              <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                <button
                  onClick={() => handleLike(comment._id)}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <FaThumbsUp />
                  {comment.likes?.length || 0}
                </button>
              </div>
            </div>

            {/* Edit/Delete for Owner */}
            {user && user._id === comment.userId && (
              <div className="flex items-start gap-3 text-blue-600">
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
