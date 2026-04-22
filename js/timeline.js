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
  var arr    = Array.prototype.slice.call(tabs);

  function activateTab(tab) {
    // Deactivate all tabs
    tabs.forEach(function (t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.tabIndex = -1;
    });
    // Hide all panels
    panels.forEach(function (p) { p.classList.remove('active'); });

    // Activate the selected tab
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.tabIndex = 0;

    // Show the matching panel
    var panel = document.getElementById('panel-' + tab.dataset.panel);
    if (panel) panel.classList.add('active');
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { activateTab(tab); });

    // Arrow-key / Home / End navigation within the tablist (ARIA pattern)
    tab.addEventListener('keydown', function (e) {
      var idx = arr.indexOf(tab);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        var next = arr[(idx + 1) % arr.length];
        activateTab(next);
        next.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = arr[(idx - 1 + arr.length) % arr.length];
        activateTab(prev);
        prev.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        activateTab(arr[0]);
        arr[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        activateTab(arr[arr.length - 1]);
        arr[arr.length - 1].focus();
      }
    });
  });
}

// Roadmap nodes — clicking navigates to and expands the matching timeline entry
function initRoadmapNodes() {
  var nodes = document.querySelectorAll('.roadmap-node[data-phase]');

  function flashTlNode(tlNode) {
    // Remove the class first so re-triggering restarts the animation
    tlNode.classList.remove('flash');
    // Force reflow so the browser re-applies the animation
    void tlNode.offsetWidth;
    tlNode.classList.add('flash');
    setTimeout(function () { tlNode.classList.remove('flash'); }, 1300);
  }

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

      // Scroll into view after the max-height transition completes (420ms),
      // then flash-highlight on arrival.
      setTimeout(function () {
        tlNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        flashTlNode(tlNode);
      }, 460);
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

  // Mark the current in-progress phase (F3) as active on load
  var currentNode = document.querySelector('.roadmap-node.current[data-phase]');
  if (currentNode) {
    nodes.forEach(function (n) { n.classList.remove('active'); });
    currentNode.classList.add('active');
  }
}

window.addEventListener('load', function () {
  initTimeline();
  initComponentTabs();
  initRoadmapNodes();
});
