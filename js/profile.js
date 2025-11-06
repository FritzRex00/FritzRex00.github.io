
function initProfile(){
  const cur = requireAuth();
  if(!cur) return;
  document.getElementById('name').value = cur.name || '';
  document.getElementById('roleLabel').textContent = cur.role || 'user';
  loadPrefs();
}
function saveProfile(e){
  e && e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const users = JSON.parse(localStorage.getItem('auric_users')||'[]');
  const cur = JSON.parse(localStorage.getItem('auric_current')||'{}');
  const u = users.find(x=>x.username===cur.username);
  if(u) u.name = name;
  localStorage.setItem('auric_users', JSON.stringify(users));
  cur.name = name;
  localStorage.setItem('auric_current', JSON.stringify(cur));
  alert('Saved profile');
}
function loadPrefs(){
  const theme = localStorage.getItem('auric_theme') || 'auto';
  document.getElementById('themeSel').value = theme;
}
function changeTheme(e){ localStorage.setItem('auric_theme', e.value); location.reload(); }
window.addEventListener('DOMContentLoaded', initProfile);
