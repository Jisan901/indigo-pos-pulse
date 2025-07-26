import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  description?: string;
  parentCategoryId?: string;
  subcategories?: Category[];
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

type CategoryAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string };

const CategoryContext = createContext<{
  state: CategoryState;
  dispatch: React.Dispatch<CategoryAction>;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  getParentCategories: () => Category[];
  getSubcategories: (parentId: string) => Category[];
  getCategoryHierarchy: () => Category[];
} | null>(null);

const categoryReducer = (state: CategoryState, action: CategoryAction): CategoryState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };
    default:
      return state;
  }
};

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, {
    categories: [
      {
        id: '1',
        name: 'Electronics',
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'Electronic devices and gadgets',
      },
      {
        id: '2',
        name: 'Smartphones',
        parentCategoryId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'Mobile phones and accessories',
      },
      {
        id: '3',
        name: 'Laptops',
        parentCategoryId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'Portable computers',
      },
      {
        id: '4',
        name: 'Clothing',
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'Apparel and fashion items',
      },
    ],
    loading: false,
    error: null,
  });

  const addCategory = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  };

  const updateCategory = (category: Category) => {
    const updatedCategory = { ...category, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  const getCategoryById = (id: string) => {
    return state.categories.find(category => category.id === id);
  };

  const getParentCategories = () => {
    return state.categories.filter(category => !category.parentCategoryId);
  };

  const getSubcategories = (parentId: string) => {
    return state.categories.filter(category => category.parentCategoryId === parentId);
  };

  const getCategoryHierarchy = () => {
    const buildHierarchy = (parentId?: string): Category[] => {
      return state.categories
        .filter(category => category.parentCategoryId === parentId)
        .map(category => ({
          ...category,
          subcategories: buildHierarchy(category.id),
        }));
    };
    return buildHierarchy();
  };

  return (
    <CategoryContext.Provider
      value={{
        state,
        dispatch,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        getParentCategories,
        getSubcategories,
        getCategoryHierarchy,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};