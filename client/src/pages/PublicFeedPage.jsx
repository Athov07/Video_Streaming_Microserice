import { useEffect, useState } from "react";
import { useContext } from "react";
import videoService from "../services/video.api";
import VideoGrid from "../components/video/VideoGrid";
import Loader from "../components/common/Loader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

function PublicFeedPage() {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await videoService.getAllVideos();
        setVideos(res.data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Navbar at the top */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main content */}
        <main className="flex-1 p-8">
          <h1 className="title-lg mb-6">Public Videos</h1>
          <VideoGrid videos={videos} />
        </main>
      </div>
    </div>
  );
}

export default PublicFeedPage;