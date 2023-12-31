!(function (exports) {
  'use strict';

  const PageController = {
    previousPanelId: '',
    currentPanelId: '',
    isKeyDown: false,

    UNDRAGGABLE_ELEMENTS: ['A', 'BUTTON', 'INPUT', 'IMG', 'UL', 'LI', 'WEBVIEW'],

    init: function () {
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
      document.addEventListener('keyup', this.handleKeyUp.bind(this));

      const pageButtons = document.querySelectorAll('[data-page-id]');
      pageButtons.forEach((button) => {
        button.addEventListener('click', () => this.handlePageButtonClick(button));
        button.addEventListener('keyup', (event) => {
          if (event.key === 'Enter') {
            this.handlePageButtonClick(button);
          }
        });
      });

      const panels = document.querySelectorAll('[role="panel"]');
      panels.forEach((panel, index) => {
        panel.dataset.index = index;
        panel.classList.add('next');
      });
    },

    handleKeyDown: function (event) {
      if (this.isKeyDown) {
        return;
      }

      if (event.key === 'Escape') {
        const selectedButton = document.querySelector('.selected');
        if (selectedButton) {
          selectedButton.classList.remove('selected');
        }

        if (this.previousPanelId && this.currentPanelId) {
          this.togglePanelVisibility(this.currentPanelId, this.previousPanelId);
          this.isKeyDown = true;
        }
      }
    },

    handleKeyUp: function (event) {
      this.isKeyDown = false;
    },

    handlePageButtonClick: function (button) {
      if ('SpatialNavigation' in window) {
        SpatialNavigation.makeFocusable();
      }

      const id = button.dataset.pageId;
      const selectedButton = document.querySelector('.selected');
      const selectedPanel = document.querySelector('[role="panel"].visible');

      if (selectedButton) {
        selectedButton.classList.remove('selected');
      }
      button.classList.add('selected');

      this.togglePanelVisibility(selectedPanel.id, id);
    },

    togglePanelVisibility: function (selectedPanelId, targetPanelId) {
      if (selectedPanelId !== targetPanelId) {
        console.log(selectedPanelId, targetPanelId);
        this.previousPanelId = selectedPanelId || 'root';
        this.currentPanelId = targetPanelId;
      } else {
        return;
      }

      const selectedPanel = document.getElementById(selectedPanelId);
      const targetPanel = document.getElementById(targetPanelId);
      if (!selectedPanel) {
        return;
      }

      if (targetPanel.dataset.previousPageId) {
        this.previousPanelId = targetPanel.dataset.previousPageId;
      }

      selectedPanel.classList.toggle('visible');
      selectedPanel.classList.toggle('previous', selectedPanel.dataset.index <= targetPanel.dataset.index);
      selectedPanel.classList.toggle('next', selectedPanel.dataset.index >= targetPanel.dataset.index);

      targetPanel.classList.toggle('visible');
      targetPanel.classList.toggle('previous', selectedPanel.dataset.index <= targetPanel.dataset.index);
      targetPanel.classList.toggle('next', selectedPanel.dataset.index >= targetPanel.dataset.index);
    }
  };

  PageController.init();

  exports.PageController = PageController;
})(window);
