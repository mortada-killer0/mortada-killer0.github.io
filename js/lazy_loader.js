!(function (exports) {
  'use strict';

  !(function (exports) {
    function LazyLoader(assets) {
      assets.forEach((asset) => {
        const extension = asset.split('.').pop().toLowerCase();
        if (extension === 'css') {
          const stylesLink = document.createElement('link');
          stylesLink.rel = 'stylesheet';
          stylesLink.href = asset;
          document.head.appendChild(stylesLink);
        } else if (extension === 'js') {
          const script = document.createElement('script');
          script.src = asset;
          script.async = true;
          document.body.appendChild(script);
        }
      });
    }

    exports.LazyLoader = LazyLoader;
  })(window);
})(window);
