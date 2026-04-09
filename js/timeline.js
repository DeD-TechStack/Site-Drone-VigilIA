// timeline.js — Timeline expand/collapse + component tabs

function initTimeline() {
  document.querySelectorAll('.tl-header').forEach(function (header) {
    function toggle() {
      var node = header.closest('.tl-node');
      if (node) node.classList.toggle('expanded');
    }

    header.addEventListener('click', toggle);

    // Keyboard support (Enter / Space) for role="button" divs
    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // Auto-expand completed nodes on load
  document.querySelectorAll('.tl-node.completed').forEach(function (node) {
    node.classList.add('expanded');
  });
}

function initComponentTabs() {
  var tabs   = document.querySelectorAll('.comp-tab');
  var panels = document.querySelectorAll('.comp-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      // Deactivate all tabs and panels
      tabs.forEach(function (t)   { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });

      // Activate selected tab and its panel
      tab.classList.add('active');
      var panel = document.getElementById('panel-' + tab.dataset.panel);
      if (panel) panel.classList.add('active');
    });
  });
}

window.addEventListener('load', function () {
  initTimeline();
  initComponentTabs();
});
