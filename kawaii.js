/* ═══════════════════════════════════════════════════════════
   KAWAII DESIGN SYSTEM  ·  v1.0  ·  JavaScript Framework
   No dependencies – works with kawaii.css
   ═══════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  /* ─── COLOR UTILITIES ──────────────────────────────────── */

  function hexRgb(hex) {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
  }

  function relLum(r, g, b) {
    return [r, g, b].reduce(function (acc, c, i) {
      var s = c / 255;
      var lin = s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      return acc + lin * [0.2126, 0.7152, 0.0722][i];
    }, 0);
  }

  function contrastText(hex) {
    var rgb = hexRgb(hex);
    return relLum(rgb[0], rgb[1], rgb[2]) > 0.179 ? '#1a1a1a' : '#ffffff';
  }

  function lighten(hex, t) {
    var rgb = hexRgb(hex);
    return '#' + rgb.map(function (v) {
      return Math.round(v + (255 - v) * t).toString(16).padStart(2, '0');
    }).join('');
  }

  function darken(hex, t) {
    var rgb = hexRgb(hex);
    return '#' + rgb.map(function (v) {
      return Math.round(v * (1 - t)).toString(16).padStart(2, '0');
    }).join('');
  }

  function blend(h1, h2, t) {
    var a = hexRgb(h1), b = hexRgb(h2);
    return '#' + a.map(function (v, i) {
      return Math.round(v * (1 - t) + b[i] * t).toString(16).padStart(2, '0');
    }).join('');
  }

  /* ─── PALETTE COMBINATIONS ─────────────────────────────── */
  /* Each triplet: [primary, secondary, surface] */

  var PALETTE_COMBOS = [
    ['#4B6E6F', '#D39180', '#F6F8F7'],
    ['#4B6E6F', '#DCC26E', '#EEEBE5'],
    ['#72AAA4', '#F1E489', '#F6F8F7'],
    ['#D39180', '#72AAA4', '#EEEBE5'],
    ['#DCC26E', '#CCD4D1', '#F6F8F7'],
    ['#71808D', '#EBD1DE', '#F4E6EF'],
    ['#71808D', '#D4EBED', '#DEDEE0'],
    ['#93C1D8', '#AA9AA2', '#DEDEE0'],
    ['#95BCCE', '#C3B9BF', '#F4E6EF'],
    ['#96AFB8', '#E2B6C7', '#F6F8F7'],
    ['#CC5682', '#D4EBED', '#F4E6EF'],
    ['#CC5682', '#CCD4D1', '#EEEBE5'],
    ['#A64E68', '#D4EBED', '#F6F8F7'],
    ['#A64E68', '#EBD1DE', '#F4E6EF'],
    ['#633F40', '#CCD4D1', '#F4E9B2'],
    ['#633F40', '#D4EBED', '#EEEBE5'],
    ['#826669', '#93C1D8', '#DEDEE0'],
    ['#826669', '#D4EBED', '#F4E6EF'],
    ['#B9718B', '#72AAA4', '#F6F8F7'],
    ['#B9718B', '#CCD4D1', '#EEEBE5'],
    ['#A64E68', '#72AAA4', '#F6F8F7'],
    ['#CC5682', '#72AAA4', '#EEEBE5'],
    ['#4B6E6F', '#E2B6C7', '#F4E6EF'],
    ['#4B6E6F', '#EBD1DE', '#F6F8F7'],
    ['#71808D', '#DEA0B7', '#F4E6EF'],
    ['#71808D', '#E2B6C7', '#EEEBE5'],
    ['#D39180', '#95BCCE', '#F6F8F7'],
    ['#D39180', '#71808D', '#EEEBE5'],
    ['#DCC26E', '#826669', '#F6F8F7'],
    ['#DCC26E', '#4B6E6F', '#DEDEE0'],
    ['#96AFB8', '#D1809A', '#F4E6EF'],
    ['#95BCCE', '#D39180', '#F4E9B2'],
    ['#93C1D8', '#B9718B', '#F6F8F7'],
    ['#AA9AA2', '#72AAA4', '#F4E9B2'],
    ['#C3B9BF', '#4B6E6F', '#D4EBED'],
    ['#D1809A', '#71808D', '#D4EBED'],
    ['#DEA0B7', '#96AFB8', '#F6F8F7'],
    ['#C498A8', '#72AAA4', '#DEDEE0'],
    ['#72AAA4', '#EBD1DE', '#F4E9B2'],
    ['#CC5682', '#4B6E6F', '#F4E9B2'],
  ];

  /* ─── THEME BUILDER ────────────────────────────────────── */

  function buildTheme(primary, secondary, surface) {
    var pr = hexRgb(primary);
    var invHex = darken(primary, 0.52);
    var ir = hexRgb(invHex);
    var primaryContainer    = lighten(primary, 0.72);
    var onPrimary           = contrastText(primary);
    var onPrimaryContainer  = darken(primary, 0.42);
    var secondaryContainer    = lighten(secondary, 0.72);
    var onSecondary           = contrastText(secondary);
    var onSecondaryContainer  = darken(secondary, 0.42);
    var tertiary              = blend(primary, secondary, 0.5);
    var tertiaryContainer     = lighten(tertiary, 0.72);
    var onTertiary            = contrastText(tertiary);
    var onTertiaryContainer   = darken(tertiary, 0.42);
    var onSurface             = contrastText(surface);
    var surfaceVariant        = blend(surface, primary, 0.12);
    var onSurfaceVariant      = darken(primary, 0.28);
    var background            = lighten(surface, 0.08);
    var outline               = blend(primary, surface, 0.62);
    var outlineVariant        = lighten(primary, 0.80);
    var surfaceLowest         = lighten(surface, 0.25);
    var surfaceLow            = lighten(surface, 0.15);
    var surfaceContainer      = primaryContainer;
    var surfaceHigh           = lighten(primary, 0.55);
    var surfaceHighest        = lighten(primary, 0.35);
    var inverseSurface        = invHex;
    var inverseOnSurface      = lighten(surface, 0.12);
    var inversePrimary        = lighten(primary, 0.48);
    var darkBg                = darken(primary, 0.84);
    var darkSurface           = darken(primary, 0.77);

    return {
      '--k-primary':                  primary,
      '--k-on-primary':               onPrimary,
      '--k-primary-container':        primaryContainer,
      '--k-on-primary-container':     onPrimaryContainer,
      '--k-secondary':                secondary,
      '--k-on-secondary':             onSecondary,
      '--k-secondary-container':      secondaryContainer,
      '--k-on-secondary-container':   onSecondaryContainer,
      '--k-tertiary':                 tertiary,
      '--k-on-tertiary':              onTertiary,
      '--k-tertiary-container':       tertiaryContainer,
      '--k-on-tertiary-container':    onTertiaryContainer,
      '--k-error':                    '#c62828',
      '--k-on-error':                 '#ffffff',
      '--k-error-container':          '#ffebee',
      '--k-on-error-container':       '#b71c1c',
      '--k-surface':                  surface,
      '--k-on-surface':               onSurface,
      '--k-surface-variant':          surfaceVariant,
      '--k-on-surface-variant':       onSurfaceVariant,
      '--k-outline':                  outline,
      '--k-outline-variant':          outlineVariant,
      '--k-background':               background,
      '--k-on-background':            onSurface,
      '--k-surface-lowest':           surfaceLowest,
      '--k-surface-low':              surfaceLow,
      '--k-surface-container':        surfaceContainer,
      '--k-surface-high':             surfaceHigh,
      '--k-surface-highest':          surfaceHighest,
      '--k-inverse-surface':          inverseSurface,
      '--k-inverse-on-surface':       inverseOnSurface,
      '--k-inverse-primary':          inversePrimary,
      '--k-scrim':                    'rgba(' + ir[0] + ',' + ir[1] + ',' + ir[2] + ',0.4)',
      '--k-elev-0': 'none',
      '--k-elev-1': '0 1px 3px rgba(' + pr[0] + ',' + pr[1] + ',' + pr[2] + ',.12),0 1px 2px rgba(' + pr[0] + ',' + pr[1] + ',' + pr[2] + ',.08)',
      '--k-elev-2': '0 2px 8px rgba(' + pr[0] + ',' + pr[1] + ',' + pr[2] + ',.14),0 1px 4px rgba(' + pr[0] + ',' + pr[1] + ',' + pr[2] + ',.10)',
      '--k-elev-3': '0 4px 16px rgba(' + pr[0] + ',' + pr[1] + ',' + pr[2] + ',.18),0 2px 8px rgba(' + pr[0] + ',' + pr[1] + ',' + pr[2] + ',.12)',
      '--k-elev-4': '0 6px 24px rgba(' + pr[0] + ',' + pr[1] + ',' + pr[2] + ',.22),0 4px 12px rgba(' + pr[0] + ',' + pr[1] + ',' + pr[2] + ',.14)',
      '--k-elev-5': '0 8px 40px rgba(' + pr[0] + ',' + pr[1] + ',' + pr[2] + ',.28),0 4px 16px rgba(' + pr[0] + ',' + pr[1] + ',' + pr[2] + ',.16)',
    };
  }

  /* ─── APPLY THEME ──────────────────────────────────────── */

  function applyTheme(primary, secondary, surface) {
    var vars = buildTheme(primary, secondary, surface);
    var root = document.documentElement;
    // enable smooth transitions
    document.body.classList.add('k-theme-transition');
    Object.keys(vars).forEach(function (k) {
      root.style.setProperty(k, vars[k]);
    });
    setTimeout(function () {
      document.body.classList.remove('k-theme-transition');
    }, 500);
    // update shuffle chip
    updatePaletteChip([primary, secondary, surface]);
  }

  /* ─── SHUFFLE FAB ──────────────────────────────────────── */

  var _lastCombo = null;

  function updatePaletteChip(combo) {
    var chip = document.getElementById('k-palette-chip');
    if (!chip) return;
    chip.innerHTML = '';
    combo.forEach(function (c) {
      var dot = document.createElement('div');
      dot.className = 'k-swatch';
      dot.style.background = c;
      chip.appendChild(dot);
    });
    var label = document.createElement('span');
    label.textContent = 'Aktive Palette';
    chip.appendChild(label);
    chip.classList.add('is-visible');
  }

  function injectShuffleFab() {
    if (document.querySelector('[data-kawaii-no-shuffle]')) return;
    if (document.getElementById('k-shuffle-fab')) return;
    var wrap = document.createElement('div');
    wrap.id = 'k-shuffle-fab';
    wrap.innerHTML =
      '<div id="k-palette-chip"></div>' +
      '<button id="k-shuffle-btn" title="Zufällige Farbpalette" aria-label="Shuffle Palette">&#x21C4;</button>';
    document.body.appendChild(wrap);
    document.getElementById('k-shuffle-btn').addEventListener('click', function () {
      Kawaii.shuffle();
    });
  }

  /* ─── RIPPLE ───────────────────────────────────────────── */

  function addRipple(el, event) {
    var rect = el.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 2;
    var x = (event.clientX - rect.left) - size / 2;
    var y = (event.clientY - rect.top) - size / 2;
    var ripple = document.createElement('span');
    ripple.className = 'k-ripple';
    var isLight = (el.style.background || getComputedStyle(el).backgroundColor).includes('255,255,255')
      || el.classList.contains('k-btn--outlined')
      || el.classList.contains('k-btn--text')
      || el.classList.contains('k-btn--elevated');
    ripple.style.cssText = [
      'width:' + size + 'px',
      'height:' + size + 'px',
      'left:' + x + 'px',
      'top:' + y + 'px',
      'background:' + (isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.25)'),
    ].join(';');
    el.appendChild(ripple);
    ripple.addEventListener('animationend', function () { ripple.remove(); });
  }

  function initRipples() {
    var sel = '.k-btn,.k-fab,.k-icon-btn,.k-chip,.k-tab,.k-nav-item,.k-list-item';
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.dataset.rippleInit) return;
      el.dataset.rippleInit = '1';
      el.classList.add('k-ripple-host');
      el.addEventListener('click', function (e) { addRipple(el, e); });
    });
  }

  /* ─── DIALOG ───────────────────────────────────────────── */

  function initDialogs() {
    // open: data-dialog-open="dialog-id"
    document.querySelectorAll('[data-dialog-open]').forEach(function (trigger) {
      if (trigger.dataset.dialogInit) return;
      trigger.dataset.dialogInit = '1';
      trigger.addEventListener('click', function () {
        Kawaii.openDialog(trigger.dataset.dialogOpen);
      });
    });
    // close: data-dialog-close (any button inside backdrop)
    document.querySelectorAll('[data-dialog-close]').forEach(function (btn) {
      if (btn.dataset.dialogInit) return;
      btn.dataset.dialogInit = '1';
      btn.addEventListener('click', function () {
        var backdrop = btn.closest('.k-dialog-backdrop');
        if (backdrop) backdrop.classList.remove('is-open');
      });
    });
    // close on backdrop click
    document.querySelectorAll('.k-dialog-backdrop').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.target === el) el.classList.remove('is-open');
      });
    });
    // close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.k-dialog-backdrop.is-open').forEach(function (el) {
          el.classList.remove('is-open');
        });
      }
    });
  }

  /* ─── MENU ─────────────────────────────────────────────── */

  function initMenus() {
    document.querySelectorAll('[data-menu-toggle]').forEach(function (trigger) {
      if (trigger.dataset.menuInit) return;
      trigger.dataset.menuInit = '1';
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var menu = document.getElementById(trigger.dataset.menuToggle);
        if (!menu) return;
        var isOpen = menu.classList.contains('is-open');
        // close all menus
        document.querySelectorAll('.k-menu.is-open').forEach(function (m) { m.classList.remove('is-open'); });
        if (!isOpen) menu.classList.add('is-open');
      });
    });
    // close on outside click
    document.addEventListener('click', function () {
      document.querySelectorAll('.k-menu.is-open').forEach(function (m) { m.classList.remove('is-open'); });
    });
    // prevent menu clicks from closing
    document.querySelectorAll('.k-menu').forEach(function (menu) {
      menu.addEventListener('click', function (e) { e.stopPropagation(); });
    });
  }

  /* ─── TABS ─────────────────────────────────────────────── */

  function initTabs() {
    document.querySelectorAll('.k-tabs').forEach(function (tabBar) {
      if (tabBar.dataset.tabsInit) return;
      tabBar.dataset.tabsInit = '1';
      var tabs = tabBar.querySelectorAll('.k-tab');
      var panelGroup = tabBar.dataset.tabsGroup;
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          // deactivate all
          tabs.forEach(function (t) {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
          });
          // activate clicked
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');
          // switch panels if group defined
          if (panelGroup) {
            var panels = document.querySelectorAll('[data-tabs-group="' + panelGroup + '"]');
            panels.forEach(function (p) { p.hidden = true; });
            var target = document.getElementById(tab.dataset.tabTarget);
            if (target) target.hidden = false;
          }
        });
      });
    });
  }

  /* ─── NAV BAR / RAIL ────────────────────────────────────── */

  function initNavigation() {
    var selectors = ['.k-nav-bar', '.k-nav-rail', '.k-nav-drawer'];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (nav) {
        if (nav.dataset.navInit) return;
        nav.dataset.navInit = '1';
        var items = nav.querySelectorAll('.k-nav-item');
        items.forEach(function (item) {
          item.addEventListener('click', function () {
            items.forEach(function (i) {
              i.classList.remove('is-active');
              i.setAttribute('aria-selected', 'false');
            });
            item.classList.add('is-active');
            item.setAttribute('aria-selected', 'true');
          });
        });
      });
    });
  }

  /* ─── SNACKBAR ─────────────────────────────────────────── */

  var _snackQueue = [];
  var _snackBusy = false;
  var _snackEl = null;

  function getSnackEl() {
    if (_snackEl) return _snackEl;
    _snackEl = document.getElementById('k-snackbar');
    if (!_snackEl) {
      _snackEl = document.createElement('div');
      _snackEl.id = 'k-snackbar';
      _snackEl.className = 'k-snackbar';
      document.body.appendChild(_snackEl);
    }
    return _snackEl;
  }

  function processSnackQueue() {
    if (_snackBusy || _snackQueue.length === 0) return;
    _snackBusy = true;
    var item = _snackQueue.shift();
    var el = getSnackEl();
    el.innerHTML = '<span>' + item.message + '</span>';
    if (item.action) {
      var btn = document.createElement('button');
      btn.className = 'k-snackbar-action';
      btn.textContent = item.action;
      if (item.onAction) btn.addEventListener('click', item.onAction);
      el.appendChild(btn);
    }
    el.classList.add('is-visible');
    setTimeout(function () {
      el.classList.remove('is-visible');
      setTimeout(function () {
        _snackBusy = false;
        processSnackQueue();
      }, 350);
    }, item.duration || 3000);
  }

  /* ─── FLOATING LABEL POLYFILL ───────────────────────────── */
  /* Ensures labels float correctly when fields have autofill values */

  function initFloatingLabels() {
    document.querySelectorAll('.k-field input, .k-field textarea').forEach(function (input) {
      if (input.dataset.labelInit) return;
      input.dataset.labelInit = '1';
      // force placeholder so CSS :not(:placeholder-shown) works
      if (!input.placeholder) input.placeholder = ' ';
    });
  }

  /* ─── SWITCH ACCESSIBILITY ──────────────────────────────── */

  function initSwitches() {
    document.querySelectorAll('.k-switch-wrap input').forEach(function (input) {
      if (input.dataset.switchInit) return;
      input.dataset.switchInit = '1';
      input.addEventListener('change', function () {
        var wrap = input.closest('.k-switch-wrap');
        if (wrap) wrap.setAttribute('aria-checked', input.checked ? 'true' : 'false');
      });
    });
  }

  /* ─── SEGMENTED BUTTON ──────────────────────────────────── */

  function initSegmented() {
    document.querySelectorAll('.k-segmented').forEach(function (seg) {
      if (seg.dataset.segInit) return;
      seg.dataset.segInit = '1';
      var btns = seg.querySelectorAll('.k-segmented-btn');
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          btns.forEach(function (b) {
            b.classList.remove('is-active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-pressed', 'true');
        });
      });
    });
  }

  /* ─── SLIDER VALUE DISPLAY ──────────────────────────────── */

  function initSliders() {
    document.querySelectorAll('.k-slider').forEach(function (slider) {
      if (slider.dataset.sliderInit) return;
      slider.dataset.sliderInit = '1';
      var valueDisplay = slider.closest('.k-slider-wrap') &&
        slider.closest('.k-slider-wrap').querySelector('.k-slider-value');
      if (valueDisplay) {
        valueDisplay.textContent = slider.value;
        slider.addEventListener('input', function () {
          valueDisplay.textContent = slider.value;
        });
      }
      // fill track
      function updateTrack() {
        var pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background =
          'linear-gradient(to right, var(--k-primary) ' + pct + '%, var(--k-surface-high) ' + pct + '%)';
      }
      updateTrack();
      slider.addEventListener('input', updateTrack);
    });
  }

  /* ─── PROGRESS HELPER ───────────────────────────────────── */

  function setProgress(el, value) {
    var bar = el.querySelector('.k-progress-bar');
    if (bar) {
      bar.style.width = Math.max(0, Math.min(100, value)) + '%';
      el.classList.remove('k-progress--indeterminate');
    }
  }

  /* ─── CIRCULAR SPINNER BUILDER ──────────────────────────── */

  function makeSpinner(size, indeterminate) {
    var sz = size || 40;
    var r = (sz - 8) / 2;
    var circ = 2 * Math.PI * r;
    var el = document.createElement('div');
    el.className = 'k-spinner' + (indeterminate ? ' k-spinner--indeterminate' : '');
    el.style.width = sz + 'px';
    el.style.height = sz + 'px';
    el.innerHTML =
      '<svg viewBox="0 0 ' + sz + ' ' + sz + '">' +
      '<circle cx="' + sz / 2 + '" cy="' + sz / 2 + '" r="' + r + '" ' +
      'stroke-width="4" stroke-dasharray="' + circ + '" stroke-dashoffset="' + circ * 0.25 + '"/>' +
      '</svg>';
    return el;
  }

  /* ─── INIT ──────────────────────────────────────────────── */

  function init() {
    injectShuffleFab();
    initRipples();
    initDialogs();
    initMenus();
    initTabs();
    initNavigation();
    initFloatingLabels();
    initSwitches();
    initSegmented();
    initSliders();
  }

  /* ─── PUBLIC API ────────────────────────────────────────── */

  var Kawaii = {

    /** Apply a specific theme from 3 hex colors */
    setTheme: function (primary, secondary, surface) {
      applyTheme(primary, secondary, surface);
      _lastCombo = [primary, secondary, surface];
    },

    /** Pick a random palette combination and apply it */
    shuffle: function () {
      var combo = PALETTE_COMBOS[Math.floor(Math.random() * PALETTE_COMBOS.length)];
      _lastCombo = combo;
      applyTheme(combo[0], combo[1], combo[2]);
      return combo;
    },

    /** Get all 40 palette combinations */
    getPalette: function () { return PALETTE_COMBOS.slice(); },

    /** Get the currently active combo */
    getActiveCombo: function () { return _lastCombo; },

    /** Open a dialog by its backdrop element ID */
    openDialog: function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('is-open');
    },

    /** Close a dialog by its backdrop element ID */
    closeDialog: function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove('is-open');
    },

    /** Show a snackbar notification */
    showSnack: function (message, options) {
      var opts = options || {};
      _snackQueue.push({
        message: message,
        action: opts.action || null,
        onAction: opts.onAction || null,
        duration: opts.duration || 3000,
      });
      processSnackQueue();
    },

    /** Create a ripple on a click event */
    ripple: addRipple,

    /** Set a linear progress bar value (0–100) */
    setProgress: setProgress,

    /** Create a circular spinner element */
    makeSpinner: makeSpinner,

    /** Re-run all component initialization (call after dynamic DOM changes) */
    reinit: init,

    /* Expose color utilities */
    color: { hexRgb: hexRgb, contrastText: contrastText, lighten: lighten, darken: darken, blend: blend },
  };

  /* ─── BOOT ──────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.Kawaii = Kawaii;

})(window);
