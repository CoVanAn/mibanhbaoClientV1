const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function fetchProductBySlug(slug: string) {
  const response = await fetch(
    `${API_URL}/api/product/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || "Product not found");
  }
  return response.json();
}
