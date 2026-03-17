export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  modelUrl: string;
  category: string;
  translatedCategory?: string;
  ingredients: string[];
  allergies: string[];
  nutrition: {
    calories: number;
    protein: string;
    fat: string;
  };
  history?: string;
  translations: {
    [key in Language]: {
      name: string;
      description: string;
      category: string;
      ingredients: string[];
      allergies: string[];
      history?: string;
    };
  };
}

export type Language = 'en' | 'am' | 'ru' | 'tr' | 'fa';

export interface CartItem extends MenuItem {
  quantity: number;
}
