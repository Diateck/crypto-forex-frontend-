import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { safeParseResponse } from '../utils/safeResponse.js';
import { nextDelayMs, retryAfterToMs } from '../utils/backoff';

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

  const attemptRef = useRef(0);

  // Fetch balance from backend with safe parsing/backoff
  const fetchBalance = async () => {
    try {
      dispatch({ type: BALANCE_ACTIONS.SET_LOADING, payload: true });

      const response = await fetch(`${BACKEND_URL}/dashboard/balance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const parsed = await safeParseResponse(response);

      if (parsed.success && parsed.data) {
        attemptRef.current = 0;
        const bal = parsed.data.totalBalance || parsed.data.balance || 0;
        dispatch({ type: BALANCE_ACTIONS.SET_BALANCE, payload: bal });
        state.isConnected = true;
        return 60000; // normal next poll (60s)
      }

      if (parsed.status === 429) {
        attemptRef.current++;
        const raMs = parsed.retryAfter || retryAfterToMs(response);
        const delay = raMs ? Number(raMs) : nextDelayMs(attemptRef.current);
        console.warn(`Balance endpoint rate-limited. Backing off for ${delay}ms.`);
        return delay;
      }

      attemptRef.current++;
      console.warn('Balance fetch error:', parsed.error);
      dispatch({ type: BALANCE_ACTIONS.SET_ERROR, payload: 'Failed to fetch balance' });
      state.isConnected = false;
      return nextDelayMs(attemptRef.current);
    } catch (error) {
      attemptRef.current++;
      console.error('Balance fetch error:', error);
      dispatch({ type: BALANCE_ACTIONS.SET_ERROR, payload: 'Failed to fetch balance' });
      state.isConnected = false;
      return nextDelayMs(attemptRef.current);
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

  // Fetch balance on mount and set up backoff-aware polling
  useEffect(() => {
    let mounted = true;
    let timeoutId = null;

    const scheduleNext = (ms) => {
      if (!mounted) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(runOnce, ms);
    };

    const runOnce = async () => {
      if (!mounted) return;
      const delay = await fetchBalance();
      scheduleNext(typeof delay === 'number' ? delay : 60000);
    };

    runOnce();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
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