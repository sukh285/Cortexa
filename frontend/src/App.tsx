import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "./store/auth.store";

import Landing from "./pages/Landing";
import ChatPage from "./pages/ChatPage";
import { PageLoader } from "./components/PageLoader";
import ThemeSync from "./components/ThemeSync";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <ThemeSync />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:chatId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
