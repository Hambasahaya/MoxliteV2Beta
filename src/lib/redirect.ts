export const getSafeRedirect = (
  redirect: string | string[] | undefined,
  fallback = "/dashboard"
) => {
  const value = Array.isArray(redirect) ? redirect[0] : redirect;

  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
};
