import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  English: {
    // Navigation
    chat: 'Chat',
    dashboard: 'Dashboard',
    profile: 'Profile',
    crops: 'Crops',
    weather: 'Weather',
    market: 'Market',
    logout: 'Logout',
    
    // Chat
    typeMessage: 'Type your message...',
    send: 'Send',
    voiceInput: 'Voice Input',
    voiceOutput: 'Voice Output',
    newChat: 'New Chat',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    phone: 'Phone',
    
    // Farm details
    soilType: 'Soil Type',
    landArea: 'Land Area',
    rainfall: 'Rainfall',
    season: 'Season',
    preferredLanguage: 'Preferred Language'
  },
  
  Hindi: {
    // Navigation
    chat: 'चैट',
    dashboard: 'डैशबोर्ड',
    profile: 'प्रोफाइल',
    crops: 'फसलें',
    weather: 'मौसम',
    market: 'बाजार',
    logout: 'लॉगआउट',
    
    // Chat
    typeMessage: 'अपना संदेश टाइप करें...',
    send: 'भेजें',
    voiceInput: 'आवाज इनपुट',
    voiceOutput: 'आवाज आउटपुट',
    newChat: 'नई चैट',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    
    // Auth
    login: 'लॉगिन',
    register: 'रजिस्टर',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'नाम',
    phone: 'फोन',
    
    // Farm details
    soilType: 'मिट्टी का प्रकार',
    landArea: 'जमीन का क्षेत्र',
    rainfall: 'वर्षा',
    season: 'मौसम',
    preferredLanguage: 'पसंदीदा भाषा'
  },
  
  Telugu: {
    // Navigation
    chat: 'చాట్',
    dashboard: 'డాష్‌బోర్డ్',
    profile: 'ప్రొఫైల్',
    crops: 'పంటలు',
    weather: 'వాతావరణం',
    market: 'మార్కెట్',
    logout: 'లాగ్‌అవుట్',
    
    // Chat
    typeMessage: 'మీ సందేశాన్ని టైప్ చేయండి...',
    send: 'పంపండి',
    voiceInput: 'వాయిస్ ఇన్‌పుట్',
    voiceOutput: 'వాయిస్ అవుట్‌పుట్',
    newChat: 'కొత్త చాట్',
    
    // Common
    loading: 'లోడ్ అవుతోంది...',
    error: 'లోపం',
    success: 'విజయం',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    edit: 'సవరించండి',
    delete: 'తొలగించండి',
    
    // Auth
    login: 'లాగిన్',
    register: 'రిజిస్టర్',
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    name: 'పేరు',
    phone: 'ఫోన్',
    
    // Farm details
    soilType: 'నేల రకం',
    landArea: 'భూమి వైశాల్యం',
    rainfall: 'వర్షపాతం',
    season: 'కాలం',
    preferredLanguage: 'ఇష్టమైన భాష'
  },
  
  Tamil: {
    // Navigation
    chat: 'அரட்டை',
    dashboard: 'டாஷ்போர்டு',
    profile: 'சுயவிவரம்',
    crops: 'பயிர்கள்',
    weather: 'வானிலை',
    market: 'சந்தை',
    logout: 'வெளியேறு',
    
    // Chat
    typeMessage: 'உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...',
    send: 'அனுப்பு',
    voiceInput: 'குரல் உள்ளீடு',
    voiceOutput: 'குரல் வெளியீடு',
    newChat: 'புதிய அரட்டை',
    
    // Common
    loading: 'ஏற்றப்படுகிறது...',
    error: 'பிழை',
    success: 'வெற்றி',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    
    // Auth
    login: 'உள்நுழைவு',
    register: 'பதிவு',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    name: 'பெயர்',
    phone: 'தொலைபேசி',
    
    // Farm details
    soilType: 'மண் வகை',
    landArea: 'நில பரப்பு',
    rainfall: 'மழை',
    season: 'பருவம்',
    preferredLanguage: 'விருப்பமான மொழி'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('English');
  const [translations, setTranslations] = useState(translations.English);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'English';
    setLanguage(savedLanguage);
    setTranslations(translations[savedLanguage] || translations.English);
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setTranslations(translations[newLanguage] || translations.English);
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  const t = (key) => {
    return translations[key] || key;
  };

  const value = {
    language,
    translations,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
