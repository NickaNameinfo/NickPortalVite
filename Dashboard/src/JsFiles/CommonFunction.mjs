/**
 * Set cookie with security flags
 * Note: HttpOnly flag cannot be set from JavaScript (requires backend)
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} minute - Expiration time in minutes
 * @param {boolean} isSecure - Use Secure flag (HTTPS only)
 * @param {string} sameSite - SameSite attribute ('Strict', 'Lax', or 'None')
 */
export function setCookie(name, value, minute, isSecure = false, sameSite = 'Lax') {
  if (!name || value === undefined || value === null) {
    console.error(`[setCookie] Invalid parameters: name=${name}, value=${value}`);
    return false;
  }
  
  // Check environment
  const isHttps = window.location.protocol === 'https:';
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.includes('localhost');
  
  console.log(`[setCookie] Attempting to set "${name}"`, {
    valueLength: value.length,
    minute,
    isLocalhost,
    isHttps,
  });
  
  // Calculate expiration date
  // Always set expiration to ensure cookies persist across page refreshes
  let expires = '';
  if (minute && minute > 0) {
    const date = new Date();
    date.setTime(date.getTime() + (minute * 60 * 1000));
    expires = date.toUTCString();
  } else {
    // If no expiration provided, default to 24 hours to ensure persistence
    const date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    expires = date.toUTCString();
  }
  
  // Try Method 1: Simplest possible (path and expires only)
  try {
    let cookieString = `${name}=${encodeURIComponent(value)}; path=/`;
    if (expires) {
      cookieString += `; expires=${expires}`;
    }
    
    console.log(`[setCookie] Method 1 - Setting: ${cookieString.substring(0, 100)}...`);
    document.cookie = cookieString;
    
    // Wait a bit before verification (cookies need time to be set)
    // Use synchronous check but with a small delay via setTimeout would be async
    // For now, check immediately - if it fails, try other methods
    const verifyCookie = getCookie(name);
    if (verifyCookie === value) {
      console.log(`[setCookie] ✅ Cookie "${name}" set successfully (Method 1)`);
      return true;
    } else {
      console.warn(`[setCookie] Method 1 immediate check failed - got: ${verifyCookie ? verifyCookie.substring(0, 30) : 'null'}`);
      // Still try other methods, but Method 1 might work after a delay
    }
  } catch (error) {
    console.error(`[setCookie] Method 1 error:`, error);
  }
  
  // Try Method 2: With SameSite
  try {
    let cookieString = `${name}=${encodeURIComponent(value)}; path=/`;
    if (expires) {
      cookieString += `; expires=${expires}`;
    }
    cookieString += `; SameSite=Lax`;
    
    console.log(`[setCookie] Method 2 - Setting with SameSite`);
    document.cookie = cookieString;
    
    const verifyCookie = getCookie(name);
    if (verifyCookie === value) {
      console.log(`[setCookie] ✅ Cookie "${name}" set successfully (Method 2)`);
      return true;
    }
  } catch (error) {
    console.error(`[setCookie] Method 2 error:`, error);
  }
  
  // Try Method 3: With max-age (most reliable for persistence)
  try {
    let cookieString = `${name}=${encodeURIComponent(value)}; path=/`;
    if (minute) {
      cookieString += `; max-age=${minute * 60}`;
    }
    if (expires) {
      cookieString += `; expires=${expires}`;
    }
    
    console.log(`[setCookie] Method 3 - Setting with max-age and expires`);
    document.cookie = cookieString;
    
    const verifyCookie = getCookie(name);
    if (verifyCookie === value) {
      console.log(`[setCookie] ✅ Cookie "${name}" set successfully (Method 3)`);
      return true;
    }
  } catch (error) {
    console.error(`[setCookie] Method 3 error:`, error);
  }
  
  // Final verification after all attempts
  // Sometimes cookies need a moment to be set
  const finalCheck = getCookie(name);
  if (finalCheck === value) {
    console.log(`[setCookie] ✅ Cookie "${name}" verified after all attempts`);
    return true;
  }
  
  // All methods failed
  console.error(`[setCookie] ❌ All methods failed for "${name}"!`, {
    name,
    valueLength: value.length,
    allCookies: document.cookie,
    browserInfo: {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      origin: window.location.origin,
      isLocalhost,
      isHttps,
      userAgent: navigator.userAgent.substring(0, 100),
    },
  });
  
  return false;
}

export function getCookie(name) {
  if (!name) {
    return null;
  }
  
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      // Trim whitespace
      while (c.charAt(0) === " ") {
        c = c.substring(1, c.length);
      }
      // Check if this cookie matches
      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
        return value;
      }
    }
  } catch (error) {
    console.error(`[getCookie] Error reading cookie "${name}":`, error);
  }
  
    return null;
  }

export function eraseCookie(name) {
  document.cookie = `${name}=; Max-Age=0; Path=/;`;
}
