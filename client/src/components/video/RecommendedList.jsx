import { useNavigate } from "react-router-dom";

export default function RecommendedList({ videos, currentId }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {videos
        .filter(v => v._id !== currentId)
        .map(video => (
          <div
            key={video._id}
            onClick={() => navigate(`/video/${video._id}`)}
            className="flex gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            <video
              src={video.url}
              className="w-32 h-20 object-cover rounded"
            />
            <div>
              <h4 className="font-semibold text-sm">
                {video.title}
              </h4>
              <p className="text-xs text-gray-500">
                {video.userName}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}