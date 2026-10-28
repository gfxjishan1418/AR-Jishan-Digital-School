import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  isBangla: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('dai_lang');
    return (saved === 'bn' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('dai_lang', lang);
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    if (language === 'bn') {
      document.documentElement.lang = 'bn';
      document.body.classList.add('font-bangla');
    } else {
      document.documentElement.lang = 'en';
      document.body.classList.remove('font-bangla');
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isBangla: language === 'bn' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
