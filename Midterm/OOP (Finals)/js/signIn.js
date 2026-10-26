const USER_KEY = 'likhanaUser';

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch (error) {
    return null;
  }
}

function saveCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(USER_KEY);
}

function updateSignInLabel(user) {
  const signInLink = document.getElementById('signInLink');
  if (!signInLink) return;

  if (user && user.name) {
    signInLink.textContent = `Hi, ${user.name}`;
    signInLink.href = '#';
  } else {
    signInLink.textContent = 'Sign In';
    signInLink.href = '#';
  }
}

function openSignInModal() {
  const modal = document.getElementById('signInModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeSignInModal() {
  const modal = document.getElementById('signInModal');
  if (!modal) return;
  clearSignInMessage();
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function showSignInMessage(message, type = 'info') {
  const messageEl = document.getElementById('signInMessage');
  if (!messageEl) return;

  messageEl.textContent = message;
  messageEl.style.display = 'block';
  messageEl.style.color = type === 'success' ? '#2e7d32' : '#b08968';
}

function clearSignInMessage() {
  const messageEl = document.getElementById('signInMessage');
  if (!messageEl) return;
  messageEl.textContent = '';
  messageEl.style.display = 'none';
}

function requireSignIn(onSignedIn) {
  const user = getCurrentUser();

  if (user && user.name) {
    onSignedIn();
    return true;
  }

  window.pendingSignInAction = onSignedIn;
  openSignInModal();
  showSignInForm();
  return false;
}

window.requireSignIn = requireSignIn;

function showSignInForm() {
  const signInForm = document.getElementById('signInForm');
  const logoutPrompt = document.getElementById('logoutPrompt');
  const signInSubmit = document.getElementById('signInSubmit');
  const logoutConfirm = document.getElementById('logoutConfirm');
  const logoutCancel = document.getElementById('logoutCancel');
  if (signInForm) signInForm.style.display = 'block';
  if (logoutPrompt) logoutPrompt.style.display = 'none';
  if (signInSubmit) signInSubmit.style.display = 'inline-block';
  if (logoutConfirm) logoutConfirm.style.display = 'none';
  if (logoutCancel) logoutCancel.style.display = 'none';
}

function showLogoutPrompt(name) {
  const signInForm = document.getElementById('signInForm');
  const logoutPrompt = document.getElementById('logoutPrompt');
  const logoutLabel = document.getElementById('logoutUserName');
  const signInSubmit = document.getElementById('signInSubmit');
  const logoutConfirm = document.getElementById('logoutConfirm');
  const logoutCancel = document.getElementById('logoutCancel');
  if (logoutLabel) logoutLabel.textContent = name;
  if (signInForm) signInForm.style.display = 'none';
  if (logoutPrompt) logoutPrompt.style.display = 'block';
  if (signInSubmit) signInSubmit.style.display = 'none';
  if (logoutConfirm) logoutConfirm.style.display = 'inline-block';
  if (logoutCancel) logoutCancel.style.display = 'inline-block';
}

function initSignInFlow() {
  const signInLink = document.getElementById('signInLink');
  const signInSubmit = document.getElementById('signInSubmit');
  const signInClose = document.getElementById('signInClose');
  const signInCancel = document.getElementById('signInCancel');
  const logoutConfirm = document.getElementById('logoutConfirm');
  const logoutCancel = document.getElementById('logoutCancel');

  updateSignInLabel(getCurrentUser());

  if (signInLink) {
    signInLink.addEventListener('click', (event) => {
      event.preventDefault();
      const user = getCurrentUser();

      if (user && user.name) {
        openSignInModal();
        showLogoutPrompt(user.name);
        return;
      }

      openSignInModal();
      showSignInForm();
    });
  }

  if (signInSubmit) {
    signInSubmit.addEventListener('click', () => {
      const emailInput = document.getElementById('signInEmail');
      const passwordInput = document.getElementById('signInPassword');

      if (!emailInput || !passwordInput) return;

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        showSignInMessage('Please enter both your email and password.', 'error');
        return;
      }

      const name = email.split('@')[0].replace(/[._-]+/g, ' ');
      const user = { name: name.charAt(0).toUpperCase() + name.slice(1), email };
      saveCurrentUser(user);
      updateSignInLabel(user);
      closeSignInModal();
      emailInput.value = '';
      passwordInput.value = '';

      const pendingAction = window.pendingSignInAction;
      if (typeof pendingAction === 'function') {
        window.pendingSignInAction = null;
        setTimeout(() => pendingAction(), 0);
      }

      showSignInMessage(`Welcome, ${user.name}! You are now signed in.`, 'success');
    });
  }

  if (logoutConfirm) {
    logoutConfirm.addEventListener('click', () => {
      clearCurrentUser();
      updateSignInLabel(null);
      closeSignInModal();
    });
  }

  if (logoutCancel) {
    logoutCancel.addEventListener('click', () => {
      showSignInForm();
      closeSignInModal();
    });
  }

  if (signInClose) signInClose.addEventListener('click', closeSignInModal);
  if (signInCancel) signInCancel.addEventListener('click', closeSignInModal);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSignInFlow);
} else {
  initSignInFlow();
}
