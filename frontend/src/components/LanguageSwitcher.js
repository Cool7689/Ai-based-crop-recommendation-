import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();

  const languageNames = {
    English: 'English',
    Hindi: 'हिंदी',
    Telugu: 'తెలుగు',
    Tamil: 'தமிழ்'
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4 text-gray-600" />
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {languageNames[lang]} ({lang})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
