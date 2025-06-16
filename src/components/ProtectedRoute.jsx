import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Verifying authentication...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}
