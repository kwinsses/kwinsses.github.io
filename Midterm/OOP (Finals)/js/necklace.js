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
    showAlert('Please select or type the reviewer name.');
    return;
  }
  if (!reviewText) {
    showAlert('Please enter a response before sending.');
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
    showAlert('Reviewer not found. Make sure you selected a valid name from the list.');
    return;
  }

  const replyEl = document.createElement('div');
  replyEl.className = 'review-reply';
  replyEl.style = 'margin-top:10px; padding:10px; background:#f7f7f7; border-radius:8px;';
  replyEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:start; gap:10px;">
          <strong>Response:</strong>
          <button type="button" class="reply-delete" aria-label="Delete reply">×</button>
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

/* REVIEW SLIDER */

const reviews = [
  "Absolutely beautiful bracelet. The quality is amazing!",
  "My girlfriend loved it. Perfect gift!",
  "Elegant and affordable. Will buy again!",
  "Very classy jewelry. Highly recommended!"
]

let index = 0

const reviewTextEl = document.getElementById("reviewText");

setInterval(() => {
  index++;
  if (index >= reviews.length) { index = 0; }
  if (reviewTextEl) {
    reviewTextEl.textContent = reviews[index];
  }
}, 4000);

/* SCROLL FADE ANIMATION */

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

/* PRODUCT SCROLL */

const slider = document.getElementById("necklaceSlider")

function scrollLeft() {
  slider.scrollBy({
    left: -300,
    behavior: "smooth"
  })
}

function scrollRight() {
  slider.scrollBy({
    left: 300,
    behavior: "smooth"
  })
}
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
  return '₱' + price;
}

// FIX: Added the missing function to close the modal
function closeCartModal() {
  const cartModal = document.getElementById('cartModal');
  cartModal.classList.add('hidden');
  cartModal.setAttribute('aria-hidden', 'true');
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
    quantity: 1
  };
}

function saveCartItem(product) {
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.name === product.name && item.price === product.price);
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
const modalQtyValue = document.getElementById('modalQtyValue');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');
const modalQtyDecrease = document.getElementById('modalQtyDecrease');
const modalQtyIncrease = document.getElementById('modalQtyIncrease');

function openCartModal(product) {
  if (!product) return;
  modalProduct = { ...product, quantity: 1 };
  modalQuantity = 1;
  modalProductImage.src = product.image;
  modalProductImage.alt = product.name;
  modalProductName.textContent = product.name;
  modalProductPrice.textContent = formatPrice(product.price);
  modalQtyValue.textContent = modalQuantity;
  cartModal.classList.remove('hidden');
  cartModal.setAttribute('aria-hidden', 'false');
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

// Updated listeners to use the closeCartModal function
modalClose.addEventListener('click', closeCartModal);
modalCancel.addEventListener('click', closeCartModal);

modalConfirm.addEventListener('click', () => {
  // 1. Close the modal immediately
  closeCartModal();

  // 2. Perform the logic
  if (!modalProduct) return;
  
  modalProduct.quantity = modalQuantity;
  saveCartItem(modalProduct);
  
  // 3. Show the toast notification
  showToast(modalProduct.name + " added to cart!");
});

document.querySelectorAll('.buy-btn').forEach(button => {
  // Only proceed if it is the "Add to Cart" button
  if (button.textContent.trim() !== 'Add to Cart') return;

  button.addEventListener('click', event => {
    event.preventDefault();
    const product = getProductFromButton(button);
    requireSignIn(() => openCartModal(product));
  });
});

document.getElementById("contactBtn").addEventListener("click", () => {
  showConfirm("Do you want to send us an email?").then(confirmed => {
    if (confirmed) {
      window.location.href = "mailto:info@likhana.com?subject=Inquiry%20about%20bracelets&body=Hello%20Likhana%2C%0A%0AI%20have%20a%20question%20about%20your%20bracelet%20collection.";
    }
  });
});


function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  nav.classList.toggle('show');
}

