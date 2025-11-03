import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ingredient, Recipe, CookingSession, ViewMode } from '../types';
import { sampleRecipes } from '../data/recipes';

interface AppContextType {
  ingredients: Ingredient[];
  addIngredient: (ingredient: Ingredient) => void;
  updateIngredient: (id: string, ingredient: Partial<Ingredient>) => void;
  removeIngredient: (id: string) => void;
  recipes: Recipe[];
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  cookingSession: CookingSession | null;
  startCooking: (recipe: Recipe) => void;
  stopCooking: () => void;
  nextStep: () => void;
  previousStep: () => void;
  pauseCooking: () => void;
  resumeCooking: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes] = useState<Recipe[]>(sampleRecipes);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [cookingSession, setCookingSession] = useState<CookingSession | null>(null);

  // Load ingredients from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ingredients');
    if (saved) {
      setIngredients(JSON.parse(saved));
    }
  }, []);

  // Save ingredients to localStorage
  useEffect(() => {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  const addIngredient = (ingredient: Ingredient) => {
    setIngredients(prev => [...prev, ingredient]);
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setIngredients(prev =>
      prev.map(ing => (ing.id === id ? { ...ing, ...updates } : ing))
    );
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const startCooking = (recipe: Recipe) => {
    const startTime = new Date();
    const estimatedEndTime = new Date(startTime.getTime() + recipe.cookingTime * 60000);

    const notifications = recipe.steps
      .filter(step => step.alert)
      .map(step => ({
        id: `notif-${recipe.id}-${step.stepNumber}`,
        stepNumber: step.stepNumber,
        message: step.instruction,
        time: new Date(startTime.getTime() + (step.duration || 0) * 1000),
        shown: false,
      }));

    setCookingSession({
      recipeId: recipe.id,
      recipeName: recipe.nameKo,
      currentStep: 0,
      startTime,
      estimatedEndTime,
      isPaused: false,
      notifications,
    });

    setCurrentView('cooking');
    requestNotificationPermission();
  };

  const stopCooking = () => {
    setCookingSession(null);
    setCurrentView('dashboard');
  };

  const nextStep = () => {
    if (!cookingSession) return;
    const recipe = recipes.find(r => r.id === cookingSession.recipeId);
    if (!recipe) return;

    if (cookingSession.currentStep < recipe.steps.length - 1) {
      setCookingSession(prev => prev ? { ...prev, currentStep: prev.currentStep + 1 } : null);
    }
  };

  const previousStep = () => {
    if (!cookingSession) return;
    if (cookingSession.currentStep > 0) {
      setCookingSession(prev => prev ? { ...prev, currentStep: prev.currentStep - 1 } : null);
    }
  };

  const pauseCooking = () => {
    setCookingSession(prev => prev ? { ...prev, isPaused: true } : null);
  };

  const resumeCooking = () => {
    setCookingSession(prev => prev ? { ...prev, isPaused: false } : null);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  return (
    <AppContext.Provider
      value={{
        ingredients,
        addIngredient,
        updateIngredient,
        removeIngredient,
        recipes,
        currentView,
        setCurrentView,
        cookingSession,
        startCooking,
        stopCooking,
        nextStep,
        previousStep,
        pauseCooking,
        resumeCooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
