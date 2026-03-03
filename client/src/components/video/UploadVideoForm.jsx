import { useState } from "react";
import videoService from "../../services/video.api";

function UploadVideoForm({ onUpload }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("public");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !videoFile) {
      return alert("Title and video file required");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("video", videoFile);

    try {
      setLoading(true);
      const res = await videoService.uploadVideo(formData);

      onUpload(res.data);

      setTitle("");
      setDescription("");
      setCategory("public");
      setVideoFile(null);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="title-md">Upload New Video</h3>

      <input
        className="input-field"
        placeholder="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="input-field"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="input-field"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>

      <input
        type="file"
        onChange={(e) => setVideoFile(e.target.files[0])}
      />

      <button className="btn-primary w-full" disabled={loading}>
        {loading ? "Uploading..." : "Upload Video"}
      </button>
    </form>
  );
}

export default UploadVideoForm;