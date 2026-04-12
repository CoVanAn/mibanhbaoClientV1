const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_URL = (rawApiUrl || "http://localhost:4000").replace(
  /\/+$/,
  "",
);
export const POWDER_CATEGORY_NAME = "Bột bánh bao trộn sẵn";
