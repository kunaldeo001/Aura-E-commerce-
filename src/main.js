import './style.css'
import { products, loadProducts } from './products.js'
import { initCart, addToCart } from './cart.js'

// Initial state and app logic
const app = document.querySelector('#app')

app.innerHTML = `
  <!-- Navigation -->
  <nav class="navbar" id="navbar">
    <div class="container">
      <a href="#" class="logo text-gradient">Aura.</a>
      <div class="nav-links">
        <a href="#new">New Arrivals</a>
        <a href="#featured">Featured</a>
        <a href="#collections">Collections</a>
      </div>
      <div class="nav-actions">
        <div class="search-container" id="search-container">
          <input type="text" id="search-input" class="search-input" placeholder="Search...">
          <button class="icon-btn" id="search-btn" aria-label="Search">
            <ion-icon name="search-outline"></ion-icon>
          </button>
        </div>
        <button class="icon-btn" id="theme-toggle" aria-label="Toggle Theme">
          <ion-icon name="moon-outline"></ion-icon>
        </button>
        <button class="icon-btn" id="wishlist-btn" aria-label="Wishlist">
          <ion-icon name="heart-outline" id="wishlist-icon"></ion-icon>
          <span class="cart-badge" id="wishlist-counter" style="background: #ef4444;">0</span>
        </button>
        <button class="icon-btn" id="auth-btn" aria-label="Account">
          <ion-icon name="person-outline" id="auth-icon"></ion-icon>
        </button>
        <button class="icon-btn" id="cart-btn" aria-label="Cart">
          <ion-icon name="cart-outline"></ion-icon>
          <span class="cart-badge" id="cart-counter">0</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="hero">
    <div class="hero-bg"></div>
    <div class="container">
      <div class="hero-content">
        <div class="hero-badge animate-fade-in-up">
          <ion-icon name="sparkles" style="margin-right: 8px; color: var(--accent-color)"></ion-icon>
          The Fall Collection 2026
        </div>
        <h1 class="hero-title animate-fade-in-up delay-100">Elevate Your <span class="text-gradient">Everyday Style.</span></h1>
        <p class="hero-desc animate-fade-in-up delay-200">
          Discover a curated selection of premium electronics, fashion, and accessories designed for the modern individual seeking aesthetics and performance.
        </p>
        <div class="animate-fade-in-up delay-300">
          <a href="#store" class="btn btn-primary">Shop Collection <ion-icon name="arrow-forward-outline" style="margin-left: 8px"></ion-icon></a>
        </div>
      </div>
    </div>
  </header>

  <section id="store" class="products-section container">
    <div class="section-header" style="flex-direction: column; align-items: flex-start; gap: 1.5rem;">
      <div>
        <h2 class="section-title">Trending Now</h2>
        <p style="color: var(--text-secondary); margin-top: 0.5rem">Our most sought-after pieces.</p>
      </div>
      <div class="category-filters" id="category-filters">
        <button class="filter-btn active" data-category="All">All</button>
        <button class="filter-btn" data-category="Audio">Audio</button>
        <button class="filter-btn" data-category="Accessories">Accessories</button>
        <button class="filter-btn" data-category="Wearables">Wearables</button>
        <button class="filter-btn" data-category="Bags">Bags</button>
        <button class="filter-btn" data-category="Electronics">Electronics</button>
        <button class="filter-btn" data-category="Home">Home</button>
      </div>
        <select class="sort-select" id="sort-select">
          <option value="">Sort: Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>
        <div class="price-filter">
          <span style="color:var(--text-secondary);font-size:0.85rem;">Price: ₹<span id="price-min-label">0</span> – ₹<span id="price-max-label">50,000</span></span>
          <input type="range" id="price-min" min="0" max="50000" value="0" step="500" class="price-range">
          <input type="range" id="price-max" min="0" max="50000" value="50000" step="500" class="price-range">
        </div>
        <button class="btn" onclick="window.clearFilters()" style="padding: 0.5rem 1rem; font-size: 0.85rem; border: 1px solid var(--border-color); border-radius: var(--radius-full); color: var(--text-secondary);">Clear All</button>
      </div>
    </div>
    <div class="product-grid" id="product-grid">
      <!-- Products will be injected here -->
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <a href="#" class="logo text-gradient" style="font-size:1.75rem;">Aura.</a>
        <p class="footer-tagline">Elevating your everyday style with curated premium goods.</p>
        <div class="footer-socials">
          <a href="#" class="social-link"><ion-icon name="logo-instagram"></ion-icon></a>
          <a href="#" class="social-link"><ion-icon name="logo-twitter"></ion-icon></a>
          <a href="#" class="social-link"><ion-icon name="logo-tiktok"></ion-icon></a>
        </div>
      </div>
      <div class="footer-links-group">
        <h4>Shop</h4>
        <a href="#">New Arrivals</a>
        <a href="#">Collections</a>
        <a href="#">Featured</a>
        <a href="#">Sale</a>
      </div>
      <div class="footer-links-group">
        <h4>Support</h4>
        <a href="#">FAQ</a>
        <a href="#">Shipping</a>
        <a href="#">Returns</a>
        <a href="#">Contact Us</a>
      </div>
      <div class="footer-newsletter">
        <h4>Stay in the loop</h4>
        <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:1rem;">Get early access to new drops and exclusive offers.</p>
        <form id="newsletter-form" style="display:flex;gap:0.5rem;">
          <input type="email" id="newsletter-email" placeholder="your@email.com" style="flex:1;padding:0.7rem 1rem;border-radius:var(--radius-full);border:1px solid var(--border-color);background:var(--surface-color);color:white;font-family:inherit;font-size:0.9rem;outline:none;">
          <button type="submit" class="btn btn-primary" style="border-radius:var(--radius-full);padding:0.7rem 1.2rem;"><ion-icon name="arrow-forward-outline"></ion-icon></button>
        </form>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Aura. All rights reserved.</p>
    </div>
  </footer>

  <!-- Toast Container -->
  <div id="toast-container"></div>

  <!-- Wishlist Sidebar -->
  <div class="cart-overlay" id="wishlist-overlay"></div>
  <div class="cart-sidebar" id="wishlist-sidebar">
    <div class="cart-header">
      <h3>Your Wishlist</h3>
      <button class="icon-btn" id="close-wishlist"><ion-icon name="close-outline"></ion-icon></button>
    </div>
    <div class="cart-items" id="wishlist-items">
      <div class="empty-cart">Your wishlist is empty</div>
    </div>
  </div>

  <!-- Product Modal -->
  <div class="modal-overlay" id="product-modal">
    <div class="modal-content">
      <button class="icon-btn close-modal" id="close-modal"><ion-icon name="close-outline"></ion-icon></button>
      <div class="modal-body" id="modal-body"></div>
    </div>
  </div>

  <!-- Checkout Modal -->
  <div class="modal-overlay" id="checkout-modal">
    <div class="modal-content" style="max-width: 500px; padding: 2rem;">
      <button class="icon-btn close-modal" id="close-checkout-modal" style="top: 0.5rem; right: 0.5rem;"><ion-icon name="close-outline"></ion-icon></button>
      <h2 style="margin-bottom: 1.5rem">Complete Your Order</h2>
      <form id="checkout-form">
        <div style="margin-bottom: 1rem;">
          <label style="display:block; margin-bottom:0.5rem; color:var(--text-secondary)">Shipping Address</label>
          <textarea id="checkout-address" required placeholder="123 Aura Street, Tech City..." style="width:100%; padding:0.8rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--surface-color); color:var(--text-primary); font-family:inherit; resize:vertical; min-height:80px;"></textarea>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <label style="display:block; margin-bottom:0.5rem; color:var(--text-secondary)">Payment Method</label>
          <select id="checkout-payment" required style="width:100%; padding:0.8rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--surface-color); color:var(--text-primary); font-family:inherit; appearance:none;">
            <option value="" disabled selected>Select a payment method...</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Apple Pay">Apple Pay</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; padding-top:1rem; border-top:1px solid var(--border-color);">
          <span style="color:var(--text-secondary)">Total Amount:</span>
          <span id="checkout-total-display" style="font-size:1.25rem; font-weight:700;">₹0</span>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Place Order</button>
      </form>
    </div>
  </div>

  <!-- Auth Modal -->
  <div class="modal-overlay" id="auth-modal">
    <div class="modal-content" style="max-width: 400px; padding: 2rem;">
      <button class="icon-btn close-modal" id="close-auth-modal" style="top: 0.5rem; right: 0.5rem;"><ion-icon name="close-outline"></ion-icon></button>
      <div id="auth-form-container">
        <!-- Auth form will be injected here -->
      </div>
    </div>
  </div>

  <!-- Orders Modal -->
  <div class="modal-overlay" id="orders-modal">
    <div class="modal-content" style="max-width: 600px; padding: 2rem;">
      <button class="icon-btn close-modal" id="close-orders-modal" style="top: 0.5rem; right: 0.5rem;"><ion-icon name="close-outline"></ion-icon></button>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2>Order History</h2>
        <button class="btn" onclick="window.logout()" style="border: 1px solid var(--border-color); color: var(--text-secondary); padding: 0.5rem 1rem;">Logout</button>
      </div>
      <div id="orders-list" style="max-height: 400px; overflow-y: auto;">
        <!-- Orders will be injected here -->
      </div>
    </div>
  </div>
`

