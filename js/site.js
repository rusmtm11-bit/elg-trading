(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');

  // hide tracking parameters (utm_*, e.g. ?utm_source=chatgpt.com) from the address bar
  try {
    var params = new URLSearchParams(window.location.search);
    var changed = false;
    Array.from(params.keys()).forEach(function (k) {
      if (/^utm_/i.test(k)) { params.delete(k); changed = true; }
    });
    if (changed && window.history && history.replaceState) {
      var qs = params.toString();
      history.replaceState(history.state, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
    }
  } catch (e) { /* old browser: leave URL as is */ }

  // mobile menu
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // enquiry form -> opens the visitor's mail client addressed to the company
  var form = document.getElementById('enquiry');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var subject = 'Enquiry: ' + (d.get('division') || 'General') + ' — ' + (d.get('company') || d.get('name'));
      var body = [
        'Name: ' + d.get('name'),
        'Company: ' + d.get('company'),
        'Email: ' + d.get('email'),
        'Country: ' + d.get('country'),
        'Product line: ' + d.get('division'),
        '',
        d.get('message')
      ].join('\n');
      window.location.href = 'mailto:info@elg-trading.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
