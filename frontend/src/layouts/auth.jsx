import { Navigate, Routes, Route } from "react-router-dom";

import routes from "@/routes";
import { useAuth } from "@/hooks/useAuth";

export function Auth() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard/tasks" />;
  }

  return (
    <div>
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "auth" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
