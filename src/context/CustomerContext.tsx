import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Customer {
  id: string;
  fullname: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

type CustomerAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string };

const CustomerContext = createContext<{
  state: CustomerState;
  dispatch: React.Dispatch<CustomerAction>;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
} | null>(null);

const customerReducer = (state: CustomerState, action: CustomerAction): CustomerState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        ),
      };
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload),
      };
    default:
      return state;
  }
};

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(customerReducer, {
    customers: [
      {
        id: '1',
        fullname: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St, City, State',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        fullname: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1987654321',
        address: '456 Oak Ave, City, State',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    loading: false,
    error: null,
  });

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });
  };

  const updateCustomer = (customer: Customer) => {
    const updatedCustomer = { ...customer, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
  };

  const deleteCustomer = (id: string) => {
    dispatch({ type: 'DELETE_CUSTOMER', payload: id });
  };

  const getCustomerById = (id: string) => {
    return state.customers.find(customer => customer.id === id);
  };

  return (
    <CustomerContext.Provider
      value={{
        state,
        dispatch,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};