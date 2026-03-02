function StatsCard({ title, value }) {
  return (
    <div className="card text-center">
      <p className="text-muted">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

export default StatsCard;