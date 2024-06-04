import { Routes, Route, Navigate } from "react-router-dom";

import { Dashboard, Auth } from "@/layouts";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard/tables" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
