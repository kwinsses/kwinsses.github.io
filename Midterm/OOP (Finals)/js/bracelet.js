/* REVIEW LOGIC */
const reviewContainer = document.querySelector(".review-container");
const toggleBtn = document.getElementById("toggleReviews");

toggleBtn.addEventListener("click", () => {
  if (reviewContainer.style.maxHeight === "none") {
    reviewContainer.style.maxHeight = "300px";
    toggleBtn.innerText = "See More →";
  } else {
    reviewContainer.style.maxHeight = "none";
    toggleBtn.innerText = "See Less ←";
  }
});

function populateReviewerDatalist() {
  const datalist = document.getElementById('reply-suggestions');
  datalist.innerHTML = '';
  document.querySelectorAll('.review-card').forEach(card => {
    const nameEl = card.querySelector('strong');
    if (nameEl) {
      const option = document.createElement('option');
      option.value = nameEl.textContent.trim();
      datalist.appendChild(option);
    }
  });
}

const sendConfirmModal = document.getElementById('sendConfirmModal');
const sendConfirmClose = document.getElementById('sendConfirmClose');
const sendConfirmOk = document.getElementById('sendConfirmOk');
const sendConfirmText = document.getElementById('sendConfirmText');

function showSendConfirm() {
  sendConfirmText.textContent = 'Message sent.';
  sendConfirmModal.classList.remove('hidden');
  sendConfirmModal.setAttribute('aria-hidden', 'false');
}

function closeSendConfirm() {
  sendConfirmModal.classList.add('hidden');
  sendConfirmModal.setAttribute('aria-hidden', 'true');
}

function openDeleteConfirm(replyEl) {
  deleteTargetReply = replyEl;
  deleteConfirmModal.classList.remove('hidden');
  deleteConfirmModal.setAttribute('aria-hidden', 'false');
}

function closeDeleteConfirm() {
  deleteTargetReply = null;
  deleteConfirmModal.classList.add('hidden');
  deleteConfirmModal.setAttribute('aria-hidden', 'true');
}

sendConfirmClose.addEventListener('click', closeSendConfirm);
sendConfirmOk.addEventListener('click', closeSendConfirm);

const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const deleteConfirmClose = document.getElementById('deleteConfirmClose');
const deleteConfirmCancel = document.getElementById('deleteConfirmCancel');
const deleteConfirmDelete = document.getElementById('deleteConfirmDelete');
let deleteTargetReply = null;

deleteConfirmClose.addEventListener('click', closeDeleteConfirm);
deleteConfirmCancel.addEventListener('click', closeDeleteConfirm);
deleteConfirmDelete.addEventListener('click', () => {
  if (deleteTargetReply) {
    deleteTargetReply.remove();
  }
  closeDeleteConfirm();
});

