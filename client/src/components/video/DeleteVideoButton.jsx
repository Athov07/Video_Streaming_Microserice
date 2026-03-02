import videoService from "../../services/video.api";

function DeleteVideoButton({ id }) {
  const handleDelete = async () => {
    await videoService.deleteVideo(id);
    alert("Video deleted");
  };

  return (
    <button className="btn-danger mt-2" onClick={handleDelete}>
      Delete
    </button>
  );
}

export default DeleteVideoButton;