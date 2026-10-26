document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');

    if (hamburger && nav) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('show');
        });
    }

    const dropdownParents = document.querySelectorAll('.nav-links li.has-dropdown > a');

    dropdownParents.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();

                const dropdown = link.nextElementSibling;
                dropdown.classList.toggle('open');
            }
        });
    });

    document.addEventListener('click', (e) => {
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
const checkoutBtn = document.querySelector('.checkout-btn');
const cartWarning = document.querySelector('.cart-warning');
const paymentMethodSelect = document.getElementById('paymentMethod');
const gcashField = document.getElementById('gcashField');
const gcashNumber = document.getElementById('gcashNumber');

function getCart() {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
    const normalized = cart.map(item => ({
        ...item,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        size: item.size || ''
    }));
    localStorage.setItem(CART_KEY, JSON.stringify(normalized));
}

function formatPrice(price) {
    return '₱' + price;
}

// --- UPDATED: New logic to determine if size is required ---
function isSizeRequired(item) {
    const imageName = item.image ? item.image.toLowerCase().split('/').pop() : '';
    const name = (item.name || '').toLowerCase();
    
    // Size is NOT required for earrings or necklaces
    if (name.includes('earring') || imageName.includes('earring') || 
        name.includes('necklace') || imageName.includes('necklace')) {
        return false;
    }
    return true; 
}

function isRingItem(item) {
    const imageName = item.image ? item.image.toLowerCase().split('/').pop() : '';
    return imageName.startsWith('r') || (item.name || '').toLowerCase().includes('ring');
}

function getSizeOptions(item) {
    if (isRingItem(item)) {
        return ['6', '7', '8', '9', '10', '11', '12'];
    }
    return ['Small', 'Medium', 'Large', 'Extra Large'];
}

function formatSizeLabel(size) {
    if (!size) return 'Not selected';
    return size.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function renderCartItem(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    const sizeOptions = getSizeOptions(item);
    const selectedSize = item.size || '';
    const sizeSelectOptions = [`
                        <option value="" ${selectedSize === '' ? 'selected' : ''}>Select size</option>`].concat(
        sizeOptions.map(size => `
                        <option value="${size.toLowerCase()}" ${selectedSize.toString().toLowerCase() === size.toLowerCase() ? 'selected' : ''}>${size}</option>`)
    ).join('');
    
    // Updated to use isSizeRequired
    const sizeUI = isSizeRequired(item) ? `
                    <p><strong>Size:</strong> ${formatSizeLabel(item.size)}</p>
                    <div class="modal-size" style="margin-bottom:18px;">
                        <label for="sizeSelect-${index}" style="display:block; font-weight:700; margin-bottom:8px;">Change size</label>
                        <select id="sizeSelect-${index}" data-action="size" data-index="${index}" style="width:100%; padding:10px 12px; border-radius:10px; border:1px solid #ccc; font-size:16px;">
                            ${sizeSelectOptions}
                        </select>
                    </div>` : '';

    cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="price">${formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 1))}</p>
                    ${sizeUI}
                    <div class="quantity-selector">
                        <button data-action="decrease" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button data-action="increase" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-btn" data-action="remove" data-index="${index}">Remove</button>
            `;
    return cartItem;
}

function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyMessage = document.querySelector('.empty-cart');
    const cartSummary = document.querySelector('.cart-summary');
    if (cartItemsContainer) cartItemsContainer.innerHTML = '';

    const cart = getCart();
    if (!cart.length) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Cart is empty';
        cartWarning.textContent = 'Add items to your cart before proceeding to checkout.';
        cartWarning.style.display = 'block';
        return;
    }

    // Updated to use isSizeRequired
    const missingSize = cart.some(item => isSizeRequired(item) && !item.size);
    if (missingSize) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Select sizes to checkout';
        cartWarning.textContent = 'Please select a size for every item before proceeding to checkout.';
        cartWarning.style.display = 'block';
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Proceed to Checkout';
        cartWarning.style.display = 'none';
    }

    if (emptyMessage) emptyMessage.style.display = 'none';
    if (cartItemsContainer) {
        cartItemsContainer.style.display = 'flex';
        cart.forEach((item, index) => {
            const cartItemElement = renderCartItem(item, index);
            cartItemsContainer.appendChild(cartItemElement);
        });

        cartItemsContainer.querySelectorAll('button[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const itemIndex = Number(button.dataset.index);
                if (action === 'increase') {
                    updateItemQuantity(itemIndex, 1);
                } else if (action === 'decrease') {
                    updateItemQuantity(itemIndex, -1);
                } else if (action === 'remove') {
                    removeItem(itemIndex);
                }
            });
        });

        cartItemsContainer.querySelectorAll('select[data-action="size"]').forEach(select => {
            select.addEventListener('change', () => {
                const itemIndex = Number(select.dataset.index);
                updateItemSize(itemIndex, select.value);
            });
        });
    }

    if (cartSummary) cartSummary.style.display = 'block';
    updateTotal();
}

function updateItemQuantity(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].quantity = Math.max(1, cart[index].quantity + delta);
    saveCart(cart);
    renderCart();
}

function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();

    if (!getCart().length) {
        window.location.reload();
    }
}

function updateItemSize(index, newSize) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].size = newSize;
    saveCart(cart);
    renderCart();
}

function updateTotal() {
    const total = getCart().reduce((sum, item) => {
        const price = Number(item.price || 0);
        const quantity = Number(item.quantity || 1);
        return sum + (price * quantity);
    }, 0);
    const summaryHeading = document.querySelector('.cart-summary h2');
    if (summaryHeading) summaryHeading.innerText = 'Total: ' + formatPrice(total.toFixed(2));
}

renderCart();

checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) {
        showAlert('Your cart is empty. Please add items before checkout.');
        return;
    }
    // Updated to use isSizeRequired
    if (cart.some(item => isSizeRequired(item) && !item.size)) {
        showAlert('Please select a size for every item before checkout.');
        return;
    }

    document.getElementById('checkoutModalOverlay').style.display = 'flex';
});

function closeCheckoutModal() {
    document.getElementById('checkoutModalOverlay').style.display = 'none';
    if (gcashField) gcashField.style.display = 'none';
    if (gcashNumber) gcashNumber.removeAttribute('required');
}

if (paymentMethodSelect && gcashField && gcashNumber) {
    paymentMethodSelect.addEventListener('change', function () {
        if (this.value === 'paypal') {
            gcashField.style.display = 'block';
            gcashNumber.setAttribute('required', 'true');
        } else {
            gcashField.style.display = 'none';
            gcashNumber.removeAttribute('required');
        }
    });
}

function showReceipt(order) {
    const modal = document.getElementById('receiptModal');
    const content = document.getElementById('receiptContent');

    const items = Array.isArray(order && order.cart) ? order.cart : getCart();
    const total = items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);

    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 18px;">
          <h2 style="margin: 0; color: #333; font-size: 22px;">ORDER CONFIRMED</h2>
          <p style="font-size: 14px; color: #666; margin: 6px 0 0;">Thank you for choosing Likhana!</p>
        </div>
        <div style="font-family: 'Courier New', Courier, monospace; border: 1px dashed #999; padding: 15px; background: #fafafa;">
          <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order && order.id ? order.id : 'unknown'}</p>
          ${items.map(item => `
            <p style="margin: 5px 0;"><strong>Item:</strong> ${item.name || 'Jewelry Item'}</p>
            <p style="margin: 5px 0;"><strong>Qty:</strong> ${Number(item.quantity) || 1}</p>
            ${item.size ? `<p style="margin: 5px 0;"><strong>Size:</strong> ${String(item.size).toUpperCase()}</p>` : ''}
          `).join('')}
          <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">
          <p style="margin: 5px 0; font-size: 1.1em;"><strong>Total: ₱${total.toLocaleString()}</strong></p>
        </div>
        <div style="text-align: center; margin-top: 18px;">
          <p style="font-size: 12px; color: #888; margin: 0;">Keep this ID for tracking your shipment.</p>
        </div>`;

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

function closeReceiptModal() {
    const modal = document.getElementById('receiptModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const cart = getCart();
    const normalizedCart = cart.map(item => {
        const baseItem = { ...item };
        // Updated to use isSizeRequired
        if (!isSizeRequired(item) || !baseItem.size) {
            delete baseItem.size;
        }
        return baseItem;
    });

    const paymentMethod =
        paymentMethodSelect && paymentMethodSelect.value === 'paypal'
            ? `PayPal (${gcashNumber.value})`
            : 'Cash on Delivery (COD)';

    const customerDetails = {
        name: document.getElementById('fullName').value,
        phone: document.getElementById('phoneNumber').value,
        email: document.getElementById('emailAddress').value,
        address: document.getElementById('shippingAddress').value,
        payment: paymentMethod
    };

    const orderPayload = {
        customer: customerDetails,
        cart: normalizedCart
    };

    closeCheckoutModal();

    try {
        const res = await fetch('/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload) 
        });
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();

        showReceipt(data.order || { id: 'unknown', cart: cart });

        document.getElementById('billingForm').reset();
        localStorage.removeItem(CART_KEY);
        renderCart();
    } catch (err) {
        await showAlert('Failed to save order: ' + err.message);
    }
}

/* Inline global modal functions */
(function () {
    function createModal() {
        const tpl = document.createElement('div');
        tpl.innerHTML = `
        <div id="globalModalOverlay" class="global-modal-overlay" style="display:none;position:fixed;inset:0;align-items:center;justify-content:center;z-index:3000;background:rgba(0,0,0,0.4);">
          <div id="globalModal" class="global-modal" style="background:#fff;padding:20px;border-radius:12px;max-width:420px;width:90%;box-shadow:0 10px 30px rgba(0,0,0,0.2);">
            <div id="globalModalContent" style="margin-bottom:16px;color:#3b2621;font-size:16px"></div>
            <div style="text-align:right;"><button id="globalModalCancel" style="display:none;margin-right:8px;padding:8px 14px;border-radius:8px;border:1px solid #ccc;background:#fff;">Cancel</button><button id="globalModalOk" style="padding:8px 14px;border-radius:8px;border:none;background:#b08968;color:#fff;">OK</button></div>
          </div>
        </div>`;
        document.body.appendChild(tpl.firstElementChild);
    }

    function ensure() {
        if (!document.getElementById('globalModalOverlay')) createModal();
    }

    window.showAlert = function (message, title) {
        ensure();
        const overlay = document.getElementById('globalModalOverlay');
        const content = document.getElementById('globalModalContent');
        const ok = document.getElementById('globalModalOk');
        const cancel = document.getElementById('globalModalCancel');
        cancel.style.display = 'none';
        content.textContent = message;
        overlay.style.display = 'flex';
        return new Promise(resolve => {
            function close() { overlay.style.display = 'none'; ok.removeEventListener('click', onOk); }
            function onOk() { close(); resolve(true); }
            ok.addEventListener('click', onOk);
        });
    }

    window.showConfirm = function (message, title) {
        ensure();
        const overlay = document.getElementById('globalModalOverlay');
        const content = document.getElementById('globalModalContent');
        const ok = document.getElementById('globalModalOk');
        const cancel = document.getElementById('globalModalCancel');
        cancel.style.display = 'inline-block';
        content.textContent = message;
        overlay.style.display = 'flex';
        return new Promise(resolve => {
            function cleanup() { overlay.style.display = 'none'; ok.removeEventListener('click', onOk); cancel.removeEventListener('click', onCancel); }
            function onOk() { cleanup(); resolve(true); }
            function onCancel() { cleanup(); resolve(false); }
            ok.addEventListener('click', onOk);
            cancel.addEventListener('click', onCancel);
        });
    }
})();