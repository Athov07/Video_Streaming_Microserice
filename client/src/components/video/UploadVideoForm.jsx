import { useState } from "react";
import videoService from "../../services/video.api";

function UploadVideoForm() {
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", videoFile);

    await videoService.uploadVideo(formData);
    alert("Video uploaded successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <input
        className="input-field"
        placeholder="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setVideoFile(e.target.files[0])}
      />

      <button className="btn-primary">Upload</button>
    </form>
  );
}

export default UploadVideoForm;