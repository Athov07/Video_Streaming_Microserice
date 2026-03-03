import { useEffect, useState } from "react";
import videoService from "../../services/video.api";

export default function EditVideoForm({ video, onCancel, onUpdate }) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await videoService.editVideo(video._id, {
        title,
        description,
      });

      onUpdate(res.data);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="title-md mb-4">Edit Video</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="input w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex gap-4">
          <button type="submit" className="btn-primary">
            Update
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}