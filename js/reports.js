
function initReports(){
  const cur = requireAuth(['manager']);
  if(!cur) return;
  document.getElementById('userName').textContent = cur.name;
}
function generateReport(){
  const tasks = JSON.parse(localStorage.getItem('auric_tasks')||'[]');
  const csv = ['title,date,done,owner', ...tasks.map(t=>[t.title,t.date,t.done,t.owner].join(','))].join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download='tasks_report.csv'; a.click();
  URL.revokeObjectURL(url);
}
window.addEventListener('DOMContentLoaded', initReports);
