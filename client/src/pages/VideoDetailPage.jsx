import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import videoService from "../services/video.api.js";
import profileService from "../services/profile.api.js";


const VideoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const token = localStorage.getItem("accessToken");

  // ==============================
  // Fetch Single Video
  // ==============================
  const fetchVideo = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/videos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVideo(data);
      setFollowersCount(data.followersCount || 0);
      setIsFollowing(data.isFollowing || false);
    } catch (error) {
      console.error("Failed to load video", error);
    }
  };

  // ==============================
  // Fetch Recommended Videos
  // ==============================
  const fetchRecommended = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/videos"
      );
      setRecommended(data);
    } catch (error) {
      console.error("Failed to load recommended videos", error);
    }
  };

  // ==============================
  // Like Video
  // ==============================
const handleLike = async () => {
  try {
    await videoService.toggleLike(video._id);
    alert("Liked!");
  } catch (error) {
    console.error("Like failed", error);
  }
};


  // ==============================
  // Dislike Video
  // ==============================
const handleDislike = async () => {
  try {
    await videoService.toggleDislike(video._id);
    alert("Disliked!");
  } catch (error) {
    console.error("Dislike failed", error);
  }
};

  // ==============================
  // Follow / Unfollow
  // ==============================
const handleFollow = async () => {
  try {
    if (!video?.user?._id) return;
    await profileService.followUser(video.user._id);
    alert("Followed!");
  } catch (error) {
    console.error("Follow failed", error);
  }
};

  // ==============================
  // Load Data
  // ==============================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchVideo();
      await fetchRecommended();
      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  if (!video) {
    return <h2 className="text-center mt-10">Video not found</h2>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* ================= LEFT SIDE ================= */}
      <div className="md:col-span-2">

        {/* Video Player */}
        <video
          src={video.url}
          controls
          className="w-full rounded-lg"
        />

        {/* Title */}
        <h2 className="text-2xl font-semibold mt-4">
          {video.title}
        </h2>

        {/* Views */}
        <p className="text-gray-600 mt-1">
          👁 {video.views} views
        </p>

        {/* Like / Dislike */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleLike}
            className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            👍 {video.likes?.length || 0}
          </button>

          <button
            onClick={handleDislike}
            className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            👎 {video.dislikes?.length || 0}
          </button>
        </div>

        {/* User Info + Follow */}
        <div className="flex items-center justify-between mt-6 border-t pt-4">

          <div>
            <p className="font-semibold text-lg">
              {video.userName}
            </p>

            <p className="text-sm text-gray-500">
              {followersCount} followers
            </p>
          </div>

          <button
            onClick={handleFollow}
            className={`px-4 py-1 rounded ${
              isFollowing
                ? "bg-gray-300"
                : "bg-red-500 text-white"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>

        </div>

        {/* Description */}
        <p className="mt-6 text-gray-700">
          {video.description}
        </p>

      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="space-y-4">

        {recommended
          .filter((item) => item._id !== id)
          .map((item) => (
            <div
              key={item._id}
              className="flex gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => navigate(`/video/${item._id}`)}
            >

              <video
                src={item.url}
                className="w-32 h-20 object-cover rounded"
              />

              <div>
                <h4 className="font-semibold text-sm">
                  {item.title}
                </h4>

                <p className="text-xs text-gray-500">
                  {item.userName}
                </p>
              </div>

            </div>
          ))}

      </div>
    </div>
  );
};

export default VideoDetailPage;