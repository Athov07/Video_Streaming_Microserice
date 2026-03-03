export default function VideoPlayer({ url }) {
  return (
    <video
      src={url}
      controls
      className="w-full rounded-lg"
    />
  );
}