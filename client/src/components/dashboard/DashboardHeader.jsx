function DashboardHeader({ name }) {
  return (
    <div className="mb-6">
      <h1 className="title-lg">Welcome, {name}</h1>
    </div>
  );
}

export default DashboardHeader;