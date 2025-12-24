import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { login, isAuthActionLoading, user, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if (!isCheckingAuth && user) {
      navigate("/chat", { replace: true });
    }
  }, [user, isCheckingAuth, navigate]);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      await login(codeResponse.code);
      navigate("/chat");
    },
    onError: () => {
      console.error("Google login failed");
    },
  });

  // Optional: avoid flicker
  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Welcome</h1>

      <Button loading={isAuthActionLoading} onClick={() => googleLogin()}>
        Continue with Google
      </Button>
    </div>
  );
};

export default Landing;
