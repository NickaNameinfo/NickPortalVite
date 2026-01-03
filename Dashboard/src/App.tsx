import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import React, { Suspense } from "react";
import Login from "./views/pages/login/Login.js";
import DefaultLayout from "./layout/DefaultLayout.js";
import Page404 from "./views/pages/page404/Page404.js";
import Page500 from "./views/pages/page500/Page500.js";
import { getCookie } from "./JsFiles/CommonFunction.mjs";
import { useAppDispatch } from "./Common/hooks.js";
import { updateLoginDetails } from "./Common/globalSlice.js";
import { useGetUserQuery } from "./Service.mjs";
import { debugAuth } from "./utils/authDebug.mjs";
import { useDisableRightClick } from "./utils/rightClickHandler";
import "react-toastify/dist/ReactToastify.css";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

function App() {
  // Disable developer tools and right-click globally for security
  // Can be disabled via environment variable: VITE_DISABLE_RIGHT_CLICK=false
  const disableDevTools = import.meta.env.VITE_DISABLE_RIGHT_CLICK !== 'false';
  useDisableRightClick(disableDevTools, false);
  const dispatch = useAppDispatch();
  
  // Use state to track id and token so they update when cookies change (especially after refresh)
  const [id, setId] = React.useState(() => {
    return getCookie("id");
  });
  
  const [token, setToken] = React.useState(() => {
    return getCookie("token") || getCookie("XSRF-token");
  });
  
  // Watch for cookie changes on mount and after refresh
  React.useEffect(() => {
    const checkCookies = () => {
      const currentId = getCookie("id");
      const currentToken = getCookie("token") || getCookie("XSRF-token");
      
      if (currentId !== id) {
        console.log('[App] ID cookie changed:', { old: id, new: currentId });
        setId(currentId);
      }
      
      if (currentToken !== token) {
        console.log('[App] Token cookie changed:', { old: token ? '✅' : '❌', new: currentToken ? '✅' : '❌' });
        setToken(currentToken);
      }
    };
    
    // Check immediately
    checkCookies();
    
    // Check periodically (especially important after page refresh)
    const interval = setInterval(checkCookies, 500);
    
    return () => clearInterval(interval);
  }, [id, token]);
  
  const { data, error, refetch } = useGetUserQuery(id, { skip: !id });

  console.log('[App] State:', {
    id: id || '❌',
    token: token ? '✅' : '❌',
    hasData: !!data,
    cookies: {
      id: getCookie("id") || '❌',
      token: getCookie("token") || '❌',
      xsrf: getCookie("XSRF-token") || '❌',
    }
  });

  // Refetch when id becomes available
  React.useEffect(() => {
    if (id) {
      console.log('[App] ID available, refetching user data');
      refetch();
    }
  }, [id, refetch]);

  // Update Redux store when data is received
  React.useEffect(() => {
    if (data?.data) {
      console.log('[App] User data received, updating Redux store');
      dispatch(updateLoginDetails(data));
    }
  }, [data, dispatch]);
  // // Watch for cookie changes (especially after login)
  // React.useEffect(() => {
  //   const checkToken = () => {
  //     const currentToken = getCookie("token") || getCookie("XSRF-token");
  //     if (currentToken !== token) {
  //       console.log('[App] Token cookie changed, updating state');
  //       setToken(currentToken);
  //     }
  //   };

  //   // Check immediately
  //   checkToken();

  //   // Check periodically
  //   const interval = setInterval(checkToken, 500);

  //   // Listen for custom event from login
  //   const handleCookieUpdate = () => {
  //     console.log('[App] Cookies updated event received');
  //     checkToken();
  //   };
  //   window.addEventListener('cookiesUpdated', handleCookieUpdate);

  //   return () => {
  //     clearInterval(interval);
  //     window.removeEventListener('cookiesUpdated', handleCookieUpdate);
  //   };
  // }, [token]);

  // console.log('[App] Current token state:', token ? '✅ Present' : '❌ Missing');
  
  return (
    <Suspense fallback={loading}>
      <Router>
        <Routes>
          {!token ? (
            <>
              <Route path="/" element={<Login />} />
              <Route path="/404" element={<Page404 />} />
              <Route path="/500" element={<Page500 />} />
              <Route path="*" element={<Login />} />
            </>
          ) : (
            <>
              <Route path="/" element={<DefaultLayout />} />
              <Route path="/404" element={<Page404 />} />
              <Route path="/500" element={<Page500 />} />
              <Route path="*" element={<DefaultLayout />} />
            </>
          )}
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
