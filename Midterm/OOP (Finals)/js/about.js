
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
    