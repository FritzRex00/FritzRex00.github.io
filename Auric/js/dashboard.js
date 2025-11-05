
window.addEventListener('DOMContentLoaded', function(){
  const cur = requireAuth(['manager']);
  if(!cur) return;
  document.getElementById('userName').textContent = cur.name;
  // simple stats from localStorage
  const tasks = JSON.parse(localStorage.getItem('auric_tasks')||'[]');
  const users = JSON.parse(localStorage.getItem('auric_users')||'[]');
  document.getElementById('statTasks').textContent = tasks.length;
  document.getElementById('statUsers').textContent = users.length;
  // chart
  const ctx = document.getElementById('tasksChart');
  if(ctx){
    new Chart(ctx,{type:'bar',data:{labels:['Mon','Tue','Wed','Thu','Fri'],datasets:[{label:'Completed',data:[5,7,4,6,3]}]}});
  }
});
