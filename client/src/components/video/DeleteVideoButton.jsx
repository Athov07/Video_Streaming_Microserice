import videoService from "../../services/video.api";

function DeleteVideoButton({ id, onDelete }) {
  const handleDelete = async () => {
    try {
      await videoService.deleteVideo(id);
      onDelete(id); // remove from UI
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <button className="btn-danger mt-2 w-full" onClick={handleDelete}>
      Delete
    </button>
  );
}

export default DeleteVideoButton;