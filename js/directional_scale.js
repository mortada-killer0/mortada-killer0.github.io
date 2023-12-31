!(function (exports) {
  'use strict';

  const DirectionalScale = {
    init: function (element) {
      element.addEventListener('mouseenter', (event) => this.onMouseMove(event, element));
      element.addEventListener('mousemove', (event) => this.onMouseMove(event, element));
      element.addEventListener('mouseleave', (event) => this.onMouseLeave(event, element));
    },

    destroy: function (element) {
      element.removeEventListener('mouseenter', (event) => this.onMouseMove(event, element));
      element.removeEventListener('mousemove', (event) => this.onMouseMove(event, element));
      element.removeEventListener('mouseleave', (event) => this.onMouseLeave(event, element));
    },

    onMouseMove: function (event, element) {
      const box = element.getBoundingClientRect();

      const x = event.clientX - box.x;
      const y = event.clientY - box.y;

      if (event.type === 'mouseenter') {
        element.addEventListener('transitionend', () => this.handleTransitionEnd(element));
      }
      element.style.transformOrigin = `${x}px ${y}px`;
    },

    onMouseLeave: function (event, element) {
      element.style.transformOrigin = 'none';
    },

    handleTransitionEnd: function (element) {
      element.removeEventListener('transitionend', () => this.handleTransitionEnd(element));
    }
  }

  exports.DirectionalScale = DirectionalScale;
})(window);
