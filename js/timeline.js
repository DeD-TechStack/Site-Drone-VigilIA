// timeline.js — Timeline expand/collapse + Tabs de componentes

function initTimeline() {
  document.querySelectorAll('.tl-header').forEach(header => {
    header.addEventListener('click', () => {
      const node = header.closest('.tl-node');
      node.classList.toggle('expanded');
    });
  });

  // Expandir automaticamente os nós concluídos
  document.querySelectorAll('.tl-node.completed').forEach(node => {
    node.classList.add('expanded');
  });
}

function initComponentTabs() {
  document.querySelectorAll('.comp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.comp-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.comp-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.panel).classList.add('active');
    });
  });
}

window.addEventListener('load', () => {
  initTimeline();
  initComponentTabs();
});
