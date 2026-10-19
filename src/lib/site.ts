/** Canonical site origin, used by metadata and the machine-readable surfaces. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://flinchui.dev').replace(
  /\/$/,
  '',
);
