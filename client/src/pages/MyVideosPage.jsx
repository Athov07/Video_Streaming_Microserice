import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import videoService from "../services/video.api";

import UploadVideoForm from "../components/video/UploadVideoForm";
import DeleteVideoButton from "../components/video/DeleteVideoButton";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import EditVideoButton from "../components/video/EditVideoButton";
import EditVideoForm from "../components/video/EditVideoForm";

export default function MyVideosPage() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);

  // Fetch user videos
  const fetchVideos = async () => {
    try {
      const res = await videoService.getMyVideos();
      setVideos(res.data);
    } catch (error) {
      console.error("Failed to load videos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Add new video after upload
  const handleUpload = (newVideo) => {
    setVideos((prev) => [newVideo, ...prev]);
  };

  // Remove video after delete
  const handleDelete = (id) => {
    setVideos((prev) => prev.filter((video) => video._id !== id));
  };

  // Edit video
  const handleUpdate = (updatedVideo) => {
    setVideos((prev) =>
      prev.map((video) =>
        video._id === updatedVideo._id ? updatedVideo : video,
      ),
    );

    setEditingVideo(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* ===== Upload Section ===== */}
      <UploadVideoForm onUpload={handleUpload} />

      {/* ===== My Videos Section ===== */}
      <div>
        <h2 className="title-lg mb-6">My Uploaded Videos</h2>

        {videos.length === 0 ? (
          <EmptyState message="You haven't uploaded any videos yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="card">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <h3 className="mt-3 font-semibold truncate">{video.title}</h3>

                <p className="text-sm text-gray-500">{video.views} views</p>
                <EditVideoButton onClick={() => setEditingVideo(video)} />
                {editingVideo && (
                  <EditVideoForm
                    video={editingVideo}
                    onCancel={() => setEditingVideo(null)}
                    onUpdate={handleUpdate}
                  />
                )}

                <DeleteVideoButton id={video._id} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