let currentCategory = 'All';
let currentSearch = '';
let currentSort = '';
let currentMinPrice = 0;
let currentMaxPrice = 50000;
let currentUser = null;
let wishlist = JSON.parse(localStorage.getItem('aura_wishlist') || '[]');

async function initApp() {
  checkAuth();
  await loadProducts();
  initCart();
  renderProducts();

  // Scroll effect for navbar
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Search functionality
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  searchBtn.addEventListener('click', () => {
    document.getElementById('search-container').classList.toggle('active');
    if (document.getElementById('search-container').classList.contains('active')) {
      searchInput.focus();
    }
  });

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    handleFiltersChanged();
  });

  // Category filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.getAttribute('data-category');
      handleFiltersChanged();
    });
  });

  // Sort dropdown
  document.getElementById('sort-select').addEventListener('change', (e) => {
    currentSort = e.target.value;
    handleFiltersChanged();
  });

  // Price range sliders
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  function updatePriceFilter() {
    currentMinPrice = parseInt(priceMin.value);
    currentMaxPrice = parseInt(priceMax.value);
    if (currentMinPrice > currentMaxPrice) { const t = currentMinPrice; currentMinPrice = currentMaxPrice; currentMaxPrice = t; }
    document.getElementById('price-min-label').textContent = currentMinPrice.toLocaleString('en-IN');
    document.getElementById('price-max-label').textContent = currentMaxPrice.toLocaleString('en-IN');
    handleFiltersChanged();
  }
  priceMin.addEventListener('change', updatePriceFilter);
  priceMax.addEventListener('change', updatePriceFilter);

  // Modal logic
  document.getElementById('close-modal').addEventListener('click', closeProductModal);
  document.getElementById('product-modal').addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') closeProductModal();
  });

  // Auth logic
  document.getElementById('auth-btn').addEventListener('click', () => {
    if (currentUser) {
      openOrdersModal();
    } else {
      openAuthModal('login');
    }
  });

  document.getElementById('close-auth-modal').addEventListener('click', () => {
    document.getElementById('auth-modal').classList.remove('open');
  });
  document.getElementById('auth-modal').addEventListener('click', (e) => {
    if (e.target.id === 'auth-modal') {
      document.getElementById('auth-modal').classList.remove('open');
    }
  });

  document.getElementById('close-orders-modal').addEventListener('click', () => {
    document.getElementById('orders-modal').classList.remove('open');
  });
  document.getElementById('orders-modal').addEventListener('click', (e) => {
    if (e.target.id === 'orders-modal') {
      document.getElementById('orders-modal').classList.remove('open');
    }
  });

  // Wishlist logic
  document.getElementById('wishlist-btn').addEventListener('click', toggleWishlist);
  document.getElementById('close-wishlist').addEventListener('click', toggleWishlist);
  document.getElementById('wishlist-overlay').addEventListener('click', toggleWishlist);
  updateWishlistBadge();

  // Theme Toggle logic
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('aura-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('aura-theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('ion-icon');
    icon.setAttribute('name', theme === 'dark' ? 'moon-outline' : 'sunny-outline');
  }

  // Scroll Reveal Initialization
  initScrollReveal();

  // Newsletter form
  document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    try {
      const res = await fetch('http://localhost:3000/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.showToast(data.message, 'success');
      e.target.reset();
    } catch (err) {
      window.showToast(err.message, 'error');
    }
  });

  // Expose global for inline HTML onClick handlers
  window.addToCart = addToCart;
  window.openProductModal = openProductModal;
  window.switchAuthMode = openAuthModal;
  window.handleAuthSubmit = handleAuthSubmit;
  window.logout = logout;
  window.toggleWishlistProduct = toggleWishlistProduct;
  window.submitReview = submitReview;
}

