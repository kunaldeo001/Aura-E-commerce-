export let products = [];

export async function loadProducts(category = 'All', searchQuery = '', sort = '', minPrice = 0, maxPrice = 50000) {
    try {
        const params = new URLSearchParams();
        if (category !== 'All') params.append('category', category);
        if (searchQuery) params.append('search', searchQuery);
        if (sort) params.append('sort', sort);
        if (minPrice > 0) params.append('minPrice', minPrice);
        if (maxPrice < 50000) params.append('maxPrice', maxPrice);

        const url = `http://localhost:3000/api/products?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        products = await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        products = [];
    }
}
