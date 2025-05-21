import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
const LogoutPage = () => {
  const navigate = useNavigate();
 const {logout}=useAuthStore();

  const handleLogout = async () => {
      logout();
      navigate("/login");
  };

  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <div className="w-full h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 p-8 rounded-xl shadow-lg text-center space-y-4">
        <h2 className="text-xl font-semibold text-base-content">
          Are you sure you want to logout?
        </h2>
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={handleCancel}
            className="btn btn-outline btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-error text-error-content"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
