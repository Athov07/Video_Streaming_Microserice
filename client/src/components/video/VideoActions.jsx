import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import videoService from "../../services/video.api";

export default function VideoActions({ video, onUpdate }) {

  const handleLike = async () => {
    await videoService.toggleLike(video._id);
    onUpdate();
  };

  const handleDislike = async () => {
    await videoService.toggleDislike(video._id);
    onUpdate();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">
        {video.title}
      </h2>

      <p className="text-gray-600">
        {video.views} views
      </p>

      <div className="flex gap-6 mt-4">

        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
        >
          <FiThumbsUp size={20} />
          <span>{video.likes?.length || 0}</span>
        </button>

        <button
          onClick={handleDislike}
          className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
        >
          <FiThumbsDown size={20} />
          <span>{video.dislikes?.length || 0}</span>
        </button>

      </div>
    </div>
  );
}