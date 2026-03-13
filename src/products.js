export let products = [];
export let allProducts = [];

async function fetchProducts(params = new URLSearchParams()) {
    const queryString = params.toString();
    const url = queryString
        ? `http://localhost:3000/api/products?${queryString}`
        : 'http://localhost:3000/api/products';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export async function loadProducts(category = 'All', searchQuery = '', sort = '', minPrice = 0, maxPrice = 50000) {
    try {
        const params = new URLSearchParams();
        if (category !== 'All') params.append('category', category);
        if (searchQuery) params.append('search', searchQuery);
        if (sort) params.append('sort', sort);
        if (minPrice > 0) params.append('minPrice', minPrice);
        if (maxPrice < 50000) params.append('maxPrice', maxPrice);

        const [filteredProducts, fullCatalog] = await Promise.all([
            fetchProducts(params),
            allProducts.length === 0 ? fetchProducts() : Promise.resolve(allProducts)
        ]);

        products = filteredProducts;
        allProducts = fullCatalog;
        window.allProductsCache = allProducts;
    } catch (error) {
        console.error('Error fetching products:', error);
        products = [];
        if (allProducts.length === 0) {
            window.allProductsCache = [];
        }
    }
}

export function findProductById(productId) {
    return products.find((product) => product.id === productId)
        || allProducts.find((product) => product.id === productId);
}
