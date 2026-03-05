import { useState, useEffect } from "react";
import profileService from "../../services/profile.api";
import defaultAvatar from "../../assets/default-avatar.png";

export default function VideoOwnerInfo({ video, currentUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(
    video.followersCount || 0,
  );
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProfileData = async () => {
    try {
      if (!video?.userId) return;
      // Get video owner profile
      const ownerProfile = await profileService.getProfileByUserId(
        video.userId,
      );

      if (ownerProfile) {
        setProfileImage(ownerProfile.profilePicture || defaultAvatar);
        setFollowersCount(ownerProfile.followers?.length || 0);
      }

      // Check follow status
      if (currentUserId && currentUserId !== video.userId) {
        const myProfile =
          await profileService.getProfileByUserId(currentUserId);

        if (myProfile?.following) {
          const following = myProfile.following.some(
            (f) => f.userId === video.userId || f.toString() === video.userId,
          );
          setIsFollowing(following);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile info", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [video.userId, currentUserId]);

  const handleFollow = async () => {
    if (String(currentUserId) === String(video.userId)) return;

    try {
      setLoading(true);

      const res = await profileService.followUser(video.userId);

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
      {/* Left side (Profile Image + Name + Followers) */}
      <div className="flex items-center gap-3">
        <img
          src={profileImage || defaultAvatar}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <p className="font-semibold text-lg">{video.userName}</p>
          <p className="text-sm text-gray-500">{followersCount} followers</p>
        </div>
      </div>

      {/* Follow Button (Hide for owner) */}
      {String(currentUserId) !== String(video.userId) && (
        <button
          onClick={handleFollow}
          disabled={loading}
          className={`px-4 py-1 rounded ${
            isFollowing ? "bg-gray-300 text-black" : "bg-red-500 text-white"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}