const dropdownParents = document.querySelectorAll('.nav-links li.has-dropdown > a');
dropdownParents.forEach(link => {
  link.addEventListener('click', e => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const dropdown = link.nextElementSibling;
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
  })
});

(function () {
  function createModal() {
    const tpl = document.createElement('div');
    tpl.innerHTML = `
        <div id="globalModalOverlay" style="display:none;position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:1000;">
          <div id="globalModal" style="background:#fff;padding:20px;border-radius:12px;max-width:420px;width:90%;box-shadow:0 10px 30px rgba(0,0,0,0.2);">
            <div id="globalModalContent" style="margin-bottom:16px;color:#3b2621;font-size:16px"></div>
            <div style="text-align:right;"><button id="globalModalCancel" style="display:none;margin-right:8px;padding:8px 14px;border-radius:8px;border:1px solid #ccc;background:#fff;">Cancel</button><button id="globalModalOk" style="padding:8px 14px;border-radius:8px;border:none;background:#b08968;color:#fff;">OK</button></div>
          </div>
        </div>`;
    document.body.appendChild(tpl.firstElementChild);
  }
  function ensure() { if (!document.getElementById('globalModalOverlay')) createModal(); }
  window.showAlert = function (message) { ensure(); const overlay = document.getElementById('globalModalOverlay'); const content = document.getElementById('globalModalContent'); const ok = document.getElementById('globalModalOk'); const cancel = document.getElementById('globalModalCancel'); cancel.style.display = 'none'; content.textContent = message; overlay.style.display = 'flex'; return new Promise(resolve => { function close() { overlay.style.display = 'none'; ok.removeEventListener('click', onOk); } function onOk() { close(); resolve(true); } ok.addEventListener('click', onOk); }); };
  window.showConfirm = function (message) { ensure(); const overlay = document.getElementById('globalModalOverlay'); const content = document.getElementById('globalModalContent'); const ok = document.getElementById('globalModalOk'); const cancel = document.getElementById('globalModalCancel'); cancel.style.display = 'inline-block'; content.textContent = message; overlay.style.display = 'flex'; return new Promise(resolve => { function cleanup() { overlay.style.display = 'none'; ok.removeEventListener('click', onOk); cancel.removeEventListener('click', onCancel); } function onOk() { cleanup(); resolve(true); } function onCancel() { cleanup(); resolve(false); } ok.addEventListener('click', onOk); cancel.addEventListener('click', onCancel); }); };
})();

const buyNowModal = document.getElementById('buyNowModal');
const instantCheckoutForm = document.getElementById('instantCheckoutForm');
const paymentMethodSelect = document.getElementById('paymentMethod');
const gcashField = document.getElementById('gcashField');
const gcashNumber = document.getElementById('gcashNumber');
let checkoutQty = 1;

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

  const buyNowButton = Array.from(targetCard.querySelectorAll('.buy-btn')).find(button =>
    button.textContent.trim() === 'Buy Now'
  );

  if (!buyNowButton) return;

  setTimeout(() => {
    const name = targetCard.querySelector('h3')?.textContent.trim();
    const image = targetCard.querySelector('img')?.getAttribute('src');
    const priceEl = targetCard.querySelector('.new-price') || targetCard.querySelector('.price');
    const price = priceEl?.textContent.trim();

    requireSignIn(() => openBuyNow(name, image, price));
  }, 200);
}

window.addEventListener('load', autoOpenProductFromUrl);

paymentMethodSelect.addEventListener('change', function () {
  if (this.value === 'paypal') {
    gcashField.style.display = 'block';
    gcashNumber.setAttribute('required', 'true');
  } else {
    gcashField.style.display = 'none';
    gcashNumber.removeAttribute('required');
  }
});

document.getElementById('checkoutQtyIncrease').addEventListener('click', () => {
  checkoutQty++;
  document.getElementById('checkoutQtyValue').textContent = checkoutQty;
});

