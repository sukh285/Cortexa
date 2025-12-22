import { useGoogleLogin } from "@react-oauth/google";
import { axiosInstance } from "@/api/axios";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      await axiosInstance.post(
        "/auth/google",
        { code: codeResponse.code },
        { withCredentials: true }
      );

      await checkAuth();
      navigate("/chat");
    },
    onError: () => {
      console.error("Google login failed");
    },
  });

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Welcome</h1>

      <button
        onClick={() => login()}
        className="px-6 py-3 rounded-lg bg-black text-white font-medium"
      >
        Continue with Google
      </button>
    </div>
  );
};

export default Landing;
