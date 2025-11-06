
// theme and nav helpers
(function(){
  const theme = localStorage.getItem('auric_theme') || 'auto';
  const preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const root = document.documentElement;
  function apply(t){
    if(t==='dark' || (t==='auto' && preferDark)) root.setAttribute('data-theme','dark');
    else root.removeAttribute('data-theme');
  }
  apply(localStorage.getItem('auric_theme') || 'auto');
  window.toggleTheme = function(){
    const current = root.hasAttribute('data-theme') ? 'dark' : 'light';
    const next = current==='dark' ? 'light' : 'dark';
    localStorage.setItem('auric_theme', next);
    apply(next);
    
  };
  document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("auric_theme") || "auto";
  applyTheme(saved);
});
})();
