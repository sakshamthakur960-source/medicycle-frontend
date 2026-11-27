/* MediCycle live API authentication client.
   Access tokens are kept in sessionStorage (cleared when the tab session ends).
*/
(function () {
  'use strict';

  const TOKEN_KEY = 'medicycle_access_token';
  const USER_KEY = 'medicycle_user';
  const API_BASE = String(window.MEDICYCLE_API_BASE_URL || '').replace(/\/+$/, '');

  function token() { return sessionStorage.getItem(TOKEN_KEY); }
  function setSession(data) {
    if (!data || !data.accessToken || !data.user) {
      throw new Error('The API returned an incomplete login response.');
    }
    sessionStorage.setItem(TOKEN_KEY, data.accessToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
  function clearSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
  function showMessage(message, isError) {
    let node = document.getElementById('medicycle-auth-message');
    if (!node) {
      node = document.createElement('div');
      node.id = 'medicycle-auth-message';
      node.setAttribute('role', 'status');
      node.setAttribute('aria-live', 'polite');
      node.className = 'rounded-xl px-4 py-3 text-sm';
      const card = document.querySelector('#password-container')?.closest('.bg-surface-container-lowest');
      if (card) card.appendChild(node);
      else document.querySelector('main')?.prepend(node);
    }
    node.textContent = message;
    node.classList.toggle('bg-error-container', !!isError);
    node.classList.toggle('text-on-error-container', !!isError);
    node.classList.toggle('bg-secondary-container', !isError);
    node.classList.toggle('text-on-secondary-container', !isError);
  }
  async function request(path, options) {
    if (!API_BASE || API_BASE.includes('YOUR_')) {
      throw new Error('The MediCycle API URL is not configured. Set it in api-config.js.');
    }
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options?.headers || {});
    if (token()) headers.Authorization = 'Bearer ' + token();
    let response;
    try {
      response = await fetch(API_BASE + path, Object.assign({}, options || {}, {
        headers: headers,
        mode: 'cors',
        credentials: 'omit'
      }));
    } catch (_) {
      throw new Error('Cannot reach the MediCycle API. Check the API URL, deployment status, and CORS settings.');
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = typeof data.detail === 'string' ? data.detail : 'Request failed (' + response.status + ').';
      throw new Error(detail);
    }
    return data;
  }

  async function login() {
    if (window.MEDICYCLE_SELECTED_ROLE === 'pharmacy') {
      showMessage('Partner pharmacy authentication is not exposed by the current FastAPI login endpoint yet. Use the household account flow for now.', true);
      return;
    }
    if (window.MEDICYCLE_OTP_MODE === true) {
      showMessage('OTP authentication is not implemented by the current API. Switch to password login.', true);
      return;
    }
    const identifier = document.getElementById('user-identifier')?.value.trim();
    const password = document.getElementById('user-password')?.value;
    if (!identifier) {
      document.getElementById('user-identifier')?.focus();
      showMessage('Enter your registered mobile number or email address.', true);
      return;
    }
    if (!password) {
      document.getElementById('user-password')?.focus();
      showMessage('Enter your account password. OTP login is not enabled by the API yet.', true);
      return;
    }
    const button = Array.from(document.querySelectorAll('button')).find(b => /log in to medicycle/i.test(b.textContent || ''));
    if (button) button.disabled = true;
    showMessage('Signing in securely…', false);
    try {
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier: identifier, password: password })
      });
      setSession(data);
      showMessage('Signed in successfully. Loading your account…', false);
      window.location.href = '18-good-morning-ramesh.html';
    } catch (error) {
      showMessage(error.message || 'Sign-in failed.', true);
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function me() {
    return request('/api/users/me', { method: 'GET' });
  }

  function logout() {
    clearSession();
    window.location.href = '09-user-login.html';
  }

  window.MediCycleAuth = {
    login: login,
    me: me,
    logout: logout,
    request: request,
    getToken: token,
    getUser: function () {
      try { return JSON.parse(sessionStorage.getItem(USER_KEY) || 'null'); }
      catch (_) { return null; }
    }
  };
})();
