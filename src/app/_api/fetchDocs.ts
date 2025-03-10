const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/products"; 

export const fetchProducts = async (options = {}) => {
  try {
    const query = new URLSearchParams(options).toString();
    const res = await fetch(`${API_BASE_URL}?${query}`);
    
    if (!res.ok) throw new Error("Failed to fetch products");
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0, totalPages: 0 };
  }
};

