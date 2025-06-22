import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  console.log("Auth loading:", loading, "Authenticated:", isAuthenticated);
  const navigate = useNavigate();
  const [dasloading, setDashLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashLoading(false);
    }, 1000);

    return () => {
      return clearTimeout(timer);
    };
  }, []);

  if (loading && dasloading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Verifying authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return navigate("/login");
  }

  if (role && user?.role !== role) {
    return navigate("/login");
  }

  return children;
}
