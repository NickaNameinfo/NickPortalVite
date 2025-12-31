import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import { setCookie, getCookie } from "../../../JsFiles/CommonFunction.mjs";
import { useLoginMutation } from "../Service.mjs";
import { useAppDispatch } from "../../../Common/hooks";
import { updateLoginDetails } from "../../../Common/globalSlice";
import InputNextUI from "../../../Components/Common/Input/input";
import { IconLoginSVG } from "../../../Components/Common/Icons/icon";
const Login = () => {
  const authenticate = (user, next) => {
    console.log('3452345234', user);
    if (typeof window !== "undefined") {
      // Backend middleware checks for 'XSRF-token' cookie first, then 'token'
      // Set both to ensure compatibility
      // Login response structure: result.data contains { success, data: { token, id, role, ... } }
      // Token might be in user.data.token or user.token or user.user.token
      let token = 
        user?.data?.token || 
        user?.data?.accessToken ||
        user?.token || 
        user?.accessToken ||
        user?.user?.token;
      
      const expirationMinutes = 24 * 60; // 24 hours in minutes
      
      if (token) {
        setCookie("XSRF-token", token, expirationMinutes);
        setCookie("token", token, expirationMinutes);
      } else {
        console.error('[Authenticate] No token found. User object:', JSON.stringify(user, null, 2));
        console.error('[Authenticate] Available cookies:', document.cookie);
      }
      
      // Set other user data cookies
      // Check multiple possible locations for user data
      const userData = user?.data || user?.user || user;

      const role = userData?.role || user?.role || userData?.user?.role;
      const id = userData?.id || userData?._id || user?.id || user?._id;
      const vendorId = userData?.vendorId;
      const storeId = userData?.storeId;
      const plan = userData?.plan;
      
      console.log('[Authenticate] User data extraction:', {
        role: role || '❌',
        id: id || '❌',
        vendorId: vendorId || '❌',
        storeId: storeId || '❌',
        plan: plan || '❌',
      });
      
      if (role !== undefined && role !== null) {
        setCookie("role", role.toString(), expirationMinutes);
      }
      if (id) {
        setCookie("id", id.toString(), expirationMinutes);
      }
      if (vendorId) {
        setCookie("vendorId", vendorId.toString(), expirationMinutes);
      }
      if (storeId) {
        setCookie("storeId", storeId.toString(), expirationMinutes);
      }
      if (plan) {
        setCookie("plan", plan.toString(), expirationMinutes);
      }
      
      next();
    }
  };
  const dispatch = useAppDispatch();
  const { handleSubmit, control, reset } = useForm();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const onSubmit = async (data: any) => {
    try {
      const result = await login(data);
    
      
      // Check if login was successful
      // Backend might return success in different ways
      const isSuccess = 
        result?.data?.success || 
        (result?.data?.data && result?.data?.data?.verify) ||
        (result?.data?.user && result?.data?.token);
      
      if (isSuccess) {
        dispatch(updateLoginDetails(result?.data));
        
        // Extract token from response - check all possible locations
        const responseData = result?.data;
        let token = 
          responseData?.data?.token || 
          responseData?.data?.accessToken || 
          responseData?.token || 
          responseData?.accessToken ||
          responseData?.user?.token;
        
        if (!token) {
          return;
        }

        // Authenticate user and set cookies
        authenticate(responseData, () => {
          // Wait a moment for cookies to be set, then verify
          setTimeout(() => {
            const verifyToken = getCookie("XSRF-token") || getCookie("token");
            const verifyId = getCookie("id");
            
            console.log('[Login] Cookie verification:', {
              'XSRF-token': getCookie("XSRF-token") ? '✅' : '❌',
              'token': getCookie("token") ? '✅' : '❌',
              'id': verifyId || '❌',
            });
        
            if (!verifyToken) {
              console.error('[Login] Token not set in cookies after authenticate()');
              console.error('[Login] All cookies:', document.cookie);
              alert("Authentication failed. Please try again.");
              return;
            }
            
            // Reload to ensure App.tsx picks up the new cookies
            console.log('[Login] Cookies set successfully, reloading page...');
            window.location.reload();
          }, 200); // Small delay to ensure cookies are persisted
        });
      } else {
        console.error('[Login] Login failed:', result);
        if (result?.data?.data && !result?.data?.data?.verify) {
          alert(
            "Please connect admin and activate your account Support : 8270564998"
          );
        } else {
          console.log('3452345234', result);
          alert(result?.error?.data?.message || "Invalid Credentials");
        }
      }
    } catch (error) {
      console.error('[Login] Error:', error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="mainLogin h-[100dvh] flex items-center justify-center">
      <div className="bg-warning-50 p-5 rounded-[calc(theme(borderRadius.large)/1.5)] w-[30%]">
        <div className="flex justify-center">
          <IconLoginSVG width="250px" height="155px" />
        </div>
        <h2 className="text-2xl font-bold my-4 flex justify-center">Login</h2>
        <div className=" flex justify-center ">
          <form onSubmit={handleSubmit(onSubmit)} className="w-[100%]">
            <div className="mb-3">
              <Controller
                name="email" // Changed to reflect a text input
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  // <Input type="text" label="email" size="lg" {...field} />
                  <InputNextUI
                    type="text"
                    label="Email"
                    size="md"
                    {...field}
                    // errorMessage={errors.password?.message}
                  />
                )}
              />
            </div>
            <div className="mb-3">
              <Controller
                name="password" // Changed to reflect a text input
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  // <Input type="text" label="password" size="lg" {...field} />
                  <InputNextUI
                    type="password"
                    label="Password"
                    size="md"
                    {...field}
                    // errorMessage={errors.password?.message}
                  />
                )}
              />
            </div>
            <div className="text-center">
              <Button color="primary" type="submit">
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
