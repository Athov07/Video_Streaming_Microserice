import { useState, useEffect } from "react";
import profileService from "../../services/profile.api";

export default function VideoOwnerInfo({ video, currentUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(video.followersCount || 0);
  const [loading, setLoading] = useState(false);

  const fetchFollowStatus = async () => {
    try {
      if (!currentUserId || currentUserId === video.userId) return;

      const myProfile = await profileService.getProfileByUserId(currentUserId);
      if (myProfile?.following) {
        const following = myProfile.following.some(
          (f) => f.toString() === video.userId.toString()
        );
        setIsFollowing(following);
      }
    } catch (error) {
      console.error("Failed to fetch follow info", error);
    }
  };

  useEffect(() => {
    fetchFollowStatus();
    setFollowersCount(video.followersCount || 0);
  }, [video.userId, currentUserId, video.followersCount]);

  const handleFollow = async () => {
    if (currentUserId === video.userId) {
      alert("You cannot follow yourself");
      return;
    }

    try {
      setLoading(true);
      const res = await profileService.followUser(video.userId);

      // Update state from backend response
      setIsFollowing(res.data.isFollowing);
      setFollowersCount(res.data.followersCount);

      setLoading(false);
    } catch (error) {
      console.error("Follow/unfollow failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center border-t pt-4">
      <div>
        <p className="font-semibold text-lg">{video.userName}</p>
        <p className="text-sm text-gray-500">{followersCount} followers</p>
      </div>

      <button
        onClick={handleFollow}
        className={`px-4 py-1 rounded ${
          isFollowing ? "bg-gray-300 text-black" : "bg-red-500 text-white"
        }`}
        disabled={loading}
      >
        {currentUserId === video.userId
          ? "You"
          : isFollowing
          ? "Following"
          : "Follow"}
      </button>
    </div>
  );
}