
function ensureModal() {
  if (document.getElementById('globalModalOverlay')) return;
  const tpl = document.createElement('div');
  tpl.innerHTML = `
          <div id="globalModalOverlay" style="display:none;position:fixed;inset:0;align-items:center;justify-content:center;z-index:3000;background:rgba(0,0,0,0.45);">
            <div id="globalModal" style="background:#fff;padding:20px 22px;border-radius:14px;max-width:420px;width:90%;box-shadow:0 10px 30px rgba(0,0,0,0.2);">
              <div id="globalModalContent" style="margin-bottom:16px;color:#3b2621;font-size:16px;line-height:1.4;"></div>
              <div style="text-align:right;display:flex;justify-content:flex-end;gap:8px;">
                <button id="globalModalCancel" style="display:none;padding:8px 14px;border-radius:8px;border:1px solid #ccc;background:#fff;cursor:pointer;">Cancel</button>
                <button id="globalModalOk" style="padding:8px 14px;border-radius:8px;border:none;background:#b08968;color:#fff;cursor:pointer;">OK</button>
              </div>
            </div>
          </div>`;
  document.body.appendChild(tpl.firstElementChild);
}
window.showAlert = function (message) { ensureModal(); const overlay = document.getElementById('globalModalOverlay'); const content = document.getElementById('globalModalContent'); const ok = document.getElementById('globalModalOk'); const cancel = document.getElementById('globalModalCancel'); cancel.style.display = 'none'; content.textContent = message; overlay.style.display = 'flex'; return new Promise(resolve => { const close = () => { overlay.style.display = 'none'; ok.removeEventListener('click', onOk); }; function onOk() { close(); resolve(true); } ok.addEventListener('click', onOk); }); };
window.showConfirm = function (message) { ensureModal(); const overlay = document.getElementById('globalModalOverlay'); const content = document.getElementById('globalModalContent'); const ok = document.getElementById('globalModalOk'); const cancel = document.getElementById('globalModalCancel'); cancel.style.display = 'inline-block'; content.textContent = message; overlay.style.display = 'flex'; return new Promise(resolve => { const cleanup = () => { overlay.style.display = 'none'; ok.removeEventListener('click', onOk); cancel.removeEventListener('click', onCancel); }; function onOk() { cleanup(); resolve(true); } function onCancel() { cleanup(); resolve(false); } ok.addEventListener('click', onOk); cancel.addEventListener('click', onCancel); }); };
const CART_KEY = 'likhanaCart';

function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addCustomItemToCart(item) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
}

async function sendCustomOrderToServer(order) {
  const response = await fetch('/custom-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Unable to save custom order.');
  }

  return response.json();
}

document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const fileInput = document.getElementById('designFile');
  const description = document.getElementById('description').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const deliveryOption = document.getElementById('delivery-option').value;
  const dateValue = document.getElementById('date-input').value;
  const timeValue = document.getElementById('time-input').value;

  if (!fileInput.files[0]) {
    await showAlert('Please select a file to upload.');
    return;
  }

  if (!name || !email) {
    await showAlert('Please fill in your name and email.');
    return;
  }

  const customItem = {
    name: 'Custom Bracelet Order',
    image: 'images/bl2.jpg',
    price: 499,
    quantity: 1,
    size: ''
  };

  addCustomItemToCart(customItem);

  try {
    const serverResponse = await sendCustomOrderToServer({
      cart: [customItem],
      custom: {
        name,
        email,
        description,
        deliveryOption,
        date: dateValue,
        time: timeValue
      }
    });

    await showAlert('Custom order saved. Order ID: ' + (serverResponse.order?.id || 'unknown'));
  } catch (error) {
    await showAlert('Custom order added to cart, but could not save to .json: ' + error.message);
  }

  window.location.href = 'addToCart.html';
});

// Reset button functionality
document.getElementById('resetBtn').addEventListener('click', function () {
  document.getElementById('uploadForm').reset();
  showAlert('Form has been reset.');
});



function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('show');
}

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



document.getElementById("contactBtn").addEventListener("click", () => {
  showConfirm("Do you want to send us an email?").then(confirmed => {
    if (confirmed) {
      window.location.href = "mailto:info@likhana.com?subject=Inquiry%20about%20bracelets&body=Hello%20Likhana%2C%0A%0AI%20have%20a%20question%20about%20your%20bracelet%20collection.";
    }
  });
});


// Mobile hamburger menu
function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  nav.classList.toggle('show');
}

// Dropdown tap for mobile
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
