import { useState, useEffect, useCallback } from 'react';
import { userAPI, financialAPI, tradingAPI } from '../services/api';

/**
 * Custom hook for real-time dashboard data updates
 * This hook manages live updates for all dashboard icons/stats
 */
export const useLiveDashboard = (userId, updateInterval = 10000) => {
  const [dashboardData, setDashboardData] = useState({
    // Financial Data (Top Row Icons)
    totalBalance: 0,
    profit: 0,
    totalBonus: 0,
    accountStatus: 'UNVERIFIED',
    
    // Trading Data (Bottom Row Icons)
    totalTrades: 0,
    openTrades: 0,
    closedTrades: 0,
    winLossRatio: 0,
    
    // Additional data for dashboard
    lastUpdated: null,
    isLive: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel for better performance
      const [
        profileResponse,
        balanceResponse,
        tradingStatsResponse,
        bonusResponse
      ] = await Promise.all([
        userAPI.getProfile().catch(() => ({ success: false, data: {} })),
        financialAPI.getCurrentBalance().catch(() => ({ success: false, data: { balance: 0 } })),
        tradingAPI.getLiveTradingStats().catch(() => ({ success: false, data: {} })),
        financialAPI.getBonusHistory().catch(() => ({ success: false, data: { totalBonus: 0 } }))
      ]);

      // Process responses and update dashboard data
      const newDashboardData = {
        // Financial Data from API responses
        totalBalance: balanceResponse.success ? 
          (balanceResponse.data.balance || balanceResponse.data.totalBalance || 0) : 0,
        
        profit: tradingStatsResponse.success ? 
          (tradingStatsResponse.data.totalProfit || tradingStatsResponse.data.profit || 0) : 0,
        
        totalBonus: bonusResponse.success ? 
          (bonusResponse.data.totalBonus || 0) : 0,
        
        accountStatus: profileResponse.success ? 
          (profileResponse.data.kycStatus === 'verified' ? 'VERIFIED' : 'UNVERIFIED') : 'UNVERIFIED',
        
        // Trading Data from API responses
        totalTrades: tradingStatsResponse.success ? 
          (tradingStatsResponse.data.totalTrades || 0) : 0,
        
        openTrades: tradingStatsResponse.success ? 
          (tradingStatsResponse.data.openTrades || 0) : 0,
        
        closedTrades: tradingStatsResponse.success ? 
          (tradingStatsResponse.data.closedTrades || 0) : 0,
        
        winLossRatio: tradingStatsResponse.success ? 
          (tradingStatsResponse.data.winLossRatio || 0) : 0,
        
        // Meta data
        lastUpdated: new Date().toISOString(),
        isLive: true
      };

      setDashboardData(newDashboardData);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Function to refresh specific dashboard item (called when user performs actions)
  const refreshDashboardItem = useCallback(async (itemType) => {
    if (!userId) return;

    try {
      switch (itemType) {
        case 'balance':
          const balanceRes = await financialAPI.getCurrentBalance();
          if (balanceRes.success) {
            setDashboardData(prev => ({
              ...prev,
              totalBalance: balanceRes.data.balance || balanceRes.data.totalBalance || 0,
              lastUpdated: new Date().toISOString()
            }));
          }
          break;

        case 'bonus':
          const bonusRes = await financialAPI.getBonusHistory();
          if (bonusRes.success) {
            setDashboardData(prev => ({
              ...prev,
              totalBonus: bonusRes.data.totalBonus || 0,
              lastUpdated: new Date().toISOString()
            }));
          }
          break;

        case 'trading':
          const tradingRes = await tradingAPI.getLiveTradingStats();
          if (tradingRes.success) {
            setDashboardData(prev => ({
              ...prev,
              totalTrades: tradingRes.data.totalTrades || 0,
              openTrades: tradingRes.data.openTrades || 0,
              closedTrades: tradingRes.data.closedTrades || 0,
              winLossRatio: tradingRes.data.winLossRatio || 0,
              profit: tradingRes.data.totalProfit || tradingRes.data.profit || prev.profit,
              lastUpdated: new Date().toISOString()
            }));
          }
          break;

        case 'kyc':
          const profileRes = await userAPI.getProfile();
          if (profileRes.success) {
            setDashboardData(prev => ({
              ...prev,
              accountStatus: profileRes.data.kycStatus === 'verified' ? 'VERIFIED' : 'UNVERIFIED',
              lastUpdated: new Date().toISOString()
            }));
          }
          break;

        default:
          // Refresh all data
          await fetchDashboardData();
      }
    } catch (err) {
      console.error(`Error refreshing ${itemType}:`, err);
    }
  }, [userId, fetchDashboardData]);

  // Set up real-time updates
  useEffect(() => {
    if (userId) {
      // Initial fetch
      fetchDashboardData();

      // Set up interval for live updates
      const interval = setInterval(fetchDashboardData, updateInterval);

      return () => clearInterval(interval);
    }
  }, [userId, fetchDashboardData, updateInterval]);

  return {
    dashboardData,
    loading,
    error,
    refreshDashboardData: fetchDashboardData,
    refreshDashboardItem,
    // Helper functions for specific updates
    updateBalance: () => refreshDashboardItem('balance'),
    updateBonus: () => refreshDashboardItem('bonus'),
    updateTrading: () => refreshDashboardItem('trading'),
    updateKYC: () => refreshDashboardItem('kyc')
  };
};

export default useLiveDashboard;