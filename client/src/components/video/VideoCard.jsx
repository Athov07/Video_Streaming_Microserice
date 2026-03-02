import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/watch/${video._id}`)}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition"
    >
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">
          {video.title}
        </h3>
        <p className="text-sm text-gray-500">
          {video.views} views
        </p>
      </div>
    </div>
  );
}

export default VideoCard;