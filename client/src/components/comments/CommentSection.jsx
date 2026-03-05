import { useEffect, useState } from "react";
import commentService from "../../services/comment.api";

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const data = await commentService.getComments(videoId);
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleAddComment = async () => {
    if (!text.trim()) return;

    await commentService.addComment(videoId, text);
    setText("");
    fetchComments();
  };

  const handleDelete = async (id) => {
    await commentService.deleteComment(id);
    fetchComments();
  };

  return (
    <div className="mt-8">

      <h3 className="text-xl font-semibold mb-4">
        Comments ({comments.length})
      </h3>

      {/* Add Comment */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />

        <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Comment
        </button>
      </div>

      {/* Comment List */}
      <div className="space-y-4">

        {comments.map((comment) => (
          <div
            key={comment._id}
            className="border p-3 rounded flex justify-between"
          >
            <div>
              <p className="text-gray-800">{comment.text}</p>

              <p className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => handleDelete(comment._id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}