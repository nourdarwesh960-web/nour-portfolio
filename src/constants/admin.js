// Hardcoded admin credentials — no Firebase Auth.
// WARNING: visible in the client JS bundle. Anyone viewing source can read these.
export const ADMIN_EMAIL = 'hasibulhasan169@gmail.com';
export const ADMIN_PASSWORD = 'hasib123';

// Token format: base64("email:password"). Sent as Authorization: Bearer <token>.
// Server compares against the same derived value.
export const ADMIN_TOKEN = btoa(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}`);

export const ADMIN_TOKEN_KEY = 'pf_admin_token';