function checkAuth() {
  const token = localStorage.getItem('aura_token');
  const user = localStorage.getItem('aura_user');
  if (token && user) {
    currentUser = JSON.parse(user);
    document.getElementById('auth-icon').setAttribute('name', 'person');
  } else {
    currentUser = null;
    document.getElementById('auth-icon').setAttribute('name', 'person-outline');
  }
}

function logout() {
  localStorage.removeItem('aura_token');
  localStorage.removeItem('aura_user');
  checkAuth();
  document.getElementById('orders-modal').classList.remove('open');
  window.showToast('Logged out successfully', 'info');
}

async function openOrdersModal() {
  const token = localStorage.getItem('aura_token');
  if (!token) return;

  const ordersList = document.getElementById('orders-list');
  ordersList.innerHTML = '<p style="text-align:center; color:var(--text-secondary)">Loading orders...</p>';
  document.getElementById('orders-modal').classList.add('open');

  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch orders');

    const orders = await response.json();
    if (orders.length === 0) {
      ordersList.innerHTML = '<p style="text-align:center; color:var(--text-secondary)">No past orders found.</p>';
      return;
    }

    ordersList.innerHTML = orders.map(order => `
      <div style="background:var(--surface-color); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; margin-bottom:1rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.9rem; color:var(--text-secondary);">
          <span>Order #${order.id}</span>
          <span>${new Date(order.created_at).toLocaleDateString()}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:600;">$${order.total.toFixed(2)}</span>
          <span style="background:var(--brand-gradient); color:white; padding:2px 8px; border-radius:12px; font-size:0.75rem;">${order.status}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    ordersList.innerHTML = '<p style="text-align:center; color:#ef4444">Error loading orders.</p>';
  }
}

function openAuthModal(mode = 'login') {
  const container = document.getElementById('auth-form-container');
  if (mode === 'login') {
    container.innerHTML = `
      <h2 style="margin-bottom: 1.5rem">Welcome Back</h2>
      <form onsubmit="event.preventDefault(); window.handleAuthSubmit('login')">
        <div style="margin-bottom: 1rem;">
          <label style="display:block; margin-bottom:0.5rem; color:var(--text-secondary)">Email</label>
          <input type="email" id="auth-email" required style="width:100%; padding:0.8rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--surface-color); color:white;">
        </div>
        <div style="margin-bottom: 1.5rem;">
          <label style="display:block; margin-bottom:0.5rem; color:var(--text-secondary)">Password</label>
          <input type="password" id="auth-password" required style="width:100%; padding:0.8rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--surface-color); color:white;">
        </div>
        <button type="submit" class="btn btn-primary btn-full">Log In</button>
      </form>
      <p style="text-align:center; margin-top:1.5rem; color:var(--text-secondary)">
        Don't have an account? <a href="#" onclick="event.preventDefault(); window.switchAuthMode('register')" style="color:var(--accent-color)">Sign Up</a>
      </p>
    `;
  } else {
    container.innerHTML = `
      <h2 style="margin-bottom: 1.5rem">Create Account</h2>
      <form onsubmit="event.preventDefault(); window.handleAuthSubmit('register')">
        <div style="margin-bottom: 1rem;">
          <label style="display:block; margin-bottom:0.5rem; color:var(--text-secondary)">Name</label>
          <input type="text" id="auth-name" required style="width:100%; padding:0.8rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--surface-color); color:white;">
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display:block; margin-bottom:0.5rem; color:var(--text-secondary)">Email</label>
          <input type="email" id="auth-email" required style="width:100%; padding:0.8rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--surface-color); color:white;">
        </div>
        <div style="margin-bottom: 1.5rem;">
          <label style="display:block; margin-bottom:0.5rem; color:var(--text-secondary)">Password</label>
          <input type="password" id="auth-password" required style="width:100%; padding:0.8rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--surface-color); color:white;">
        </div>
        <button type="submit" class="btn btn-primary btn-full">Sign Up</button>
      </form>
      <p style="text-align:center; margin-top:1.5rem; color:var(--text-secondary)">
        Already have an account? <a href="#" onclick="event.preventDefault(); window.switchAuthMode('login')" style="color:var(--accent-color)">Log In</a>
      </p>
    `;
  }
  document.getElementById('auth-modal').classList.add('open');
}

async function handleAuthSubmit(mode) {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const body = { email, password };

  if (mode === 'register') {
    body.name = document.getElementById('auth-name').value;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    if (mode === 'login') {
      localStorage.setItem('aura_token', data.token);
      localStorage.setItem('aura_user', JSON.stringify(data.user));
      checkAuth();
      document.getElementById('auth-modal').classList.remove('open');
      window.showToast(`Welcome back, ${data.user.name}! 👋`, 'success');
    } else {
      window.showToast('Account created! Please log in.', 'success');
      openAuthModal('login');
    }
  } catch (error) {
    window.showToast(`Authentication failed: ${error.message}`, 'error');
  }
}

async function handleFiltersChanged() {
  await loadProducts(currentCategory, currentSearch, currentSort, currentMinPrice, currentMaxPrice);
  renderProducts();
}

async function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const inWishlist = wishlist.some(p => p.id === productId);
  const heartIcon = inWishlist ? 'heart' : 'heart-outline';
  const heartColor = inWishlist ? '#ef4444' : 'var(--text-secondary)';

  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <div class="modal-image-wrap">
      <img src="${product.image}" alt="${product.name}" class="modal-image">
    </div>
    <div class="modal-details" style="overflow-y:auto; max-height:80vh;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div class="modal-badge">${product.category}</div>
        <button onclick="window.toggleWishlistProduct(${product.id})" style="background:none;border:none;cursor:pointer;font-size:1.5rem;color:${heartColor};" id="modal-heart">
          <ion-icon name="${heartIcon}"></ion-icon>
        </button>
      </div>
      <h2 class="modal-title">${product.name}</h2>
      <p class="modal-price">$${product.price.toFixed(2)}</p>
      <p class="modal-desc">${product.description || 'Experience premium quality and exquisite design. Carefully crafted to elevate your everyday style and performance.'}</p>
      <button class="btn btn-primary btn-full" onclick="window.addToCart(${product.id}); closeModal();">
        <ion-icon name="cart-outline" style="margin-right:8px;"></ion-icon> Add to Cart — $${product.price.toFixed(2)}
      </button>
      <div class="reviews-section" id="reviews-section">
        <p style="color:var(--text-secondary); text-align:center;">Loading reviews…</p>
      </div>
      
      <!-- Related Products -->
      <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-color);">
        <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">You May Also Like</h3>
        <div id="related-products" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <!-- Related products will be injected here -->
        </div>
      </div>
    </div>
  `;
  document.getElementById('product-modal').classList.add('open');
  window.closeModal = closeProductModal;

  // Render Related Products
  const related = products.filter(p => p.category === product.category && p.id !== productId).slice(0, 2);
  const relatedContainer = document.getElementById('related-products');
  if (related.length > 0) {
    relatedContainer.innerHTML = related.map(p => `
      <div class="related-card" style="cursor:pointer;" onclick="window.openProductModal(${p.id})">
        <img src="${p.image}" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:var(--radius-sm); margin-bottom:0.5rem;">
        <div style="font-size:0.85rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name}</div>
        <div style="font-size:0.8rem; color:var(--accent-color);">₹${p.price.toLocaleString('en-IN')}</div>
      </div>
    `).join('');
  } else {
    relatedContainer.innerHTML = '<p style="color:var(--text-secondary); font-size:0.85rem;">No similar items found.</p>';
  }

  // Fetch reviews
  try {
    const res = await fetch(`http://localhost:3000/api/products/${productId}/reviews`);
    const { reviews, averageRating } = await res.json();
    renderReviews(reviews, averageRating, productId);
  } catch (e) {
    document.getElementById('reviews-section').innerHTML = '<p style="color:var(--text-secondary);text-align:center;">Unable to load reviews.</p>';
  }
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('open');
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (products.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary)">No products found matching your criteria.</div>';
    return;
  }
  grid.innerHTML = products.map((product, index) => {
    const inWishlist = wishlist.some(p => p.id === product.id);
    return `
    <div class="product-card animate-fade-in-up" data-id="${product.id}" style="animation-delay: ${Math.min(index * 50, 300)}ms; cursor: pointer;" onclick="window.openProductModal(${product.id})">
      <div class="product-badge">${product.category}</div>
      <button class="wishlist-heart ${inWishlist ? 'active' : ''}" onclick="event.stopPropagation(); window.toggleWishlistProduct(${product.id})" aria-label="Wishlist">
        <ion-icon name="${inWishlist ? 'heart' : 'heart-outline'}"></ion-icon>
      </button>
      <div class="product-image-wrap">
        <img src="${product.image}" loading="lazy" alt="${product.name}" class="product-image">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-footer">
          <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
          <button class="btn-add-cart" onclick="event.stopPropagation(); window.addToCart(${product.id})" aria-label="Add to cart">
            <ion-icon name="add-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// Start application
initApp();

// Run tilt effect after products are rendered
const originalRenderProducts = renderProducts;
renderProducts = function() {
  originalRenderProducts();
  initTiltEffect();
};

// ===================== TOAST =====================
window.showToast = function (message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">✕</button>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
};

// ===================== WISHLIST =====================
function toggleWishlist() {
  const sidebar = document.getElementById('wishlist-sidebar');
  const overlay = document.getElementById('wishlist-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

function toggleWishlistProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const idx = wishlist.findIndex(p => p.id === productId);
  if (idx >= 0) {
    wishlist.splice(idx, 1);
    window.showToast(`${product.name} removed from wishlist`, 'info');
  } else {
    wishlist.push(product);
    window.showToast(`${product.name} added to wishlist ❤️`, 'success');
  }
  localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  renderWishlist();
  renderProducts(); // refresh hearts on product cards
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-counter');
  if (badge) badge.textContent = wishlist.length;
}

function renderWishlist() {
  const container = document.getElementById('wishlist-items');
  if (wishlist.length === 0) {
    container.innerHTML = '<div class="empty-cart" style="text-align:center;padding:2rem;color:var(--text-secondary)">Your wishlist is empty</div>';
    return;
  }
  container.innerHTML = wishlist.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-actions" style="gap:0.5rem;">
          <button class="qty-btn" style="width:auto;padding:0 0.75rem;" onclick="window.addToCart(${item.id}); window.showToast('Added to cart!','success');">Add to Cart</button>
          <button class="icon-btn" style="color:#ef4444;" onclick="window.toggleWishlistProduct(${item.id})"><ion-icon name="trash-outline"></ion-icon></button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===================== REVIEWS =====================
function renderReviews(reviews, averageRating, productId) {
  const section = document.getElementById('reviews-section');
  const token = localStorage.getItem('aura_token');
  const stars = (rating) => Array.from({ length: 5 }, (_, i) =>
    `<ion-icon name="${i < rating ? 'star' : 'star-outline'}" style="color:#f59e0b;"></ion-icon>`
  ).join('');

  const reviewForm = token ? `
    <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border-color);">
      <p style="font-weight:600;margin-bottom:0.75rem;">Leave a Review</p>
      <div id="star-rating-input" style="font-size:1.5rem;cursor:pointer;color:#f59e0b;margin-bottom:0.5rem;">
        ${[1, 2, 3, 4, 5].map(n => `<ion-icon name="star-outline" data-rating="${n}" onclick="setReviewRating(${n})" style="cursor:pointer;"></ion-icon>`).join('')}
      </div>
      <input type="hidden" id="review-rating-val" value="0">
      <textarea id="review-comment" placeholder="Share your experience…" style="width:100%;padding:0.75rem;border-radius:var(--radius-sm);border:1px solid var(--border-color);background:var(--surface-color);color:white;font-family:inherit;font-size:0.9rem;resize:vertical;min-height:80px;outline:none;"></textarea>
      <button class="btn btn-primary btn-full" style="margin-top:0.75rem;" onclick="window.submitReview(${productId})">Submit Review</button>
    </div>` : `<p style="text-align:center;color:var(--text-secondary);font-size:0.9rem;"><a href="#" onclick="event.preventDefault();window.switchAuthMode('login')" style="color:var(--accent-color);">Log in</a> to leave a review.</p>`;

  section.innerHTML = `
    <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--border-color);">
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
        <h3 style="font-size:1.1rem;">Reviews</h3>
        ${averageRating ? `<span style="background:var(--brand-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:700;font-size:1.1rem;">${averageRating} ★</span>` : ''}
      </div>
      ${reviews.length === 0 ? '<p style="color:var(--text-secondary);font-size:0.9rem;">No reviews yet. Be the first!</p>' : reviews.map(r => `
        <div style="padding:0.75rem 0;border-bottom:1px solid var(--border-color);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:600;font-size:0.9rem;">${r.user_name}</span>
            <div>${stars(r.rating)}</div>
          </div>
          ${r.comment ? `<p style="color:var(--text-secondary);font-size:0.85rem;margin-top:0.25rem;">${r.comment}</p>` : ''}
        </div>`).join('')}
      ${reviewForm}
    </div>`;
}

window.setReviewRating = function (n) {
  document.getElementById('review-rating-val').value = n;
  const icons = document.querySelectorAll('#star-rating-input ion-icon');
  icons.forEach((icon, i) => icon.setAttribute('name', i < n ? 'star' : 'star-outline'));
};

async function submitReview(productId) {
  const rating = parseInt(document.getElementById('review-rating-val').value);
  const comment = document.getElementById('review-comment').value;
  const token = localStorage.getItem('aura_token');
  if (!rating) { window.showToast('Please select a star rating', 'error'); return; }

  try {
    const res = await fetch(`http://localhost:3000/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ rating, comment })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    window.showToast('Review submitted! Thank you. ⭐', 'success');
    // Reload reviews
    const r2 = await fetch(`http://localhost:3000/api/products/${productId}/reviews`);
    const { reviews, averageRating } = await r2.json();
    renderReviews(reviews, averageRating, productId);
  } catch (err) {
    window.showToast(err.message, 'error');
  }
}

