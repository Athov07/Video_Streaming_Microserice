import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import profileService from "../services/profile.api";
import videoService from "../services/video.api";

import ProfileCard from "../components/profile/ProfileCard";
import FollowButton from "../components/profile/FollowButton";
import EditProfileModal from "../components/profile/EditProfileModal";
import VideoGrid from "../components/video/VideoGrid";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const isOwnProfile =
  String(user?._id) === String(profile?.userId?._id || profile?.userId);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRes = await profileService.getMyProfile();
        setProfile(profileRes.data);

        const videoRes = await videoService.getMyVideos();
        setVideos(videoRes.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <Loader />;

  if (!profile) return <EmptyState message="Profile not found" />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      
      {/* ================= PROFILE SECTION ================= */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

          {/* Left Side - Profile Card */}
          <ProfileCard
            profile={profile}
            isOwnProfile={isOwnProfile}
            onProfileUpdate={setProfile}
          />

          {/* Right Side */}
          <div className="flex-1">

            <h2 className="title-lg">{profile.name}</h2>

            {/* Email from AuthContext (AuthService owns email) */}
            <p className="text-muted mb-4">{user?.email}</p>

            {/* Stats */}
            <div className="flex gap-8 text-sm text-gray-600 mb-6">
              <div>
                <strong>{profile.stats?.totalVideos || 0}</strong>
                <p>Videos</p>
              </div>

              <div>
                <strong>{profile.stats?.totalViews || 0}</strong>
                <p>Views</p>
              </div>

              <div>
                <strong>{profile.stats?.totalLikes || 0}</strong>
                <p>Likes</p>
              </div>
            </div>

            {/* Action Button */}
            {isOwnProfile ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            ) : (
              <FollowButton userId={profile._id} />
            )}
          </div>
        </div>
      </div>

      {/* ================= VIDEOS SECTION ================= */}
      <div>
        <h3 className="title-md mb-6">
          {isOwnProfile ? "My Videos" : "User Videos"}
        </h3>

        {videos.length > 0 ? (
          <VideoGrid videos={videos} />
        ) : (
          <EmptyState message="No videos uploaded yet" />
        )}
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditing(false)}
          onProfileUpdate={(updatedProfile) => {
            setProfile(updatedProfile);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}