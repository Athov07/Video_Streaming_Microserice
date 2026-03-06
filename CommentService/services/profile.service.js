import axios from "axios";

export const getUserProfile = async (userId, token) => {
  try {

    const response = await axios.get(
      `http://localhost:7000/api/profile/user/${userId}`,
      {
        headers: {
          Authorization: token
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error("ProfileService Error:", error.message);
    return null;
  }
};