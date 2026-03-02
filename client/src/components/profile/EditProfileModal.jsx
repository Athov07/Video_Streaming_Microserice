import { useState } from "react";
import profileService from "../../services/profile.api";

export default function EditProfileModal({ profile, onClose, onProfileUpdate }) {
  const [formData, setFormData] = useState({
    name: profile.name || "",
    bio: profile.bio || "",
    website: profile.socialLinks?.website || "",
    twitter: profile.socialLinks?.twitter || "",
    linkedin: profile.socialLinks?.linkedin || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("bio", formData.bio);

    data.append(
      "socialLinks",
      JSON.stringify({
        website: formData.website,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
      })
    );

    try {
      setLoading(true);
      const res = await profileService.updateProfile(data);
      onProfileUpdate(res.data);
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-lg">
        <h2 className="title-md mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="input-field"
          />

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="input-field"
          />

          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website URL"
            className="input-field"
          />

          <input
            type="text"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            placeholder="Twitter URL"
            className="input-field"
          />

          <input
            type="text"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            className="input-field"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-danger"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}