// ===================== INTERACTIVE FEATURES =====================

/**
 * Custom Cursor Logic
 */
const initCustomCursor = () => {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');

  if (!dot || !outline) return;

  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth follower for outline
  const animateCursor = () => {
    const easing = 0.15;
    outlineX += (mouseX - outlineX) * easing;
    outlineY += (mouseY - outlineY) * easing;

    outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Hover effect for interactive elements
  const interactiveElements = 'a, button, .product-card, .filter-btn, .qty-btn, ion-icon';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveElements)) {
      outline.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveElements)) {
      outline.classList.remove('hovering');
    }
  });
};

/**
 * 3D Tilt Effect for Product Cards
 */
const initTiltEffect = () => {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      let glare = card.querySelector('.glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'glare';
        card.appendChild(glare);
      }
      
      glare.style.transform = `translate(${x - rect.width/2}px, ${y - rect.height/2}px)`;
      glare.style.opacity = '1';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      const glare = card.querySelector('.glare');
      if (glare) glare.style.opacity = '0';
    });
  });
};

/**
 * Magnetic Button Interaction
 */
const initMagneticButtons = () => {
  const magnets = document.querySelectorAll('.btn-primary, .btn-add-cart, .logo');

  magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
      const rect = magnet.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    magnet.addEventListener('mouseleave', () => {
      magnet.style.transform = `translate(0px, 0px)`;
    });
  });
};

