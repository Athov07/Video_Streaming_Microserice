import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body */}
      <div className="flex flex-1">
        
        {/* Left Sidebar */}
        <DashboardSidebar />

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}