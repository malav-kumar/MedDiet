import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isFirebaseConfigured } from "../services/firebase";

/** Gate routes behind authentication. Lets unauth'd users through if Firebase isn't configured yet (preview-friendly). */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!isFirebaseConfigured) return children;

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export default PrivateRoute;
