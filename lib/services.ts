export async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // optional caching for 1 hour
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null; // return null for safe fallback
  }
}
