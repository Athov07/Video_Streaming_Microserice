function EmptyState({ message }) {
  return (
    <div className="card text-center py-10">
      <p className="text-muted">{message || "No data available."}</p>
    </div>
  );
}

export default EmptyState;