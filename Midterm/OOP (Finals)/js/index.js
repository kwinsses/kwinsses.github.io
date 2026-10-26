const contactBtn = document.getElementById('contactBtn');
if (contactBtn) {
  contactBtn.addEventListener('click', () => {
    const confirmEmail = confirm('Do you want to send us an email?');
    if (confirmEmail) {
      window.location.href = 'mailto:info@likhana.com?subject=Inquiry%20about%20bracelets&body=Hello%20Likhana%2C%0A%0AI%20have%20a%20question%20about%20your%20bracelet%20collection.';
    }
  });
}

// Scroll slider
function scrollLeft(sliderId) {
  document.getElementById(sliderId).scrollBy({
    left: -300,
    behavior: 'smooth'
  });
}

function scrollRight(sliderId) {
  document.getElementById(sliderId).scrollBy({
    left: 300,
    behavior: 'smooth'
  });
}

// Toggle menu para sa mobile view// Toggle menu para sa mobile view
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');

  if (hamburger && nav) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('show'); // Nagdadagdag ng 'show' class para makita ang listahan
    });
  }

  const dropdownParents = document.querySelectorAll('.nav-links li.has-dropdown > a');

  dropdownParents.forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();

        const dropdown = link.nextElementSibling;
        dropdown.classList.toggle('open');
      }
    });
  });

  // Kusang magsasara kapag nag-click sa labas ng menu
  document.addEventListener('click', e => {
    if (window.innerWidth <= 768 && nav && hamburger) {
      if (nav.classList.contains('show') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('show');

        document.querySelectorAll('.dropdown.open').forEach(menu => {
          menu.classList.remove('open');
        });
      }
    }
  });
});

const CART_KEY = 'likhanaCart';

function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getProductFromButton(button) {
  const card = button.closest('.product-card');
  if (!card) return null;
  const titleEl = card.querySelector('figcaption') || card.querySelector('h3');
  const imageEl = card.querySelector('img');
  const priceEl = card.querySelector('.new-price') || card.querySelector('.price');
  const priceText = priceEl ? priceEl.innerText.replace(/[^0-9]/g, '') : '0';

  return {
    name: titleEl ? titleEl.textContent.trim() : 'Item',
    image: imageEl ? imageEl.getAttribute('src') : '',
    price: parseInt(priceText, 10) || 0,
    quantity: 1,
    size: ''
  };
}

function isRingItem(item) {
  const imageName = item.image ? item.image.toLowerCase().split('/').pop() : '';
  return imageName.startsWith('r') || item.name.toLowerCase().includes('ring');
}

function getSizeOptions(item) {
  if (isRingItem(item)) {
    return ['6', '7', '8', '9', '10', '11', '12'];
  }
  return ['Small', 'Medium', 'Large', 'Extra Large'];
}

function formatPrice(price) {
  return '₱' + price;
}

function saveCartItem(product) {
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.name === product.name && item.price === product.price && item.size === product.size);
  if (existing) {
    existing.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  saveCart(cart);
}

let modalQuantity = 1;
let modalProduct = null;

const cartModal = document.getElementById('cartModal');
const modalProductImage = document.getElementById('modalProductImage');
const modalProductName = document.getElementById('modalProductName');
const modalProductPrice = document.getElementById('modalProductPrice');
const modalSizeSelect = document.getElementById('modalSizeSelect');
const modalQtyValue = document.getElementById('modalQtyValue');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');
const modalQtyDecrease = document.getElementById('modalQtyDecrease');
const modalQtyIncrease = document.getElementById('modalQtyIncrease');

function closeCartModal() {
  cartModal.classList.add('hidden');
  cartModal.setAttribute('aria-hidden', 'true');
}

function updateModalQuantity() {
  modalQtyValue.textContent = modalQuantity;
}

modalQtyDecrease.addEventListener('click', () => {
  if (modalQuantity > 1) {
    modalQuantity -= 1;
    updateModalQuantity();
  }
});

modalQtyIncrease.addEventListener('click', () => {
  modalQuantity += 1;
  updateModalQuantity();
});

modalClose.addEventListener('click', closeCartModal);
modalCancel.addEventListener('click', closeCartModal);

modalConfirm.addEventListener('click', () => {
  if (!modalProduct) return;

  // I-check kung kailangan ng size (ibig sabihin hindi hidden ang container)
  const sizeContainer = document.getElementById('sizeContainer');
  if (sizeContainer.style.display !== 'none' && !modalSizeSelect.value) {
    alert('Please select a size before adding to cart.');
    return;
  }

  modalProduct.quantity = modalQuantity;
  // Kung hidden ang size container, gamitin ang n/a
  modalProduct.size = sizeContainer.style.display === 'none' ? 'n/a' : modalSizeSelect.value;

  saveCartItem(modalProduct);
  closeCartModal();
});

document.querySelectorAll('.buy-btn').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    const product = getProductFromButton(button);
    requireSignIn(() => openCartModal(product));
  });
});

// Kunin ang elements
const sizeContainer = document.getElementById('sizeContainer');
const productName = document.getElementById('modalProductName').innerText; // Pangalan ng item

function openCartModal(product) {
  if (!product) return;

  modalProduct = { ...product, quantity: 1, size: '' };
  modalQuantity = 1;
  modalProductImage.src = product.image;
  modalProductImage.alt = product.name;
  modalProductName.textContent = product.name;
  modalProductPrice.textContent = formatPrice(product.price);
  modalQtyValue.textContent = modalQuantity;

  // ITO ANG LOGIC PARA SA SIZE:
  const sizeContainer = document.getElementById('sizeContainer');

  // I-check kung Earring o Necklace ang item base sa pangalan
  if (product.name.includes("Earring") || product.name.includes("Necklace")) {
    sizeContainer.style.display = 'none';
    modalProduct.size = 'n/a'; // I-set ang size sa 'n/a' para hindi mag-error ang validation
  } else {
    sizeContainer.style.display = 'block';
    // I-populate ang size options kung kailangan
    const options = getSizeOptions(product).map(size => `
          <option value="${size.toLowerCase()}">${size}</option>`).join('');
    modalSizeSelect.innerHTML = `<option value="">Select size</option>${options}`;
    modalSizeSelect.value = '';
  }

  cartModal.classList.remove('hidden');
  cartModal.setAttribute('aria-hidden', 'false');
}