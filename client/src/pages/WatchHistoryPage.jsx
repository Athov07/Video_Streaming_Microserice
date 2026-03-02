import { useEffect, useState } from "react";
import profileService from "../services/profile.api";
import VideoGrid from "../components/video/VideoGrid";
import Loader from "../components/common/Loader";

function WatchHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await profileService.getWatchHistory();
      setHistory(res.data.watchHistory);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-8">
      <h1 className="title-lg mb-6">Watch History</h1>
      <VideoGrid videos={history} />
    </div>
  );
}

export default WatchHistoryPage;