const review4Send = document.getElementById('review4-send');
review4Send.addEventListener('click', () => {
  const reviewerInput = document.getElementById('review4-input');
  const reviewerName = reviewerInput.value.trim();
  const reviewText = document.getElementById('review4-textarea').value.trim();

  if (!reviewerName) {
    alert('Please select or type the reviewer name.');
    return;
  }
  if (!reviewText) {
    alert('Please enter a response before sending.');
    return;
  }

  let targetCard = null;
  document.querySelectorAll('.review-card').forEach(card => {
    const nameEl = card.querySelector('strong');
    if (nameEl && nameEl.textContent.trim() === reviewerName) {
      targetCard = card;
    }
  });

  if (!targetCard) {
    alert('Reviewer not found. Make sure you selected a valid name from the list.');
    return;
  }

  const replyEl = document.createElement('div');
  replyEl.className = 'review-reply';
  replyEl.style = 'margin-top:10px; padding:10px; background:#f7f7f7; border-radius:8px;';
  replyEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:start; gap:10px;">
          <strong>Response:</strong>
          <button type="button" class="reply-delete" aria-label="Delete reply">&times;</button>
        </div>
        <p style="margin:6px 0 0 0;">${escapeHtml(reviewText)}</p>
      `;

  const deleteBtn = replyEl.querySelector('.reply-delete');
  deleteBtn.addEventListener('click', () => openDeleteConfirm(replyEl));

  targetCard.appendChild(replyEl);
  targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showSendConfirm();

  document.getElementById('review4-textarea').value = '';
  document.getElementById('review4-input').value = '';
});

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (s) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" })[s];
  });
}

populateReviewerDatalist();

const reviewList = document.querySelector(".review-list");
const reviewHeight = 150;

function scrollReviewsVertical(direction) {
  reviewList.scrollBy({
    top: direction * reviewHeight,
    behavior: "smooth"
  });
}

setInterval(() => {
  scrollReviewsVertical(1);
}, 4000);

function openColorTester() {
  window.open("svg.html", "_blank");
}

/* SCROLL ANIMATION */
const faders = document.querySelectorAll('.fade')
window.addEventListener('scroll', () => {
  const trigger = window.innerHeight * .85
  faders.forEach(section => {
    const top = section.getBoundingClientRect().top
    if (top < trigger) {
      section.classList.add('show')
    }
  })
})

function toggleDescription() {
  const container = document.querySelector('.description-container');
  container.classList.toggle('show');
  const btn = document.querySelector('.toggle-desc');
  if (container.classList.contains('show')) {
    btn.innerText = "See Less ←";
  } else {
    btn.innerText = "See More →";
  }
}

const CART_KEY = 'likhanaCart';

function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(price) {
  return '₱' + price.toLocaleString();
}

function getProductFromButton(button) {
  const card = button.closest('.product-card');
  if (!card) return null;
  const titleEl = card.querySelector('h3');
  const imageEl = card.querySelector('img');
  const priceEl = card.querySelector('.new-price') || card.querySelector('.price');

  let cleanPrice = 0;
  if (priceEl) {
    let priceText = priceEl.cloneNode(true);
    const oldPriceEl = priceText.querySelector('.old-price');
    if (oldPriceEl) oldPriceEl.remove();
    cleanPrice = parseInt(priceText.textContent.replace(/[^0-9]/g, ''), 10) || 0;
  }

  return {
    name: titleEl ? titleEl.textContent.trim() : 'Item Collection',
    image: imageEl ? imageEl.getAttribute('src') : '',
    price: cleanPrice,
    quantity: 1
  };
}

function autoOpenProductFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const productName = params.get('openProduct');
  const shouldOpenBuyNow = params.get('openBuyNow') === '1';

  if (!shouldOpenBuyNow || !productName) return;

  const targetCard = Array.from(document.querySelectorAll('.product-card')).find(card => {
    const title = card.querySelector('h3')?.textContent.trim();
    return title === productName;
  });

  if (!targetCard) return;

  const buyNowButton = targetCard.querySelector('.direct-buy');
  if (!buyNowButton) return;

  setTimeout(() => {
    const parsedProduct = getProductFromButton(buyNowButton);
    requireSignIn(() => openBuyNowModal(parsedProduct));
  }, 200);
}

window.addEventListener('load', autoOpenProductFromUrl);

/* =========================================
   ADD TO CART LOGIC
   ========================================= */
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

function openCartModal(product) {
  if (!product) return;
  modalProduct = { ...product, quantity: 1, size: '' };
  modalQuantity = 1;
  modalProductImage.src = product.image;
  modalProductImage.alt = product.name;
  modalProductName.textContent = product.name;
  modalProductPrice.textContent = formatPrice(product.price);
  modalQtyValue.textContent = modalQuantity;
  modalSizeSelect.value = '';
  cartModal.classList.remove('hidden');
  cartModal.setAttribute('aria-hidden', 'false');
}

function closeCartModal() {
  cartModal.classList.add('hidden');
  cartModal.setAttribute('aria-hidden', 'true');
}

modalQtyDecrease.addEventListener('click', () => {
  if (modalQuantity > 1) {
    modalQuantity -= 1;
    modalQtyValue.textContent = modalQuantity;
  }
});

modalQtyIncrease.addEventListener('click', () => {
  modalQuantity += 1;
  modalQtyValue.textContent = modalQuantity;
});

modalClose.addEventListener('click', closeCartModal);
modalCancel.addEventListener('click', closeCartModal);

modalConfirm.addEventListener('click', () => {
  if (!modalProduct) return;
  if (!modalSizeSelect.value) {
    showToast('Please select a size before adding to cart.', 'error');
    return;
  }
  modalProduct.quantity = modalQuantity;
  modalProduct.size = modalSizeSelect.value;

  const cart = getCart();
  const existing = cart.find(item => item.name === modalProduct.name && item.size === modalProduct.size);
  if (existing) {
    existing.quantity += modalProduct.quantity;
  } else {
    cart.push(modalProduct);
  }
  saveCart(cart);
  closeCartModal();
  showToast(`${modalProduct.name} added to cart successfully!`);
});

document.querySelectorAll('.buy-btn').forEach(button => {
  if (button.textContent.trim() !== 'Add to Cart') return;
  button.addEventListener('click', event => {
    event.preventDefault();
    const product = getProductFromButton(button);
    requireSignIn(() => openCartModal(product));
  });
});

/* =========================================
   INSTANT CHECKOUT WITH PAYMENT LOGIC
   ========================================= */
let checkoutQuantity = 1;
let checkoutProductPriceVal = 0;

const buyNowModal = document.getElementById('buyNowModal');
const checkoutProductImage = document.getElementById('checkoutProductImage');
const checkoutProductName = document.getElementById('checkoutProductName');
const checkoutProductPrice = document.getElementById('checkoutProductPrice');
const checkoutSizeSelect = document.getElementById('checkoutSizeSelect');
const checkoutQtyValue = document.getElementById('checkoutQtyValue');
const checkoutQtyDecrease = document.getElementById('checkoutQtyDecrease');
const checkoutQtyIncrease = document.getElementById('checkoutQtyIncrease');
const checkoutForm = document.getElementById('instantCheckoutForm');
const paymentMethodSelect = document.getElementById('paymentMethod');
const gcashField = document.getElementById('gcashField');
const gcashNumberInput = document.getElementById('gcashNumber');

// Monitor payment method changes to toggle GCash field visibility
paymentMethodSelect.addEventListener('change', function () {
  if (this.value === 'paypal') {
    gcashField.style.display = 'block';
    gcashNumberInput.setAttribute('required', 'true');
  } else {
    gcashField.style.display = 'none';
    gcashNumberInput.removeAttribute('required');
  }
});

function openBuyNowModal(product) {
  if (!product) return;
  checkoutQuantity = 1;
  checkoutProductPriceVal = product.price;

  checkoutProductImage.src = product.image;
  checkoutProductName.textContent = product.name;
  checkoutProductPrice.textContent = formatPrice(product.price);
  checkoutQtyValue.textContent = checkoutQuantity;
  checkoutSizeSelect.value = '';

  checkoutForm.reset();
  gcashField.style.display = 'none';
  gcashNumberInput.removeAttribute('required');

  buyNowModal.classList.remove('hidden');
  buyNowModal.setAttribute('aria-hidden', 'false');
}

function closeBuyNowModal() {
  buyNowModal.classList.add('hidden');
  buyNowModal.setAttribute('aria-hidden', 'true');
}

checkoutQtyDecrease.addEventListener('click', () => {
  if (checkoutQuantity > 1) {
    checkoutQuantity--;
    checkoutQtyValue.textContent = checkoutQuantity;
    checkoutProductPrice.textContent = formatPrice(checkoutProductPriceVal * checkoutQuantity);
  }
});

checkoutQtyIncrease.addEventListener('click', () => {
  checkoutQuantity++;
  checkoutQtyValue.textContent = checkoutQuantity;
  checkoutProductPrice.textContent = formatPrice(checkoutProductPriceVal * checkoutQuantity);
});

document.getElementById('buyNowClose').addEventListener('click', closeBuyNowModal);
document.getElementById('buyNowCancel').addEventListener('click', closeBuyNowModal);

document.querySelectorAll('.direct-buy').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const parsedProduct = getProductFromButton(btn);

    if (btn.id === 'featuredBuyBtn') {
      parsedProduct.name = "Featured Golden Charm";
      parsedProduct.price = 10000;
      parsedProduct.image = "images/bl2.jpg";
    }
    requireSignIn(() => openBuyNowModal(parsedProduct));
  });
});

checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const product = {
    name: checkoutProductName.textContent,
    image: checkoutProductImage.src,
    price: checkoutProductPriceVal,
    quantity: checkoutQuantity,
    size: checkoutSizeSelect.value
  };

  const paymentMethod =
    paymentMethodSelect.value === "paypal"
      ? `PayPal (${gcashNumberInput.value})`
      : "Cash on Delivery (COD)";

  const payload = {
    cart: [product],
    paymentMethod: paymentMethod,
    customer: {
      name: document.getElementById('custName').value,
      email: document.getElementById('custEmail').value,
      phone: document.getElementById('custPhone').value,
      address: document.getElementById('custAddress').value,
      payment: paymentMethod
    }
  };

  try {
    const response = await fetch('/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to place order');
    }

    closeBuyNowModal();
    // Instead of alert, call the receipt function
    showReceipt(result.order); 

    checkoutForm.reset();

  } catch (error) {
    console.error(error);
    showToast('Error placing order: ' + error.message, 'error');
  }
});

function showReceipt(order) {
  const modal = document.getElementById('receiptModal');
  const content = document.getElementById('receiptContent');
  
  // Format the total price
  const total = order.cart[0].price * order.cart[0].quantity;
  
  content.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #333;">ORDER CONFIRMED</h2>
      <p style="font-size: 14px; color: #666;">Thank you for choosing Likhana!</p>
    </div>
    <div style="font-family: 'Courier New', Courier, monospace; border: 1px dashed #999; padding: 15px; background: #fafafa;">
      <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order.id}</p>
      <p style="margin: 5px 0;"><strong>Item:</strong> ${order.cart[0].name}</p>
      <p style="margin: 5px 0;"><strong>Size:</strong> ${order.cart[0].size.toUpperCase()}</p>
      <p style="margin: 5px 0;"><strong>Qty:</strong> ${order.cart[0].quantity}</p>
      <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">
      <p style="margin: 5px 0; font-size: 1.2em;"><strong>Total: ₱${total.toLocaleString()}</strong></p>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <p style="font-size: 12px; color: #888;">Keep this ID for tracking your shipment.</p>
    </div>
  `;
  
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

document.getElementById("contactBtn").addEventListener("click", () => {
  const confirmEmail = confirm("Do you want to send us an email?");
  if (confirmEmail) {
    window.location.href = "mailto:info@likhana.com?subject=Inquiry%20about%20bracelets&body=Hello%20Likhana%2C%0A%0AI%20have%20a%20question%20about%20your%20bracelet%20collection.";
  }
});

function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", function () {
  const dropdownLinks = document.querySelectorAll(".has-dropdown > a");
  dropdownLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdown = this.parentElement.querySelector(".dropdown");
        if (dropdown) {
          dropdown.classList.toggle("open");
        }
      }
    });
  });
});  
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  
  // Style the toast
  toast.style.padding = "15px 20px";
  toast.style.borderRadius = "8px";
  toast.style.color = "#fff";
  toast.style.fontWeight = "bold";
  toast.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
  toast.style.backgroundColor = type === 'error' ? '#e74c3c' : '#2ecc71';
  toast.textContent = message;

  container.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
function closeReceiptModal() {
  const modal = document.getElementById('receiptModal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}