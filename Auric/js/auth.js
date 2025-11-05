
// Simple LocalStorage-based auth with roles
function saveDemoUsers(){
  if(localStorage.getItem('auric_users')) return;
  const users = [
    {username:'manager', password:'pass123', role:'manager', name:'Manager One'},
    {username:'exec', password:'pass123', role:'exec', name:'Executive One'},
    {username:'user', password:'pass123', role:'user', name:'Demo User'}
  ];
  localStorage.setItem('auric_users', JSON.stringify(users));
}
saveDemoUsers();

function signup(e){
  e && e.preventDefault();
  const u = document.getElementById('su_user').value.trim();
  const p = document.getElementById('su_pass').value.trim();
  if(!u||!p){alert('Please provide username and password'); return;}
  const users = JSON.parse(localStorage.getItem('auric_users')||'[]');
  if(users.find(x=>x.username===u)){alert('Username exists'); return;}
  users.push({username:u,password:p,role:'user',name:u});
  localStorage.setItem('auric_users', JSON.stringify(users));
  alert('Signed up. Please login.');
  window.location.href='login.html';
}

function login(e){
  e && e.preventDefault();
  const u = document.getElementById('li_user').value.trim();
  const p = document.getElementById('li_pass').value.trim();
  const users = JSON.parse(localStorage.getItem('auric_users')||'[]');
  const found = users.find(x=>x.username===u && x.password===p);
  if(!found){alert('Invalid credentials'); return;}
  localStorage.setItem('auric_current', JSON.stringify(found));
  // redirect by role
  if(found.role==='manager') window.location.href='management/dashboard.html';
  else if(found.role==='exec') window.location.href='exec/insights.html';
  else window.location.href='index.html';
}

function logout() {
  localStorage.removeItem('auric_current');

  // detect current path and adjust accordingly
  let target = 'login.html';

  if (window.location.pathname.includes('/management/')) {
    target = '../login.html';
  } else if (window.location.pathname.includes('/exec/')) {
    target = '../login.html';
  }

  window.location.href = target;
}



function requireAuth(allowIf) {
  const cur = JSON.parse(localStorage.getItem('auric_current') || 'null');
  if (!cur) {
    window.location.href = 'login.html';
    return null;
  }

  // ✅ Allow everyone if no role restriction is specified
  if (!allowIf || allowIf.length === 0) {
    return cur;
  }

  // 🔒 If roles are specified, only allow those
  if (!allowIf.includes(cur.role)) {
    console.warn('Access denied for role:', cur.role);
    window.location.href = 'index.html';
    return null;
  }

  return cur;
}

