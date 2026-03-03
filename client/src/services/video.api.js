import axios from "axios";

const VIDEO_API = axios.create({
  baseURL: "http://localhost:8000/api/videos",
});

// Attach token automatically
VIDEO_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // make sure this matches login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const videoService = {
  uploadVideo: async (formData) => {
    return await VIDEO_API.post("/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getMyVideos: async () => {
    return await VIDEO_API.get("/my-videos");
  },

  deleteVideo: async (id) => {
    return await VIDEO_API.delete(`/delete/${id}`);
  },

  incrementViews: async (id) => {
    return await VIDEO_API.patch(`/views/${id}`);
  },

  getAllVideos: async () => {
    return await VIDEO_API.get("/");
  },

  getVideoById: async (id) => {
    return await VIDEO_API.get(`/${id}`);
  },

 editVideo: async (id, data) => {
  return await VIDEO_API.put(`/edit/${id}`, data);
},

  toggleLike: async (id) => {
    return await VIDEO_API.put(`/like/${id}`);
  },

  toggleDislike: async (id) => {
    return await VIDEO_API.put(`/dislike/${id}`);
  },
};

export default videoService;
