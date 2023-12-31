!(async function (exports) {
  'use strict';

  const homeElement = document.getElementById('home');
  const pageElement = document.getElementById('page');

  if (location.pathname.startsWith('/article') ||
      location.pathname.startsWith('/about') ||
      location.pathname.startsWith('/post')) {
    homeElement.style.display = 'none';
    const response = await fetch('elements/' + location.pathname + '.html')
    const html = await response.text();
    pageElement.innerHTML = html;
  }
})(window);
