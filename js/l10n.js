!(function (exports) {
  'use strict';

  const L10n = {
    _: {
      currentLanguage: 'en-US'
    },
    translations: {},
    defaultLanguage: 'en-US',
    availableLanguages: ['en-US'],

    get currentLanguage () {
      return this._.currentLanguage;
    },
    set currentLanguage (locale) {
      this._.currentLanguage = locale;
      this.loadLocalization();
    },

    RTL_LANGUAGES: ['ar', 'he', 'iw', 'fa', 'ur', 'ku', 'ps', 'sd', 'dv'],

    init: function () {
      if ('Settings' in window) {
        Settings.getValue('general.lang.code').then(this.handleLanguage.bind(this));
        Settings.addObserver('general.lang.code', this.handleLanguage.bind(this));
      } else {
        if (L10n.availableLanguages.includes(navigator.language)) {
          L10n.setLocale(navigator.language);
        } else {
          L10n.setLocale('en-US');
        }
      }
    },

    handleLanguage: function (value) {
      L10n.setLocale(value);
    },

    loadJsonFile: function () {
      fetch(href)
        .then((response) => response.json())
        .then((data) => {
          const lang = this._.currentLanguage;
          this.translations[lang] = this.translations[lang] || {};
          Object.assign(this.translations[lang], data);

          if (data.default) {
            this.defaultLanguage = lang;
          }

          if (!this.availableLanguages.includes(lang)) {
            this.availableLanguages.push(lang);
          }

          // Automatically translate elements after loading translations
          this.translateElements();

          // Determine text direction based on language
          const isRTL = this.RTL_LANGUAGES.includes(lang);
          document.dir = isRTL ? 'rtl' : 'ltr';
        })
        .catch((error) => {
          console.error(`Error loading localization data from ${href}:`, error);
        });
    },

    loadPropertiesFile: function (href) {
      fetch(href)
        .then((response) => response.text())
        .then((data) => {
          const lines = data.split('\n');
          const translations = {};

          lines.forEach((line) => {
            const [key, value] = line.split('=');
            if (key && value) {
              translations[key.trim()] = value.trim();
            }
          });

          const lang = this._.currentLanguage;
          this.translations[lang] = this.translations[lang] || {};
          Object.assign(this.translations[lang], translations);

          // Automatically translate elements after loading translations
          this.translateElements();

          // Determine text direction based on language
          const isRTL = this.RTL_LANGUAGES.includes(lang);
          document.dir = isRTL ? 'rtl' : 'ltr';
        })
        .catch((error) => {
          console.error(`Error loading properties data from ${href}:`, error);
        });
    },

    observeLocalizationChanges: function () {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if ((mutation.type === 'childList' && mutation.addedNodes.length > 0) || (mutation.type === 'attributes' && mutation.attributeName.startsWith('data-l10n'))) {
            this.translateElements();
          }
        }
      });

      const config = { childList: true, attributes: true, subtree: true };
      observer.observe(document, config);
    },

    loadLocalization: function () {
      const links = document.querySelectorAll('link[rel="localization"]');
      links.forEach((link) => {
        let href = link.getAttribute('href');
        href = href.replace('{locale}', this._.currentLanguage || '');

        if (href.endsWith('.json')) {
          // Handle JSON files
          this.loadJsonFile(href);
        } else if (href.endsWith('.properties')) {
          // Handle properties files
          this.loadPropertiesFile(href);
        } else {
          console.error('Unsupported file format');
        }
      });

      this.observeLocalizationChanges();
    },

    setLocale: function (locale) {
      this._.currentLanguage = locale;
      this.loadLocalization();
    },

    getTranslation: function (lang) {
      lang = lang || this.defaultLanguage || 'en-US';

      return {
        _: (key, data = {}) => {
          const translations = this.translations[lang];
          if (!translations) {
            console.warn(`Failed to find L10n locale in ${lang}: ${key}`);
            return `[${key}]`;
          }

          const translation = translations[key];
          if (!translation) {
            console.warn(`Failed to find L10n locale in ${lang}: ${key}`);
            return `[${key}]`;
          }

          if (data.count !== undefined) {
            const pluralForm = this.getPluralForm(data.count);
            const translationPlural = this.translations[lang][`${key}[${pluralForm}]`];
            const translationOther = this.translations[lang][`${key}[other]`];
            const pluralTranslation = translationPlural || translationOther;
            return this.interpolate(pluralTranslation.replace('{[count]}', this.localizeNumber(lang, data.count)), data);
          } else {
            return this.interpolate(translation, data);
          }
        },
        ngettext: (key, count, data = {}) => {
          const translation = this.translations[lang][key];
          if (!translation) {
            console.warn(`Failed to find L10n locale in ${lang}: ${key}`);
            return `[${key}]`;
          }
          const pluralForm = this.getPluralForm(count);
          const pluralTranslation = translation[pluralForm] || translation.other;
          return this.interpolate(pluralTranslation.replace('{[count]}', this.localizeNumber(lang, count)), data);
        }
      };
    },

    get: function (key, data) {
      return this.getTranslation(this.currentLanguage)._(key, data);
    },

    interpolate: function (text, data) {
      return text.replace(/\{\{(\w+)\}\}/g, (match, placeholder) => {
        if (data.hasOwnProperty(placeholder)) {
          return data[placeholder];
        }
        return match;
      });
    },

    getPluralForm: function (count) {
      let plural = '';
      if (count === 0) {
        plural = 'zero';
      } else if (count === 1) {
        plural = 'one';
      } else if (count === 2) {
        plural = 'two';
      } else if (count >= 3 && count <= 10) {
        plural = 'few';
      } else if (count > 10 && count <= 100) {
        plural = 'many';
      } else if (count > 100) {
        plural = 'other';
      }
      return plural;
    },

    localizeNumber: function (lang, number) {
      // Replace numbers with Arabic numerals for Arabic language
      if (lang.startsWith('ar')) {
        return number.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
      }
      return number;
    },

    translateElements: function () {
      const elements = document.querySelectorAll('[data-l10n-id]');
      elements.forEach((element) => {
        const l10nId = element.getAttribute('data-l10n-id');
        const l10nArgs = JSON.parse(element.getAttribute('data-l10n-args') || '{}');

        if (l10nId && this.translations[this._.currentLanguage]) {
          if (this.translations[this._.currentLanguage][l10nId]) {
            const translatedText = this.get(l10nId, l10nArgs);
            element.textContent = this.localizeNumber(this.currentLanguage, translatedText);
          }

          ['title', 'ariaLabel', 'placeholder'].forEach((attribute) => {
            if (this.translations[this._.currentLanguage][`${l10nId}.${attribute}`]) {
              const translatedText = this.get(`${l10nId}.${attribute}`, l10nArgs);
              element[attribute] = this.localizeNumber(this.currentLanguage, translatedText);
            }
          });
        }
      });

      const customEvent = new CustomEvent('localized');
      document.dispatchEvent(customEvent);
    }
  };

  // Set up localization on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    L10n.init();
  });

  exports.L10n = L10n;
})(window);
