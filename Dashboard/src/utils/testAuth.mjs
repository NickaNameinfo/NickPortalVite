/**
 * Authentication Testing Utility
 * Use this in browser console to test authentication
 */

import { getCookie, setCookie } from "../JsFiles/CommonFunction.mjs";
import { getAuthToken, isAuthenticated } from "./authHelper.mjs";
import { infoData } from "../configData";

/**
 * Test authentication status
 */
export const testAuth = () => {
  console.group('🔐 Authentication Test');
  
  // Check cookies
  const xsrfToken = getCookie("XSRF-token");
  const token = getCookie("token");
  const id = getCookie("id");
  
  console.log('Cookies:');
  console.log('  XSRF-token:', xsrfToken ? `✅ ${xsrfToken.substring(0, 20)}...` : '❌ Missing');
  console.log('  token:', token ? `✅ ${token.substring(0, 20)}...` : '❌ Missing');
  console.log('  id:', id || '❌ Missing');
  
  // Check token retrieval
  const authToken = getAuthToken();
  console.log('\nToken Retrieval:');
  console.log('  getAuthToken():', authToken ? `✅ ${authToken.substring(0, 20)}...` : '❌ Missing');
  console.log('  isAuthenticated():', isAuthenticated() ? '✅ True' : '❌ False');
  
  console.groupEnd();
  
  return {
    hasXSRFToken: !!xsrfToken,
    hasToken: !!token,
    hasAuthToken: !!authToken,
    isAuthenticated: isAuthenticated(),
  };
};

/**
 * Test API call with authentication
 */
export const testAPICall = async (endpoint = '/auth/user/1') => {
  console.group('🧪 API Call Test');
  
  const token = getAuthToken();
  
  if (!token) {
    console.error('❌ No token found. Please login first.');
    console.groupEnd();
    return null;
  }
  
  const url = `${infoData.baseApi}${endpoint}`;
  console.log('URL:', url);
  console.log('Token:', token.substring(0, 20) + '...');
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response Data:', data);
    
    if (response.status === 401) {
      console.error('❌ 401 Unauthorized - Token may be invalid or expired');
    } else if (response.status === 200) {
      console.log('✅ API call successful!');
    }
    
    console.groupEnd();
    return { status: response.status, data };
  } catch (error) {
    console.error('❌ API call failed:', error);
    console.groupEnd();
    return null;
  }
};

/**
 * Test login flow
 */
export const testLogin = async (email, password) => {
  console.group('🔑 Login Test');
  
  const url = `${infoData.baseApi}/auth/rootLogin`;
  console.log('URL:', url);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', data);
    
    if (data.success && data.data?.token) {
      console.log('✅ Login successful!');
      console.log('Token location:', {
        'data.data.token': data.data.token ? '✅' : '❌',
        'data.token': data.token ? '✅' : '❌',
      });
      console.log('Token:', data.data.token?.substring(0, 20) + '...');
    } else {
      console.error('❌ Login failed or token not in response');
    }
    
    console.groupEnd();
    return data;
  } catch (error) {
    console.error('❌ Login request failed:', error);
    console.groupEnd();
    return null;
  }
};

/**
 * Check all cookies including auth cookie
 */
export const checkCookies = () => {
  console.group('🍪 Cookie Check');
  
  // Direct cookies
  const xsrfToken = getCookie("XSRF-token");
  const token = getCookie("token");
  const id = getCookie("id");
  const role = getCookie("role");
  const authCookie = getCookie("auth");
  
  console.log('Direct Cookies:');
  console.log('  XSRF-token:', xsrfToken ? `✅ ${xsrfToken.substring(0, 30)}...` : '❌ Missing');
  console.log('  token:', token ? `✅ ${token.substring(0, 30)}...` : '❌ Missing');
  console.log('  id:', id || '❌ Missing');
  console.log('  role:', role || '❌ Missing');
  
  // Auth cookie
  if (authCookie) {
    try {
      const authData = JSON.parse(decodeURIComponent(authCookie));
      const authToken = authData?.token || authData?.data?.token;
      const authId = authData?.user?._id || authData?.user?.id || authData?.id || authData?.data?.id;
      
      console.log('\nAuth Cookie:');
      console.log('  Exists: ✅');
      console.log('  Token:', authToken ? `✅ ${authToken.substring(0, 30)}...` : '❌ Missing');
      console.log('  ID:', authId || '❌ Missing');
      console.log('  Full data:', authData);
    } catch (e) {
      console.error('  Failed to parse:', e);
      console.log('  Raw (first 200 chars):', authCookie.substring(0, 200));
    }
  } else {
    console.log('\nAuth Cookie: ❌ Missing');
  }
  
  console.log('\nAll Cookies (first 500 chars):');
  console.log(document.cookie.substring(0, 500));
  console.groupEnd();
  
  return {
    xsrfToken,
    token,
    id,
    role,
    authCookie: !!authCookie,
  };
};

/**
 * Test setting a cookie manually
 */
export const testSetCookie = (name = 'test-cookie', value = 'test-value') => {
  console.group('🍪 Test Set Cookie');
  
  console.log(`Setting cookie: ${name} = ${value}`);
  const success = setCookie(name, value, 60); // 1 hour
  
  // Wait and check
  setTimeout(() => {
    const readValue = getCookie(name);
    console.log('Result:', {
      'setCookie returned': success ? '✅' : '❌',
      'cookie read back': readValue ? '✅' : '❌',
      'value matches': readValue === value ? '✅' : '❌',
      'read value': readValue || 'null',
    });
    
    if (!readValue) {
      console.error('❌ Cookie was NOT set! Check browser settings or console for errors.');
      console.log('All cookies:', document.cookie);
      console.log('Browser info:', {
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        origin: window.location.origin,
      });
    }
    
    console.groupEnd();
  }, 200);
  
  return success;
};

// Make functions available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.testAuth = testAuth;
  window.testAPICall = testAPICall;
  window.testLogin = testLogin;
  window.checkCookies = checkCookies;
  window.testSetCookie = testSetCookie;
  console.log('🧪 Test utilities available: testAuth(), testAPICall(), testLogin(), checkCookies(), testSetCookie()');
}
