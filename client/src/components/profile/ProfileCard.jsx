import { useRef, useState } from "react";
import profileService from "../../services/profile.api";
import defaultAvatar from "../../assets/default-avatar.png";
import { FaGlobe, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function ProfileCard({
  profile,
  isOwnProfile,
  onProfileUpdate,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      setUploading(true);
      const res = await profileService.updateProfile(formData);
      onProfileUpdate(res.data);
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* Profile Image */}
      <div className="relative">
        <img
          src={profile.profilePicture || defaultAvatar}
          className="w-32 h-32 rounded-full object-cover shadow-md"
        />

        {isOwnProfile && (
          <button
            onClick={() => fileInputRef.current.click()}
            className="mt-3 btn-primary"
          >
            Upload New Photo
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      {/* Name */}
      <h2 className="mt-4 text-xl font-semibold text-gray-800">
        {profile.name}
      </h2>

      {/* Bio */}
      <p className="text-sm text-gray-500 mt-2 max-w-xs">
        {profile.bio || "No bio added yet."}
      </p>

      {/* Followers / Following */}
      <div className="flex gap-6 mt-4 text-sm text-gray-600">
        <span>
          <strong>{profile.followers?.length || 0}</strong> Followers
        </span>
        <span>
          <strong>{profile.following?.length || 0}</strong> Following
        </span>
      </div>
      {profile.socialLinks && (
        <div className="flex gap-5 mt-4 text-xl">
          {profile.socialLinks.website && (
            <a
              href={profile.socialLinks.website}
              target="_blank"
              rel="noreferrer"
            >
              <FaGlobe className="hover:text-gray-800 transition" />
            </a>
          )}

          {profile.socialLinks.twitter && (
            <a
              href={profile.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <FaTwitter className="text-blue-500 hover:text-blue-600 transition" />
            </a>
          )}

          {profile.socialLinks.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin className="text-blue-700 hover:text-blue-800 transition" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
