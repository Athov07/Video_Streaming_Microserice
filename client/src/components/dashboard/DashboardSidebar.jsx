import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function DashboardSidebar() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleNav = (path, isProtected = false) => {
    if ( !user && isProtected ) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="w-58 bg-gray-100 p-4 min-h-screen">
      <h2 className="font-bold mb-4">Menu</h2>
      <ul>
        <li
          onClick={() => handleNav("/")}
          className="cursor-pointer mb-2 hover:text-blue-600"
        >
          Home
        </li>
        <li
          onClick={() => handleNav("/dashboard")}
          className="cursor-pointer mb-2 hover:text-blue-600"
        >
          Dashboard
        </li>
        <li
          onClick={() => handleNav("/profile")}
          className="cursor-pointer mb-2 hover:text-blue-600"
        >
          Profile
        </li>
        <li
          onClick={() => handleNav("/my-videos")}
          className="cursor-pointer mb-2 hover:text-blue-600"
        >
          My Videos
        </li>
        <li
          onClick={() => handleNav("/watch-history")}
          className="cursor-pointer mb-2 hover:text-blue-600"
        >
          Watch History
        </li>
      </ul>
    </div>
  );
}

export default DashboardSidebar;
