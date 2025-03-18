
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'es' | 'fr';

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

// Translations for various languages
const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.title': 'Medical Guidance Assistant',
    'app.title.short': 'Medical Guide',
    'app.welcome': 'Welcome',
    'app.signin': 'Sign In',
    'app.footer.disclaimer': 'This application is for informational purposes only and is not a substitute for professional medical advice.',
    'app.footer.emergency': 'Always call emergency services for serious medical situations.',
    'emergency.input.placeholder': 'Describe the emergency specifically (e.g., \'person unconscious after fall\' or \'child choking on food\')',
    'emergency.button.get': 'Get Specific First Aid Steps',
    'emergency.button.loading': 'Getting guidance...',
    'emergency.button.speak': 'Speak Emergency',
    'emergency.button.listening': 'Listening...',
    'emergency.guidance.title': 'Emergency Guidance',
    'emergency.guidance.important': 'Important:',
    'emergency.guidance.call': 'Call emergency services if the situation is serious',
    'emergency.guidance.speak': 'Speak Instructions',
    'emergency.guidance.stop': 'Stop Speaking',
    'emergency.guidance.new': 'New Search',
    'follow.up.title': 'Can You Provide More Details?',
    'follow.up.help': 'Answering these questions will help us provide more accurate guidance for this emergency:',
    'follow.up.submit': 'Submit Additional Information',
    'follow.up.skip': 'Skip Questions',
    'sidebar.title': 'Search History',
    'sidebar.empty': 'No history available',
    'sidebar.medical.portal': 'Medical Portal',
  },
  es: {
    'app.title': 'Asistente de Guía Médica',
    'app.title.short': 'Guía Médica',
    'app.welcome': 'Bienvenido',
    'app.signin': 'Iniciar Sesión',
    'app.footer.disclaimer': 'Esta aplicación es solo para fines informativos y no sustituye el consejo médico profesional.',
    'app.footer.emergency': 'Llame siempre a los servicios de emergencia en situaciones médicas graves.',
    'emergency.input.placeholder': 'Describa la emergencia específicamente (por ejemplo, \'persona inconsciente después de una caída\' o \'niño atragantándose con comida\')',
    'emergency.button.get': 'Obtener Pasos Específicos de Primeros Auxilios',
    'emergency.button.loading': 'Obteniendo guía...',
    'emergency.button.speak': 'Hablar Emergencia',
    'emergency.button.listening': 'Escuchando...',
    'emergency.guidance.title': 'Guía de Emergencia',
    'emergency.guidance.important': 'Importante:',
    'emergency.guidance.call': 'Llame a los servicios de emergencia si la situación es grave',
    'emergency.guidance.speak': 'Hablar Instrucciones',
    'emergency.guidance.stop': 'Detener Habla',
    'emergency.guidance.new': 'Nueva Búsqueda',
    'follow.up.title': '¿Puede Proporcionar Más Detalles?',
    'follow.up.help': 'Responder a estas preguntas nos ayudará a proporcionar una orientación más precisa para esta emergencia:',
    'follow.up.submit': 'Enviar Información Adicional',
    'follow.up.skip': 'Omitir Preguntas',
    'sidebar.title': 'Historial de Búsquedas',
    'sidebar.empty': 'No hay historial disponible',
    'sidebar.medical.portal': 'Portal Médico',
  },
  fr: {
    'app.title': 'Assistant de Guide Médical',
    'app.title.short': 'Guide Médical',
    'app.welcome': 'Bienvenue',
    'app.signin': 'Se Connecter',
    'app.footer.disclaimer': 'Cette application est uniquement à titre informatif et ne remplace pas les conseils médicaux professionnels.',
    'app.footer.emergency': 'Appelez toujours les services d\'urgence pour les situations médicales graves.',
    'emergency.input.placeholder': 'Décrivez l\'urgence spécifiquement (par exemple, \'personne inconsciente après une chute\' ou \'enfant s\'étouffant avec de la nourriture\')',
    'emergency.button.get': 'Obtenir des Étapes Spécifiques de Premiers Secours',
    'emergency.button.loading': 'Obtention de conseils...',
    'emergency.button.speak': 'Parler d\'Urgence',
    'emergency.button.listening': 'Écoute...',
    'emergency.guidance.title': 'Guide d\'Urgence',
    'emergency.guidance.important': 'Important:',
    'emergency.guidance.call': 'Appelez les services d\'urgence si la situation est grave',
    'emergency.guidance.speak': 'Énoncer les Instructions',
    'emergency.guidance.stop': 'Arrêter de Parler',
    'emergency.guidance.new': 'Nouvelle Recherche',
    'follow.up.title': 'Pouvez-vous Fournir Plus de Détails?',
    'follow.up.help': 'Répondre à ces questions nous aidera à fournir des conseils plus précis pour cette urgence:',
    'follow.up.submit': 'Soumettre des Informations Supplémentaires',
    'follow.up.skip': 'Ignorer les Questions',
    'sidebar.title': 'Historique de Recherche',
    'sidebar.empty': 'Aucun historique disponible',
    'sidebar.medical.portal': 'Portail Médical',
  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);