// Initialize interactive features
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initTiltEffect();
  initMagneticButtons();
});

// Also call them immediately if DOM is already loaded (Vite/HMR cases)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initCustomCursor();
  initTiltEffect();
  initMagneticButtons();
}

/**
 * Scroll Reveal Intersection Observer
 */
const initScrollReveal = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { 
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const watch = () => {
    document.querySelectorAll('.product-card, .hero-badge, .hero-title, .hero-desc, .btn, .section-title, .site-footer').forEach(el => {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      observer.observe(el);
    });
  };

  watch();
  // Watch for new products being added
  const grid = document.getElementById('product-grid');
  if (grid) {
    new MutationObserver(watch).observe(grid, { childList: true });
  }
};

/**
 * Clear Filters Logic
 */
window.clearFilters = () => {
  currentCategory = 'All';
  currentSearch = '';
  currentSort = '';
  currentMinPrice = 0;
  currentMaxPrice = 50000;

  // Reset UI
  document.getElementById('search-input').value = '';
  const searchContainer = document.getElementById('search-container');
  if (searchContainer) searchContainer.classList.remove('active');
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === 'All');
  });
  
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = '';
  
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  if (priceMin) priceMin.value = 0;
  if (priceMax) priceMax.value = 50000;
  
  const minLabel = document.getElementById('price-min-label');
  const maxLabel = document.getElementById('price-max-label');
  if (minLabel) minLabel.textContent = '0';
  if (maxLabel) maxLabel.textContent = '50,000';

  handleFiltersChanged();
};