document.getElementById('checkoutQtyDecrease').addEventListener('click', () => {
  if (checkoutQty > 1) {
    checkoutQty--;
    document.getElementById('checkoutQtyValue').textContent = checkoutQty;
  }
});

function openBuyNow(name, image, price) {
  document.getElementById('checkoutProductName').textContent = name;
  document.getElementById('checkoutProductImage').setAttribute('src', image);
  document.getElementById('checkoutProductPrice').textContent = price;

  checkoutQty = 1;
  document.getElementById('checkoutQtyValue').textContent = checkoutQty;
  gcashField.style.display = 'none';
  gcashNumber.removeAttribute('required');
  instantCheckoutForm.reset();
  buyNowModal.classList.remove('hidden');
  buyNowModal.removeAttribute('aria-hidden');
}

document.querySelectorAll('.buy-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    if (button.textContent.trim() !== 'Buy Now') return;

    e.preventDefault();
    e.stopPropagation();

    let name, image, price;

    if (button.id === 'featuredBuyBtn') {
      name = document.getElementById('featuredProductName').textContent;
      image = document.getElementById('featuredProductImage').getAttribute('src');
      price = document.getElementById('featuredProductPrice').textContent;
    } else {
      const card = button.closest('.product-card');
      name = card.querySelector('h3').textContent;
      image = card.querySelector('img').getAttribute('src');
      const priceEl = card.querySelector('.new-price') || card.querySelector('.price');
      price = priceEl.textContent;
    }
    requireSignIn(() => openBuyNow(name, image, price));
  });
});

function closeBuyNow() {
  buyNowModal.classList.add('hidden');
  buyNowModal.setAttribute('aria-hidden', 'true');
}

document.getElementById('buyNowClose').addEventListener('click', closeBuyNow);
document.getElementById('buyNowCancel').addEventListener('click', closeBuyNow);

instantCheckoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const product = {
    name: document.getElementById('checkoutProductName').textContent,
    image: document.getElementById('checkoutProductImage').src,
    price: parseInt(
      document.getElementById('checkoutProductPrice')
        .textContent.replace(/[^0-9]/g, '')
    ),
    quantity: checkoutQty
  };

  const paymentMethod =
    paymentMethodSelect.value === 'paypal'
      ? `PayPal (${gcashNumber.value})`
      : 'Cash on Delivery (COD)';

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

    const text = await response.text();
    console.log("Server Response:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(text);
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to place order');
    }

    // Success logic
    closeBuyNow(); 
    showReceipt(result.order); 
    instantCheckoutForm.reset();

} catch (error) {
    // This part is crucial for handling network errors or server crashes
    console.error("Order process error:", error);
    showAlert("Error placing order: " + error.message);
}
});
function showReceipt(order) {
  const modal = document.getElementById('receiptModal');
  const content = document.getElementById('receiptContent');
  
  if (!modal || !content) return;

  const item = order.cart[0];
  const total = item.price * item.quantity;
  
  content.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #333;">ORDER CONFIRMED</h2>
      <p style="font-size: 14px; color: #666;">Thank you for choosing Likhana!</p>
    </div>
    <div style="font-family: 'Courier New', Courier, monospace; border: 1px dashed #999; padding: 15px; background: #fafafa;">
      <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order.id}</p>
      <p style="margin: 5px 0;"><strong>Item:</strong> ${item.name}</p>
      <p style="margin: 5px 0;"><strong>Qty:</strong> ${item.quantity}</p>
      <p style="margin: 5px 0;"><strong>Payment:</strong> ${order.customer.payment}</p>
      <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">
      <p style="margin: 5px 0; font-size: 1.2em;"><strong>Total: ₱${total.toLocaleString()}</strong></p>
    </div>
  `;
  
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeReceiptModal() {
  const modal = document.getElementById('receiptModal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}
function showToast(message, type = 'success') {
  console.log("showToast called with:", message); // <--- Add this!
  
  const container = document.getElementById('toast-container');
  if (!container) {
    console.error("Toast container not found in HTML!"); // Check console for this
    return;
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}