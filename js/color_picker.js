(function (exports) {
  'use strict';

  function ColorPicker(url, options = {}) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const colors = [];

      useCanvas(canvas, url)
        .then(() => {
          const imageData = canvas
            .getContext('2d')
            .getImageData(0, 0, options.colors || 1, options.colors || 1).data;

          for (let i = 0; i < imageData.length; i += 4) {
            const r =
              imageData[i] +
              parseInt((255 - imageData[i]) * ((options.brightness || 1) - 1));
            const g =
              imageData[i + 1] +
              parseInt(
                (255 - imageData[i + 1]) * ((options.brightness || 1) - 1)
              );
            const b =
              imageData[i + 2] +
              parseInt(
                (255 - imageData[i + 2]) * ((options.brightness || 1) - 1)
              );

            colors.push({ r, g, b });
          }

          if (options.linearGradient !== undefined) {
            resolve(
              'linear-gradient(' +
                options.linearGradient +
                ', ' +
                colors.join(', ') +
                ')'
            );
          } else {
            resolve(colors);
          }
        })
        .catch(reject);
    });

    function useCanvas(element, imageUrl) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
          element.width = image.width;
          element.height = image.height;

          element
            .getContext('2d')
            .drawImage(image, 0, 0, image.width, image.height);

          resolve();
        };

        image.onerror = reject;
      });
    }
  }

  exports.ColorPicker = ColorPicker;
})(window);
