// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define translations for multiple languages
const resources = {
  en: {
    translation: {
      "selectIngredients": "Select Ingredients",
      "searchRecipes": "Search Recipes",
      "recipeFound": "Recipe Found",
      "clearAll": "Clear All",
      // Add more translation keys as needed
    },
  },
  es: {
    translation: {
      "selectIngredients": "Seleccionar ingredientes",
      "searchRecipes": "Buscar recetas",
      "recipeFound": "Receta encontrada",
      "clearAll": "Limpiar todo",
      // Add more translation keys for Spanish
    },
  },
  fr: {
    translation: {
      "selectIngredients": "Sélectionner les ingrédients",
      "searchRecipes": "Rechercher des recettes",
      "recipeFound": "Recette trouvée",
      "clearAll": "Tout effacer",
      // Add more translation keys for French
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
