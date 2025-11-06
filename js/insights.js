
window.addEventListener('DOMContentLoaded', function(){
  const cur = requireAuth(['exec']);
  if(!cur) return;
  document.getElementById('userName').textContent = cur.name;
  const ctx = document.getElementById('kpiChart');
  if(ctx){
    new Chart(ctx,{type:'line',data:{labels:['Jul','Aug','Sep','Oct'],datasets:[{label:'Active Users',data:[120,140,165,180]},{label:'Shared Notes',data:[30,45,60,72]}]}});
  }
});
