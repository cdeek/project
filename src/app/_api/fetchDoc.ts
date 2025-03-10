
export const fetchProductBySlug = async (slug) => {
  try {
    const res = await fetch(`${API_BASE_URL}/${slug}`);

    if (!res.ok) throw new Error("Product not found");

    return await res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
