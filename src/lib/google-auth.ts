/**
 * Google OAuth is only enabled when this env var is set.
 * When unset, the app runs without Google Sign-In and no client_id error is thrown.
 */
export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_SJ_GOOGLE_CLIENT_ID?.trim() ?? "";

export const isGoogleAuthEnabled = !!GOOGLE_CLIENT_ID;
