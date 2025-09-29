import { useState, useEffect, useCallback } from 'react';
import { userAPI, financialAPI, tradingAPI } from '../services/api';

/**
 * Enhanced Live Dashboard Hook with Admin Approval System
 * Handles both automatic updates and admin-controlled updates
 */
export const useLiveDashboard = (userId, updateInterval = 10000) => {
  const [dashboardData, setDashboardData] = useState({
    // Financial Data (Top Row Icons)
    totalBalance: 0,
    availableBalance: 0, // Balance user can trade with
    pendingDeposits: 0,  // Awaiting admin approval
    profit: 0,
    totalBonus: 0,
    accountStatus: 'UNVERIFIED', // UNVERIFIED, PENDING, VERIFIED
    
    // Trading Data (Bottom Row Icons) - Auto updates
    totalTrades: 0,
    openTrades: 0,
    closedTrades: 0,
    winLossRatio: 0,
    
    // Admin Control Status
    lastUpdated: null,
    isLive: false,
    pendingActions: {
      depositsAwaitingApproval: 0,
      kycAwaitingApproval: false,
      withdrawalsAwaitingApproval: 0
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard data with admin approval status
      const [
        profileResponse,
        balanceResponse,
        tradingStatsResponse,
        bonusResponse,
        pendingResponse
      ] = await Promise.all([
        userAPI.getProfile().catch(() => ({ success: false, data: {} })),
        financialAPI.getCurrentBalance().catch(() => ({ success: false, data: { balance: 0 } })),
        tradingAPI.getLiveTradingStats().catch(() => ({ success: false, data: {} })),
        financialAPI.getBonusHistory().catch(() => ({ success: false, data: { totalBonus: 0 } })),
        financialAPI.getPendingActions(userId).catch(() => ({ success: false, data: {} }))
      ]);

      // Process responses with admin approval logic
      const newDashboardData = {
        // Financial Data - Admin Controlled
        totalBalance: balanceResponse.success ? 
          (balanceResponse.data.approvedBalance || balanceResponse.data.totalBalance || 0) : 0,
        
        availableBalance: balanceResponse.success ? 
          (balanceResponse.data.availableBalance || 0) : 0,
          
        pendingDeposits: pendingResponse.success ? 
          (pendingResponse.data.pendingDeposits || 0) : 0,
        
        profit: tradingStatsResponse.success ? 
          (tradingStatsResponse.data.totalProfit || tradingStatsResponse.data.profit || 0) : 0,
        
        totalBonus: bonusResponse.success ? 
          (bonusResponse.data.approvedBonuses || bonusResponse.data.totalBonus || 0) : 0,
        
        // KYC Status - Admin Controlled
        accountStatus: profileResponse.success ? 
          getKYCStatus(profileResponse.data.kycStatus) : 'UNVERIFIED',
        
        // Trading Data - Automatic Updates
        totalTrades: tradingStatsResponse.success ? 
          (tradingStatsResponse.data.totalTrades || 0) : 0,
        
        openTrades: tradingStatsResponse.success ? 
          (tradingStatsResponse.data.openTrades || 0) : 0,
        
        closedTrades: tradingStatsResponse.success ? 
          (tradingStatsResponse.data.closedTrades || 0) : 0,
        
        winLossRatio: tradingStatsResponse.success ? 
          (tradingStatsResponse.data.winLossRatio || 0) : 0,
        
        // Admin Control Status
        lastUpdated: new Date().toISOString(),
        isLive: true,
        pendingActions: {
          depositsAwaitingApproval: pendingResponse.success ? 
            (pendingResponse.data.pendingDepositsCount || 0) : 0,
          kycAwaitingApproval: profileResponse.success ? 
            (profileResponse.data.kycStatus === 'pending') : false,
          withdrawalsAwaitingApproval: pendingResponse.success ? 
            (pendingResponse.data.pendingWithdrawalsCount || 0) : 0
        }
      };

      setDashboardData(newDashboardData);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Helper function to determine KYC status
  const getKYCStatus = (kycStatus) => {
    switch (kycStatus) {
      case 'verified':
      case 'approved':
        return 'VERIFIED';
      case 'pending':
      case 'submitted':
        return 'PENDING';
      case 'rejected':
        return 'REJECTED';
      default:
        return 'UNVERIFIED';
    }
  };

  // Function to refresh specific dashboard item
  const refreshDashboardItem = useCallback(async (itemType) => {
    if (!userId) return;

    try {
      switch (itemType) {
        case 'balance':
          // Only refreshes approved balance, not pending deposits
          const balanceRes = await financialAPI.getCurrentBalance();
          if (balanceRes.success) {
            setDashboardData(prev => ({
              ...prev,
              totalBalance: balanceRes.data.approvedBalance || balanceRes.data.totalBalance || 0,
              availableBalance: balanceRes.data.availableBalance || 0,
              lastUpdated: new Date().toISOString()
            }));
          }
          break;

        case 'deposits':
          // Check for newly approved deposits
          const depositRes = await financialAPI.getPendingActions(userId);
          if (depositRes.success) {
            setDashboardData(prev => ({
              ...prev,
              pendingDeposits: depositRes.data.pendingDeposits || 0,
              pendingActions: {
                ...prev.pendingActions,
                depositsAwaitingApproval: depositRes.data.pendingDepositsCount || 0
              },
              lastUpdated: new Date().toISOString()
            }));
          }
          break;

        case 'bonus':
          // Only approved bonuses are shown
          const bonusRes = await financialAPI.getBonusHistory();
          if (bonusRes.success) {
            setDashboardData(prev => ({
              ...prev,
              totalBonus: bonusRes.data.approvedBonuses || bonusRes.data.totalBonus || 0,
              lastUpdated: new Date().toISOString()
            }));
          }
          break;

        case 'trading':
          // Trading updates automatically (no admin approval needed)
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
          // KYC status controlled by admin
          const profileRes = await userAPI.getProfile();
          if (profileRes.success) {
            setDashboardData(prev => ({
              ...prev,
              accountStatus: getKYCStatus(profileRes.data.kycStatus),
              pendingActions: {
                ...prev.pendingActions,
                kycAwaitingApproval: profileRes.data.kycStatus === 'pending'
              },
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

  // Set up real-time updates (only for automatic items)
  useEffect(() => {
    if (userId) {
      // Initial fetch
      fetchDashboardData();

      // Set up interval for live updates (trading data updates automatically)
      const interval = setInterval(() => {
        // Only auto-refresh trading data and check for admin approvals
        refreshDashboardItem('trading');
        refreshDashboardItem('deposits'); // Check if admin approved any deposits
        refreshDashboardItem('kyc'); // Check if admin approved KYC
      }, updateInterval);

      return () => clearInterval(interval);
    }
  }, [userId, fetchDashboardData, updateInterval, refreshDashboardItem]);

  return {
    dashboardData,
    loading,
    error,
    refreshDashboardData: fetchDashboardData,
    refreshDashboardItem,
    // Helper functions for specific updates
    updateBalance: () => refreshDashboardItem('balance'),
    updateDeposits: () => refreshDashboardItem('deposits'),
    updateBonus: () => refreshDashboardItem('bonus'),
    updateTrading: () => refreshDashboardItem('trading'),
    updateKYC: () => refreshDashboardItem('kyc'),
    // Admin notification helpers
    hasPendingActions: () => {
      return dashboardData.pendingActions.depositsAwaitingApproval > 0 || 
             dashboardData.pendingActions.kycAwaitingApproval ||
             dashboardData.pendingActions.withdrawalsAwaitingApproval > 0;
    }
  };
};

export default useLiveDashboard;