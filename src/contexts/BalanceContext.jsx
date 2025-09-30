import React, { createContext, useContext, useReducer, useEffect } from 'react';

const BalanceContext = createContext();

// Balance actions
const BALANCE_ACTIONS = {
  SET_BALANCE: 'SET_BALANCE',
  UPDATE_BALANCE: 'UPDATE_BALANCE',
  DEDUCT_BALANCE: 'DEDUCT_BALANCE',
  ADD_BALANCE: 'ADD_BALANCE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Balance reducer
const balanceReducer = (state, action) => {
  switch (action.type) {
    case BALANCE_ACTIONS.SET_BALANCE:
      return {
        ...state,
        balance: action.payload,
        loading: false,
        error: null
      };
    
    case BALANCE_ACTIONS.UPDATE_BALANCE:
      return {
        ...state,
        balance: action.payload,
        lastUpdated: new Date().toISOString()
      };
    
    case BALANCE_ACTIONS.DEDUCT_BALANCE:
      return {
        ...state,
        balance: Math.max(0, state.balance - action.payload),
        lastUpdated: new Date().toISOString()
      };
    
    case BALANCE_ACTIONS.ADD_BALANCE:
      return {
        ...state,
        balance: state.balance + action.payload,
        lastUpdated: new Date().toISOString()
      };
    
    case BALANCE_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case BALANCE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  balance: 0,
  loading: true,
  error: null,
  lastUpdated: null,
  isConnected: false
};

export const BalanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(balanceReducer, initialState);

  // Backend API configuration
  const BACKEND_URL = 'https://crypto-forex-backend-9mme.onrender.com/api';

  // Fetch balance from backend
  const fetchBalance = async () => {
    try {
      dispatch({ type: BALANCE_ACTIONS.SET_LOADING, payload: true });
      
      const response = await fetch(`${BACKEND_URL}/dashboard/balance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          dispatch({
            type: BALANCE_ACTIONS.SET_BALANCE,
            payload: data.data.totalBalance || data.data.balance || 0
          });
          state.isConnected = true;
        }
      } else {
        throw new Error('Failed to fetch balance');
      }
    } catch (error) {
      console.error('Balance fetch error:', error);
      dispatch({
        type: BALANCE_ACTIONS.SET_ERROR,
        payload: 'Failed to fetch balance'
      });
      state.isConnected = false;
    }
  };

  // Update balance (for immediate UI updates)
  const updateBalance = (newBalance) => {
    dispatch({
      type: BALANCE_ACTIONS.UPDATE_BALANCE,
      payload: newBalance
    });
  };

  // Deduct from balance (for withdrawals)
  const deductBalance = (amount) => {
    dispatch({
      type: BALANCE_ACTIONS.DEDUCT_BALANCE,
      payload: amount
    });
  };

  // Add to balance (for deposits)
  const addBalance = (amount) => {
    dispatch({
      type: BALANCE_ACTIONS.ADD_BALANCE,
      payload: amount
    });
  };

  // Refresh balance from backend
  const refreshBalance = () => {
    fetchBalance();
  };

  // Fetch balance on mount and set up interval
  useEffect(() => {
    fetchBalance();
    
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const contextValue = {
    balance: state.balance,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    isConnected: state.isConnected,
    updateBalance,
    deductBalance,
    addBalance,
    refreshBalance,
    fetchBalance
  };

  return (
    <BalanceContext.Provider value={contextValue}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

export default BalanceContext;