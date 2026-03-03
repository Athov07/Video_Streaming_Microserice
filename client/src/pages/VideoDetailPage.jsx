import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import videoService from "../services/video.api";

import VideoPlayer from "../components/video/VideoPlayer";
import VideoActions from "../components/video/VideoActions";
import VideoOwnerInfo from "../components/video/VideoOwnerInfo";
import RecommendedList from "../components/video/RecommendedList";
import Loader from "../components/common/Loader";

export default function VideoDetailPage() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVideoData = async () => {
    try {
      setLoading(true);

      const videoRes = await videoService.getVideoById(id);
      setVideo(videoRes.data);

      const recommendedRes = await videoService.getAllVideos();
      setRecommended(recommendedRes.data);

    } catch (err) {
      console.error("Video load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideoData();
  }, [id]);

  if (loading) return <Loader />;
  if (!video) return <p className="text-center mt-10">Video not found</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="md:col-span-2 space-y-6">

        <VideoPlayer url={video.url} />

        <VideoActions
          video={video}
          onUpdate={loadVideoData}
        />

        <VideoOwnerInfo
          video={video}
          onUpdate={loadVideoData}
        />

        <p className="text-gray-700">
          {video.description}
        </p>

      </div>

      <RecommendedList
        videos={recommended}
        currentId={id}
      />

    </div>
  );
}