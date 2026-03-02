import VideoCard from "./VideoCard";

function VideoGrid({ videos }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}

export default VideoGrid;