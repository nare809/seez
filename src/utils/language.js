/**
 * Language utility functions for the application
 */

// Available languages
export const AVAILABLE_LANGUAGES = {
  'en': { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  'es': { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  'fr': { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  'de': { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  'ja': { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  'ko': { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  'zh': { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  'hi': { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  'te': { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  'ta': { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  'mr': { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  'bn': { name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  'ur': { name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳' },
  'gu': { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
};

/**
 * Get the current application language
 * @returns {string} The language code (e.g., 'en', 'es')
 */
export const getCurrentLanguage = () => {
  return localStorage.getItem('app_language') || 'en';
};

/**
 * Set the application language
 * @param {string} languageCode The language code to set
 */
export const setLanguage = (languageCode) => {
  if (AVAILABLE_LANGUAGES[languageCode]) {
    // Store selection in localStorage
    localStorage.setItem('app_language', languageCode);
    
    // Set language for API requests globally
    window.tmdbApiLanguage = languageCode;
    
    // For Indian languages, also set region to India
    if (['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(languageCode)) {
      localStorage.setItem('preferred_region', 'IN');
      
      // Special handling for Indian language movies - show original language content
      localStorage.setItem('show_original_language', 'true');
      
      // Show notification that content will be prioritized in the selected language
      if (languageCode === 'te') {
        // Display Telugu content notification
        window.showLanguageNotification = true;
        window.selectedLanguageName = AVAILABLE_LANGUAGES[languageCode].nativeName;
      }
    } else {
      localStorage.removeItem('preferred_region');
      localStorage.removeItem('show_original_language');
    }
    
    // Log for debugging
    console.log(`Language set to: ${languageCode}`);
    console.log(`TMDB will use: ${languageCode}`);
    console.log(`Original language content: ${shouldShowOriginalLanguageContent()}`);
    
    return true;
  }
  return false;
};

/**
 * Get the name of a language by its code
 * @param {string} languageCode The language code
 * @returns {string} The language name
 */
export const getLanguageName = (languageCode) => {
  return AVAILABLE_LANGUAGES[languageCode]?.nativeName || AVAILABLE_LANGUAGES['en'].nativeName;
};

/**
 * Returns the flag emoji for the given language code
 * @param {string} langCode - The language code
 * @returns {string} The flag emoji
 */
export const getLanguageFlag = (langCode) => {
  const flagMap = {
    'en': '🇺🇸',
    'es': '🇪🇸',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'it': '🇮🇹',
    'pt': '🇵🇹',
    'ru': '🇷🇺',
    'ja': '🇯🇵',
    'zh': '🇨🇳',
    'ko': '🇰🇷',
    'hi': '🇮🇳',
    'te': '🇮🇳',
    'ta': '🇮🇳',
    'mr': '🇮🇳',
    'bn': '🇮🇳',
    'ur': '🇮🇳',
    'gu': '🇮🇳'
  };
  
  return flagMap[langCode] || '🌐';
};

/**
 * Get language parameter for API requests
 * @returns {string} The language parameter for TMDB API
 */
export const getApiLanguageParam = () => {
  // Make sure we get the latest language
  const lang = getCurrentLanguage();
  console.log(`API language param: ${lang}`);
  return lang;
};

/**
 * Checks if the current language should show original language content
 * @returns {boolean} Whether to show original language content
 */
export const shouldShowOriginalLanguageContent = () => {
  return localStorage.getItem('show_original_language') === 'true';
};

/**
 * Gets the preferred region based on language
 * @returns {string} Region code or empty string
 */
export const getPreferredRegion = () => {
  return localStorage.getItem('preferred_region') || '';
}; 