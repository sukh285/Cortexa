import { axiosInstance } from '@/api/axios';
import { useAuthStore } from '@/store/auth.store';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate();
  const {checkAuth} = useAuthStore();


  return (
    <div className='h-screen flex flex-col items-center justify-center gap-6'>
      <h1 className="text-4xl font-bold">Welcome</h1>

      <GoogleLogin 
        onSuccess = {async (credentialResponse) => {
          if(!credentialResponse.credential) return;

          await axiosInstance.post("/auth/google", {
            idToken: credentialResponse.credential,
          });

          await checkAuth();
          navigate("/chat");
        }}

        onError = {() => {
          console.error("Google Login Failed");
        }}
      />
    </div>
  )
}

export default Landing
