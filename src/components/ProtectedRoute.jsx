import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, loading, user, hasFetchedProfile } = useSelector(
    (state) => state.auth
  );
  // const [dasloading, setDashLoading] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDashLoading(false);
  //   }, 1000);

  //   return () => {
  //     return clearTimeout(timer);
  //   };
  // }, []);

  // if (loading && dasloading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div>Verifying authentication...</div>
  //     </div>
  //   );
  // }
  if (!hasFetchedProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
