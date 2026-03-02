function VideoPlayer({ video }) {
  return (
    <div className="card">
      <video controls className="w-full rounded-lg">
        <source src={video.videoUrl} type="video/mp4" />
      </video>

      <h2 className="title-md mt-4">{video.title}</h2>
      <p className="text-muted">{video.views} views</p>
    </div>
  );
}

export default VideoPlayer;