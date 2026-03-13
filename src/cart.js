import { products } from './products.js';

let cart = [];

// DOM Elements
let cartSidebar;
let cartOverlay;
let cartItemsContainer;
let cartTotalEl;
let cartCounter;

export function initCart() {
  // Create Cart Skeleton in DOM
  injectCartHTML();

  cartSidebar = document.getElementById('cart-sidebar');
  cartOverlay = document.getElementById('cart-overlay');
  cartItemsContainer = document.getElementById('cart-items');
  cartTotalEl = document.getElementById('cart-total');
  cartCounter = document.getElementById('cart-counter');

  // Event Listeners for Cart Toggle
  document.getElementById('cart-btn').addEventListener('click', toggleCart);
  document.getElementById('close-cart').addEventListener('click', toggleCart);
  cartOverlay.addEventListener('click', toggleCart);
  document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
  
  const applyPromoBtn = document.getElementById('apply-promo-btn');
  if(applyPromoBtn) {
    applyPromoBtn.addEventListener('click', applyPromo);
  }
}

let currentPromo = null;

async function applyPromo() {
  const codeEl = document.getElementById('checkout-promo');
  const msgEl = document.getElementById('promo-message');
  if(!codeEl || !codeEl.value) return;
  const code = codeEl.value.trim();
  
  msgEl.textContent = 'Validating...';
  msgEl.style.color = 'var(--text-secondary)';
  
  try {
    const res = await fetch('http://localhost:3000/api/coupons/validate', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ code })
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error);
    
    currentPromo = data;
    msgEl.textContent = `Promo applied! ${data.type === 'percentage' ? data.value + '%' : '₹' + data.value.toLocaleString('en-IN')} off.`;
    msgEl.style.color = '#10b981';
    
    // Update total
    updateCheckoutTotalDisplay();
  } catch(err) {
    currentPromo = null;
    msgEl.textContent = err.message;
    msgEl.style.color = '#ef4444';
    updateCheckoutTotalDisplay();
  }
}

function updateCheckoutTotalDisplay() {
  const totalDisplay = document.getElementById('checkout-total-display');
  if(!totalDisplay) return;
  
  let total = calculateTotal();
  if(currentPromo) {
    if(currentPromo.type === 'percentage') {
      total = total * (1 - currentPromo.value / 100);
    } else {
      total = Math.max(0, total - currentPromo.value);
    }
  }
  totalDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
}

