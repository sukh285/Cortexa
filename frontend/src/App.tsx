import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/auth.store";
import { useEffect, type ReactNode } from "react";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth){
    return <div>
      Loading...
    </div>
  };
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
