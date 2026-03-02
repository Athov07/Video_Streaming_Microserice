function ActivityFeed({ activities }) {
  return (
    <div className="card">
      <h2 className="title-md mb-4">Recent Activity</h2>

      {activities?.length === 0 ? (
        <p className="text-muted">No recent activity</p>
      ) : (
        activities.map((item, index) => (
          <div key={index} className="border-b py-2 text-sm">
            {item}
          </div>
        ))
      )}
    </div>
  );
}

export default ActivityFeed;