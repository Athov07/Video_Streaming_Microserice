import axios from "axios";

const PROFILE_API = axios.create({
  baseURL: "http://localhost:7000/api/profile",
});


PROFILE_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const profileService = {
  getMyProfile: async () => {
    return await PROFILE_API.get("/");
  },

  updateProfile: async (formData) => {
    return await PROFILE_API.put("/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  followUser: async (profileId) => {
    return await PROFILE_API.post(`/follow/${profileId}`);
  },

  getProfileByUserId: async (userId) => {
    const res = await PROFILE_API.get(`/user/${userId}`);
    return res.data; // must return full UserProfile
  },


  getWatchHistory: async () => {
    return await PROFILE_API.get("/watch-history");
  },
};

export default profileService;