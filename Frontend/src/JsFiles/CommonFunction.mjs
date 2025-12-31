/**
 * Set cookie with security flags
 * Note: HttpOnly flag cannot be set from JavaScript (requires backend)
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} minute - Expiration time in minutes
 * @param {boolean} isSecure - Use Secure flag (HTTPS only)
 * @param {string} sameSite - SameSite attribute ('Strict', 'Lax', or 'None')
 */
export function setCookie(name, value, minute, isSecure = true, sameSite = 'Strict') {
  var expires = "";
  if (minute) {
    var date = new Date();
    expires =
      "; expires=" +
      new Date(date.setMinutes(date.getMinutes() + minute)).toUTCString();
  }
  
  // Build cookie string with security flags
  // Note: HttpOnly must be set by backend - cannot be set from JavaScript
  var cookieString = name + "=" + (value || "") + expires + "; path=/";
  
  // Add Secure flag if HTTPS (or if explicitly requested)
  if (isSecure && (window.location.protocol === 'https:' || isSecure === true)) {
    cookieString += "; Secure";
  }
  
  // Add SameSite attribute
  if (sameSite) {
    cookieString += "; SameSite=" + sameSite;
  }
  
  document.cookie = cookieString;
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function eraseCookie(name) {
  // Erase cookie with security flags
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure; SameSite=Strict";
}
