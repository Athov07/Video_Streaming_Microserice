import { useEffect, useState } from "react";
import StatsCard from "../components/dashboard/StatsCard";
import VideoGrid from "../components/video/VideoGrid";
import profileService from "../services/profile.api";
import videoService from "../services/video.api";
import Loader from "../components/common/Loader";
import DashboardHeader from "../components/dashboard/DashboardHeader";

function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const profileRes = await profileService.getMyProfile();
        const videoRes = await videoService.getMyVideos();
        const statsRes = await videoService.getMyStats();

        setProfile(profileRes.data);
        setVideos(videoRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <DashboardHeader name={profile?.name} />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatsCard title="Total Videos" value={stats?.totalVideos || 0} />
        <StatsCard title="Total Views" value={stats?.totalViews || 0} />
        <StatsCard title="Total Likes" value={stats?.totalLikes || 0} />
      </div>

      <h2 className="title-md mb-4">My Videos</h2>
      <VideoGrid videos={videos} />
    </>
  );
}

export default DashboardPage;