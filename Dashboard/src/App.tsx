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
import { 
  useGetSubUserMenuPermissionsQuery,
  useGetStoreMenuPermissionsQuery,
  useGetSubUserByIdQuery
} from "./views/Settings/Service.mjs";
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
  
  // Check if user is a sub-user from cookie (set during login)
  const isSubUserFromCookie = getCookie("isSubUser") === "true";
  
  // Use appropriate query based on whether user is a sub-user
  const { data: userData, error: userError, refetch: refetchUser } = useGetUserQuery(id, { 
    skip: !id || isSubUserFromCookie 
  });
  
  const { data: subUserData, error: subUserError, refetch: refetchSubUser } = useGetSubUserByIdQuery(id, {
    skip: !id || !isSubUserFromCookie,
    refetchOnMountOrArgChange: true,
  });

  // Use the appropriate data source
  const data = isSubUserFromCookie ? subUserData : userData;
  const error = isSubUserFromCookie ? subUserError : userError;
  const refetch = isSubUserFromCookie ? refetchSubUser : refetchUser;

  // Get user role and IDs
  const currentRole = getCookie("role");
  const storeId = getCookie("storeId");
  const vendorId = getCookie("vendorId");
  const isSubUser = isSubUserFromCookie || data?.data?.isSubUser || false;
  const subUserId = data?.data?.id;

  // Fetch store menu permissions for store users (role 3) or vendors (role 2) who are NOT sub-users
  const shouldFetchStorePermissions = !isSubUser && (currentRole === "2" || currentRole === "3") && !!storeId;
  
  // Fetch menu permissions for stores/vendors
  const { 
    data: storeMenuPermissionsData, 
    isLoading: isLoadingStorePermissions,
    error: storePermissionsError,
    refetch: refetchStoreMenuPermissions 
  } = useGetStoreMenuPermissionsQuery(storeId, {
    skip: !shouldFetchStorePermissions,
    refetchOnMountOrArgChange: true,
  });

  // Fetch menu permissions for sub-users (role 2 or 3) who are marked as sub-users
  const shouldFetchSubUserPermissions = isSubUser && (currentRole === "2" || currentRole === "3") && !!subUserId;
  
  // Fetch menu permissions for sub-users
  const { 
    data: subUserMenuPermissionsData, 
    isLoading: isLoadingSubUserPermissions,
    error: subUserPermissionsError,
    refetch: refetchSubUserMenuPermissions 
  } = useGetSubUserMenuPermissionsQuery(subUserId, {
    skip: !shouldFetchSubUserPermissions,
    refetchOnMountOrArgChange: true,
  });

  // Debug logging
  React.useEffect(() => {
    if (shouldFetchStorePermissions) {
      console.log('[App] Fetching store menu permissions:', {
        storeId,
        currentRole,
        isLoadingStorePermissions,
        hasPermissions: !!storeMenuPermissionsData,
        error: storePermissionsError,
      });
    }
    if (shouldFetchSubUserPermissions) {
      console.log('[App] Fetching sub-user menu permissions:', {
        subUserId,
        isSubUser,
        currentRole,
        isLoadingSubUserPermissions,
        hasPermissions: !!subUserMenuPermissionsData,
        error: subUserPermissionsError,
      });
    }
  }, [
    shouldFetchStorePermissions, storeId, currentRole, isLoadingStorePermissions, 
    storeMenuPermissionsData, storePermissionsError,
    shouldFetchSubUserPermissions, subUserId, isSubUser, isLoadingSubUserPermissions,
    subUserMenuPermissionsData, subUserPermissionsError
  ]);


  // Refetch when id becomes available (only once, not on every refetch change)
  React.useEffect(() => {
    if (id) {
      console.log('[App] ID available, refetching user data');
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id, not refetch to avoid infinite loops

  // Update Redux store when user data is received
  React.useEffect(() => {
    if (data?.data) {
      console.log('[App] User data received, updating Redux store');
      dispatch(updateLoginDetails(data));
    }
  }, [data, dispatch]);

  // Update Redux store when store/vendor menu permissions are received
  React.useEffect(() => {
    if (storeMenuPermissionsData?.data && data?.data && !isSubUser) {
      console.log('[App] Store/Vendor menu permissions received, updating Redux store');
      const updatedData = {
        ...data,
        data: {
          ...data.data,
          menuPermissions: storeMenuPermissionsData.data,
        },
      };
      console.log('[App] Merging store/vendor menu permissions:', storeMenuPermissionsData.data);
      dispatch(updateLoginDetails(updatedData));
    }
  }, [storeMenuPermissionsData, data, isSubUser, dispatch]);

  // Update Redux store when sub-user menu permissions are received
  React.useEffect(() => {
    if (subUserMenuPermissionsData?.data && data?.data && isSubUser) {
      console.log('[App] Sub-user menu permissions received, updating Redux store');
      const updatedData = {
        ...data,
        data: {
          ...data.data,
          menuPermissions: subUserMenuPermissionsData.data,
        },
      };
      console.log('[App] Merging sub-user menu permissions:', subUserMenuPermissionsData.data);
      dispatch(updateLoginDetails(updatedData));
    }
  }, [subUserMenuPermissionsData, data, isSubUser, dispatch]);

  // Refetch store menu permissions when store ID changes
  React.useEffect(() => {
    if (!isSubUser && storeId && (currentRole === "2" || currentRole === "3")) {
      console.log('[App] Store/Vendor detected, fetching menu permissions for store ID:', storeId);
      refetchStoreMenuPermissions();
    }
  }, [isSubUser, storeId, currentRole, refetchStoreMenuPermissions]);

  // Refetch sub-user menu permissions when sub-user ID changes
  React.useEffect(() => {
    if (isSubUser && subUserId) {
      console.log('[App] Sub-user detected, fetching menu permissions for ID:', subUserId);
      refetchSubUserMenuPermissions();
    }
  }, [isSubUser, subUserId, refetchSubUserMenuPermissions]);
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
