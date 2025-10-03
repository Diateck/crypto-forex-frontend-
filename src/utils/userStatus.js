// Utility functions for KYC status display across pages

export const getKYCStatusLabel = (kycStatus) => {
  switch (kycStatus) {
    case 'verified':
    case 'approved':
      return 'KYC Verified';
    case 'pending':
    case 'submitted':
      return 'KYC Pending';
    case 'rejected':
      return 'KYC Rejected';
    default:
      return 'KYC Unverified';
  }
};

export const getKYCStatusColor = (kycStatus) => {
  switch (kycStatus) {
    case 'verified':
    case 'approved':
      return 'success';
    case 'pending':
    case 'submitted':
      return 'warning';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

export const getTraderStatusLabel = (kycStatus) => {
  switch (kycStatus) {
    case 'verified':
    case 'approved':
      return 'Verified Trader';
    case 'pending':
    case 'submitted':
      return 'Trader (Pending KYC)';
    case 'rejected':
      return 'Trader (KYC Rejected)';
    default:
      return 'Unverified Trader';
  }
};

export const getUserDisplayName = (user) => {
  if (!user) return 'User';
  
  // Try different name combinations
  if (user.name) return user.name;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.username) return user.username;
  if (user.email) return user.email.split('@')[0]; // Use email prefix as fallback
  
  return 'User';
};

export const getUserUsername = (user) => {
  if (!user) return 'user';
  
  // Priority: username > email prefix > name
  if (user.username) return user.username;
  if (user.email) return user.email.split('@')[0];
  if (user.name) return user.name.toLowerCase().replace(/\s+/g, '');
  
  return 'user';
};

export const getUserEmail = (user) => {
  if (!user) return 'user@example.com';
  
  return user.email || 'user@example.com';
};

export const getReferralLink = (user, baseUrl = 'https://elonbroker.com') => {
  const username = getUserUsername(user);
  return `${baseUrl}/ref/${username}`;
};

export const getUserKYCStatus = (user) => {
  if (!user) return 'unverified';
  
  // Check KYC status from user data
  if (user.kyc?.status) return user.kyc.status;
  if (user.kycStatus) return user.kycStatus;
  
  return 'unverified';
};

export const getUserKYCLabel = (user) => {
  const status = getUserKYCStatus(user);
  return getKYCStatusLabel(status);
};

export const getUserKYCColor = (user) => {
  const status = getUserKYCStatus(user);
  return getKYCStatusColor(status);
};