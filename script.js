/* ── TAB TOGGLE ── */
function switchTab(tab) {
  document.getElementById('tab-login').classList.toggle('active',  tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('panel-login').classList.toggle('active',  tab === 'login');
  document.getElementById('panel-signup').classList.toggle('active', tab === 'signup');
}

/* ── TOGGLE PASSWORD VISIBILITY ── */
function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  const isHidden = inp.type === 'password';
  inp.type = isHidden ? 'text' : 'password';

  const path = btn.querySelector('path');
  if (isHidden) {
    // eye-open icon
    path.setAttribute('d',
      'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z');
  } else {
    // eye-off icon
    path.setAttribute('d',
      'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94' +
      'M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22');
  }
}

/* ── LOGIN ── */
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value.trim();
  if (!email || !pass) { alert('Please fill in all fields.'); return; }

  // derive display name from email
  const name = email.split('@')[0]
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  redirectHome(name);
}

/* ── SIGNUP ── */
function doSignup() {
  const name   = document.getElementById('signup-name').value.trim();
  const email  = document.getElementById('signup-email').value.trim();
  const pass   = document.getElementById('signup-password').value.trim();
  const mobile = document.getElementById('signup-mobile').value.trim();
  if (!name || !email || !pass || !mobile) { alert('Please fill in all fields.'); return; }

  redirectHome(name.split(' ')[0]);
}

/* ── REDIRECT TO HOME ── */
function redirectHome(displayName) {
  document.getElementById('welcome-name').textContent = displayName;
  document.getElementById('auth-card').style.display = 'none';
  document.getElementById('home').classList.add('show');
}

/* ── LOGOUT ── */
function doLogout() {
  document.getElementById('home').classList.remove('show');
  document.getElementById('auth-card').style.display = '';

  // reset all fields
  ['login-email', 'login-password', 'signup-name', 'signup-email', 'signup-password', 'signup-mobile']
    .forEach(id => document.getElementById(id).value = '');

  switchTab('login');
}
