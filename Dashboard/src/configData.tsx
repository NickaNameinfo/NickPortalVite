export const infoData = {
  // API Configuration - use environment variable or fallback
  baseApi: import.meta.env.VITE_BASE_API || "https://nicknameinfo.net/api",
  regex: /[<>:"\/\|?*]/,
  // Razorpay configuration - use environment variable or fallback
  razorpayKey: import.meta.env.VITE_RAZORPAY_KEY || process.env.REACT_APP_RAZORPAY_KEY || "rzp_live_RgPc8rKEOZbHgf",
  // Environment
  env: import.meta.env.VITE_ENV || import.meta.env.MODE || "production",
};
 