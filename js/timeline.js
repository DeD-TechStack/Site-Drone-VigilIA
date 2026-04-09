// timeline.js — Timeline expand/collapse + component tabs + roadmap node links

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

// Roadmap nodes — clicking navigates to and expands the matching timeline entry
function initRoadmapNodes() {
  var nodes = document.querySelectorAll('.roadmap-node[data-phase]');

  nodes.forEach(function (node) {
    function activate() {
      var phase   = node.dataset.phase; // e.g. "F1"
      var tlNode  = document.querySelector('.tl-node[data-phase="' + phase + '"]');

      // Update active state on all roadmap nodes
      nodes.forEach(function (n) { n.classList.remove('active'); });
      node.classList.add('active');

      if (!tlNode) return;

      // Expand the target timeline node
      tlNode.classList.add('expanded');

      // Smooth scroll to it (give browser a tick to paint the expansion first)
      setTimeout(function () {
        tlNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }

    node.addEventListener('click', activate);

    // Keyboard: Enter or Space
    node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });
}

window.addEventListener('load', function () {
  initTimeline();
  initComponentTabs();
  initRoadmapNodes();
});
