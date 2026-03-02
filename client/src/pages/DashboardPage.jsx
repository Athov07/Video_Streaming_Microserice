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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const profileRes = await profileService.getMyProfile();
      const videoRes = await videoService.getMyVideos();

      setProfile(profileRes.data);
      setVideos(videoRes.data);
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <DashboardHeader name={profile.name} />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatsCard title="Total Videos" value={profile.stats.totalVideos} />
        <StatsCard title="Total Views" value={profile.stats.totalViews} />
        <StatsCard title="Total Likes" value={profile.stats.totalLikes} />
      </div>

      <h2 className="title-md mb-4">My Videos</h2>
      <VideoGrid videos={videos} />
    </>
  );
}

export default DashboardPage;