import profileService from "../../services/profile.api";

function FollowButton({ userId }) {
  const handleFollow = async () => {
    await profileService.followUser(userId);
    alert("Followed successfully");
  };

  return (
    <button onClick={handleFollow} className="btn-primary mt-3">
      Follow
    </button>
  );
}

export default FollowButton;