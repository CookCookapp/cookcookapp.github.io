export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'vegetable' | 'meat' | 'seafood' | 'seasoning' | 'grain' | 'dairy' | 'other';
  expiryDate?: Date;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  duration?: number; // in seconds
  ingredients?: string[];
  alert?: boolean; // whether to send notification for this step
}

export interface Recipe {
  id: string;
  name: string;
  nameKo: string;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  cookingTime: number; // in minutes
  servings: number;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  steps: RecipeStep[];
  image?: string;
  description: string;
  matchPercentage?: number; // percentage of ingredients user has
}

export interface CookingSession {
  recipeId: string;
  recipeName: string;
  currentStep: number;
  startTime: Date;
  estimatedEndTime: Date;
  isPaused: boolean;
  notifications: CookingNotification[];
}

export interface CookingNotification {
  id: string;
  stepNumber: number;
  message: string;
  time: Date;
  shown: boolean;
}

export type ViewMode = 'dashboard' | 'recommend' | 'search' | 'cooking' | 'ai-recommend';
