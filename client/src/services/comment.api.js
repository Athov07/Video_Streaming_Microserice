import axios from "axios";

const API_URL = "http://localhost:9000/api/comments";

const getToken = () => {
  return localStorage.getItem("accessToken");
};

const commentService = {
  /* =========================
     Get Comments of a Video
  ========================= */
  getComments: async (videoId) => {
    const res = await axios.get(`${API_URL}/${videoId}`);
    return res.data;
  },

  /* =========================
     Add Comment
  ========================= */
  addComment: async (videoId, text) => {
    const token = getToken();

    const res = await axios.post(
      API_URL,
      { videoId, text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  },

  /* =========================
     Delete Comment
  ========================= */
  deleteComment: async (commentId) => {
    const token = getToken();

    const res = await axios.delete(`${API_URL}/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },

  /* =========================
     Edit Comment
  ========================= */
editComment: async (commentId, text) => {
  const token = getToken();

  const res = await axios.put(
    `${API_URL}/${commentId}`,
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
},


/* =========================
   Like Comment
========================= */

likeComment: async (commentId) => {

  const token = getToken();

  const res = await axios.put(
    `${API_URL}/${commentId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
},

};

export default commentService;