function injectCartHTML() {
  const html = `
    <div class="cart-overlay" id="cart-overlay"></div>
    <div class="cart-sidebar" id="cart-sidebar">
      <div class="cart-header">
        <h3>Your Cart</h3>
        <button class="icon-btn" id="close-cart">
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </div>
      <div class="cart-items" id="cart-items">
        <div class="empty-cart">Your cart is empty</div>
      </div>
      <div class="cart-footer">
        <div class="cart-total-row">
          <span>Subtotal</span>
          <span id="cart-total">₹0</span>
        </div>
        <button class="btn btn-primary btn-checkout" id="checkout-btn">Checkout</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

export function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  // Fly to Cart Animation
  const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
  if (productCard) {
    const img = productCard.querySelector('.product-image');
    if (img) {
      animateFlyToCart(img);
    }
  }

  updateCartUI();

  // Show cart when item added
  if (!cartSidebar.classList.contains('open')) {
    setTimeout(toggleCart, 800); // Wait for animation to finish
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function updateQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    updateCartUI();
  }
}

function toggleCart() {
  cartSidebar.classList.toggle('open');
  cartOverlay.classList.toggle('open');
}

function handleCheckout() {
  if (cart.length === 0) return;

  const token = localStorage.getItem('aura_token');
  if (!token) {
    if (window.showToast) window.showToast('Please log in to checkout.', 'error');
    else alert('Please log in to checkout.');
    if (window.switchAuthMode) window.switchAuthMode('login');
    toggleCart();
    return;
  }

  // Populate total and open modal
  currentPromo = null;
  const promoInput = document.getElementById('checkout-promo');
  const promoMsg = document.getElementById('promo-message');
  if(promoInput) promoInput.value = '';
  if(promoMsg) promoMsg.textContent = '';
  updateCheckoutTotalDisplay();
  
  document.getElementById('checkout-modal').classList.add('open');
  toggleCart(); // Close cart sidebar

  // Close modal listener
  document.getElementById('close-checkout-modal').onclick = () => {
    document.getElementById('checkout-modal').classList.remove('open');
  };
  
  // Clean up previous listeners if any (simple approach for this project)
  const form = document.getElementById('checkout-form');
  form.onsubmit = submitCheckoutForm;
}

async function submitCheckoutForm(e) {
  e.preventDefault();
  
  const token = localStorage.getItem('aura_token');
  const items = cart.map(item => ({ id: item.id, quantity: item.quantity, price: item.price }));
  
  let total = calculateTotal();
  let discount = 0;
  if(currentPromo) {
    const originalTotal = total;
    if(currentPromo.type === 'percentage') {
      total = total * (1 - currentPromo.value / 100);
    } else {
      total = Math.max(0, total - currentPromo.value);
    }
    discount = originalTotal - total;
  }
  
  const address = document.getElementById('checkout-address').value;
  const paymentMethod = document.getElementById('checkout-payment').value;

  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Processing...';
  btn.disabled = true;

  try {
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items, total, address, paymentMethod, discount, promo_code: currentPromo ? currentPromo.code : null })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Checkout failed');
    }

    if (window.showToast) {
      window.showToast(`Order #${data.orderId} placed successfully! 🎉`, 'success');
    } else {
      alert(`Thank you for your purchase! Order ID: ${data.orderId}`);
    }
    
    // Reset and close
    cart = [];
    updateCartUI();
    document.getElementById('checkout-modal').classList.remove('open');
    e.target.reset();
    
  } catch (err) {
    if (window.showToast) window.showToast(err.message, 'error');
    else alert(err.message);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

function calculateTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartUI() {
  // Update badge
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCounter.textContent = totalItems;

  // Add pulse animation
  cartCounter.classList.add('pulse');
  setTimeout(() => cartCounter.classList.remove('pulse'), 300);

  // Update total
  cartTotalEl.textContent = `₹${calculateTotal().toLocaleString('en-IN')}`;

  // Render items
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart" style="text-align:center; padding: 2rem; color: var(--text-secondary)">Your cart is empty</div>';
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="window.cartAPI.updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="window.cartAPI.updateQuantity(${item.id}, 1)">+</button>
          <button class="icon-btn remove-btn" onclick="window.cartAPI.removeFromCart(${item.id})" style="margin-left: auto; font-size: 1.2rem; color: #ef4444;">
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Expose API to window for inline onclick handlers
window.cartAPI = {
  updateQuantity,
  removeFromCart
};

/**
 * Fly-to-cart animation
 */
function animateFlyToCart(imgElement) {
  const cartBtn = document.getElementById('cart-btn');
  if (!cartBtn) return;

  const imgClone = imgElement.cloneNode();
  const imgRect = imgElement.getBoundingClientRect();
  const cartRect = cartBtn.getBoundingClientRect();

  Object.assign(imgClone.style, {
    position: 'fixed',
    top: `${imgRect.top}px`,
    left: `${imgRect.left}px`,
    width: `${imgRect.width}px`,
    height: `${imgRect.height}px`,
    zIndex: '10002',
    pointerEvents: 'none',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '50%',
    opacity: '1'
  });

  document.body.appendChild(imgClone);

  // Trigger animation in next frame
  requestAnimationFrame(() => {
    Object.assign(imgClone.style, {
      top: `${cartRect.top + 10}px`,
      left: `${cartRect.left + 10}px`,
      width: '20px',
      height: '20px',
      opacity: '0.2'
    });
  });

  imgClone.addEventListener('transitionend', () => {
    imgClone.remove();
    cartBtn.classList.add('pulse');
    setTimeout(() => cartBtn.classList.remove('pulse'), 300);
  });
}
