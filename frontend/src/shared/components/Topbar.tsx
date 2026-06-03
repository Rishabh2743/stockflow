import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/api/authApi";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h2 className="text-lg font-semibold">Inventory Management</h2>

      <button
        onClick={handleLogout}
        className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default Topbar;