// Admin API Service - Connects admin panel to backend
// This replaces localStorage with real backend API calls

// Backend API configuration - Use live deployed backend
const API_BASE_URL = 'https://crypto-forex-backend-9mme.onrender.com/api';

// Admin API client
const adminAPI = {
  // Dashboard and Overview
  async getDashboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // For authentication
        }
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Dashboard API Error:', error);
      return { 
        success: false, 
        error: 'Failed to fetch dashboard data',
        // Fallback data for demo
        data: {
          overview: {
            totalUsers: 156,
            activeUsers: 142,
            suspendedUsers: 8,
            newUsersToday: 3,
            totalBalance: 2840576.50,
            totalDeposits: 3250000,
            totalWithdrawals: 409423.50,
            totalTrades: 1247,
            netFlow: 2840576.50
          },
          kyc: {
            total: 156,
            verified: 128,
            pending: 18,
            rejected: 10,
            verificationRate: '82.1'
          },
          financial: {
            pendingDeposits: 7,
            pendingWithdrawals: 4,
            processingDeposits: 2,
            processingWithdrawals: 3,
            totalPendingAmount: 47500,
            dailyVolume: 125750
          },
          recentActivity: {
            newUsers: 12,
            recentTrades: 89,
            recentDeposits: 23,
            recentWithdrawals: 15
          }
        }
      };
    }
  },

  // User Management
  async getUsers(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Users API Error:', error);
      return { success: false, error: 'Failed to fetch users' };
    }
  },

  async getUserDetails(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('User Details API Error:', error);
      return { success: false, error: 'Failed to fetch user details' };
    }
  },

  async updateUserStatus(userId, status, reason) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status, reason })
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Update User Status API Error:', error);
      return { success: false, error: 'Failed to update user status' };
    }
  },

  // KYC Management
  async getKYCApplications(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/admin/kyc?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('KYC API Error:', error);
      return { 
        success: false, 
        error: 'Failed to fetch KYC applications',
        // Fallback data for demo
        data: {
          applications: [
            {
              id: 'user_002',
              username: 'jane_smith',
              fullName: 'Jane Smith',
              email: 'jane@example.com',
              kycStatus: 'pending',
              submittedAt: '2025-09-22T14:20:00Z',
              documents: {
                idDocument: 'license_002.jpg',
                proofOfAddress: 'bank_statement_002.jpg'
              }
            },
            {
              id: 'user_004',
              username: 'alex_brown',
              fullName: 'Alex Brown',
              email: 'alex@example.com',
              kycStatus: 'pending',
              submittedAt: '2025-09-30T09:15:00Z',
              documents: {
                idDocument: 'passport_004.jpg',
                proofOfAddress: 'utility_004.jpg'
              }
            }
          ],
          statistics: {
            total: 156,
            pending: 18,
            verified: 128,
            rejected: 10
          }
        }
      };
    }
  },

  async approveKYC(userId, adminNotes) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/kyc/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ adminNotes })
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Approve KYC API Error:', error);
      return { success: false, error: 'Failed to approve KYC' };
    }
  },

  async rejectKYC(userId, rejectionReason, adminNotes) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/kyc/${userId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ rejectionReason, adminNotes })
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Reject KYC API Error:', error);
      return { success: false, error: 'Failed to reject KYC' };
    }
  },

  // Deposit Management
  async getDeposits(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/admin/deposits?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Admin Deposits API Error:', error);
      return { 
        success: false, 
        error: 'Failed to fetch deposits',
        // Fallback data for demo
        data: {
          deposits: [
            {
              id: 'dep_002',
              userId: 'user_001',
              username: 'john_doe',
              fullName: 'John Doe',
              amount: 500,
              currency: 'USD',
              method: 'Credit Card',
              status: 'pending',
              transactionId: 'TXN12346',
              paymentProof: 'proof_002.jpg',
              createdAt: '2025-09-29T14:20:00Z'
            },
            {
              id: 'dep_005',
              userId: 'user_002',
              username: 'jane_smith',
              fullName: 'Jane Smith',
              amount: 1000,
              currency: 'USD',
              method: 'Bank Transfer',
              status: 'processing',
              transactionId: 'TXN12349',
              paymentProof: 'proof_005.jpg',
              createdAt: '2025-09-30T08:30:00Z'
            }
          ],
          statistics: {
            total: 23,
            pending: 3,
            processing: 2,
            completed: 16,
            rejected: 2,
            totalAmount: 45750,
            pendingAmount: 2500
          }
        }
      };
    }
  },

  async approveDeposit(depositId, adminNotes) {
    try {
      const response = await fetch(`${API_BASE_URL}/deposits/admin/approve/${depositId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ adminNotes })
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Approve Deposit API Error:', error);
      return { success: false, error: 'Failed to approve deposit' };
    }
  },

  async rejectDeposit(depositId, adminNotes) {
    try {
      const response = await fetch(`${API_BASE_URL}/deposits/admin/reject/${depositId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ adminNotes })
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Reject Deposit API Error:', error);
      return { success: false, error: 'Failed to reject deposit' };
    }
  },

  // Withdrawal Management
  async getWithdrawals(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/admin/withdrawals?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Admin Withdrawals API Error:', error);
      return { 
        success: false, 
        error: 'Failed to fetch withdrawals',
        // Fallback data for demo
        data: {
          withdrawals: [
            {
              id: 'with_002',
              userId: 'user_001',
              username: 'john_doe',
              fullName: 'John Doe',
              amount: 500,
              currency: 'USD',
              method: 'Cryptocurrency',
              status: 'pending',
              netAmount: 495,
              createdAt: '2025-09-29T16:45:00Z'
            },
            {
              id: 'with_004',
              userId: 'user_002',
              username: 'jane_smith',
              fullName: 'Jane Smith',
              amount: 750,
              currency: 'USD',
              method: 'Bank Transfer',
              status: 'processing',
              netAmount: 725,
              createdAt: '2025-09-30T11:20:00Z'
            }
          ],
          statistics: {
            total: 18,
            pending: 2,
            processing: 3,
            completed: 11,
            rejected: 1,
            cancelled: 1,
            totalAmount: 23750,
            pendingAmount: 1250
          }
        }
      };
    }
  },

  async approveWithdrawal(withdrawalId, adminNotes) {
    try {
      const response = await fetch(`${API_BASE_URL}/withdrawals/admin/approve/${withdrawalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ adminNotes })
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Approve Withdrawal API Error:', error);
      return { success: false, error: 'Failed to approve withdrawal' };
    }
  },

  async rejectWithdrawal(withdrawalId, adminNotes) {
    try {
      const response = await fetch(`${API_BASE_URL}/withdrawals/admin/reject/${withdrawalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ adminNotes })
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Reject Withdrawal API Error:', error);
      return { success: false, error: 'Failed to reject withdrawal' };
    }
  },

  // Trading Management
  async getTradingActivity(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/admin/trading?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Trading API Error:', error);
      return { 
        success: false, 
        error: 'Failed to fetch trading data',
        // Fallback data for demo
        data: {
          trades: [
            {
              id: 'trade_001',
              userId: 'user_001',
              username: 'john_doe',
              fullName: 'John Doe',
              pair: 'EUR/USD',
              type: 'buy',
              amount: 1000,
              openPrice: 1.0850,
              closePrice: 1.0875,
              status: 'closed',
              profit: 25.00,
              openTime: '2025-09-30T10:30:00Z',
              closeTime: '2025-09-30T11:15:00Z'
            },
            {
              id: 'trade_002',
              userId: 'user_002',
              username: 'jane_smith',
              fullName: 'Jane Smith',
              pair: 'GBP/USD',
              type: 'sell',
              amount: 500,
              openPrice: 1.2650,
              status: 'open',
              profit: -5.50,
              openTime: '2025-09-30T14:45:00Z'
            }
          ],
          statistics: {
            total: 1247,
            open: 89,
            closed: 1158,
            totalVolume: 2847500,
            totalProfit: 15423.75
          }
        }
      };
    }
  },

  // Settings and Configuration
  async getSettings() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Settings API Error:', error);
      return { success: false, error: 'Failed to fetch settings' };
    }
  },

  async updateSettings(settings) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ settings })
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Update Settings API Error:', error);
      return { success: false, error: 'Failed to update settings' };
    }
  },

  // Activity Logs
  async getActivityLogs(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/admin/logs?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return await safeParseResponse(response);
    } catch (error) {
      console.error('Logs API Error:', error);
      return { success: false, error: 'Failed to fetch activity logs' };
    }
  }
};

export default adminAPI;