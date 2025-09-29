
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Box, ThemeProvider, createTheme, ListItemIcon, IconButton, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import OutboxIcon from '@mui/icons-material/Outbox';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import HistoryIcon from '@mui/icons-material/History';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ImageIcon from '@mui/icons-material/Image';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import BuildIcon from '@mui/icons-material/Build';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { UserProvider } from './contexts';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import Deposits from './pages/Deposits';
import Withdrawals from './pages/Withdrawals';
import Trade from './pages/Trade';
import TradeHistory from './pages/TradeHistory';
import CopyTrading from './pages/CopyTrading';
import BuyPlan from './pages/BuyPlan';
import NFTGallery from './pages/NFTGallery';
import SubscribeSignals from './pages/SubscribeSignals';
import ApplyLoans from './pages/ApplyLoans';
import VerifyAccount from './pages/VerifyAccount';
import AccountHistory from './pages/AccountHistory';
import News from './pages/News';
import AccountSettings from './pages/AccountSettings';
import ReferUser from './pages/ReferUser';
import Technical from './pages/Technical';
import Chart from './pages/Chart';
import Calendar from './pages/Calendar';
import AdminDashboard from './pages/AdminDashboard';

const drawerWidth = 240;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#181A20',
      paper: '#23272F',
    },
    primary: {
      main: '#00B386',
    },
    secondary: {
      main: '#1E88E5',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
});

const pages = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/dashboard/deposits', label: 'Deposits', icon: <AccountBalanceWalletIcon /> },
  { path: '/dashboard/withdrawals', label: 'Withdrawals', icon: <OutboxIcon /> },
  { path: '/dashboard/trade', label: 'Trade', icon: <ShowChartIcon /> },
  { path: '/dashboard/trades/history', label: 'Trade History', icon: <HistoryIcon /> },
  { path: '/dashboard/copy-trading', label: 'Copy Trading', icon: <ContentCopyIcon /> },
  { path: '/dashboard/buy-plan', label: 'Investment Plan', icon: <ShoppingCartIcon /> },
  { path: '/dashboard/nft-gallery', label: 'NFT Gallery', icon: <ImageIcon /> },
  { path: '/dashboard/subscribe-signals', label: 'Subscribe Signals', icon: <SignalCellularAltIcon /> },
  { path: '/dashboard/loans/apply', label: 'Apply for Loans', icon: <MonetizationOnIcon /> },
  { path: '/dashboard/verify-account', label: 'Verify Account', icon: <VerifiedUserIcon /> },
  { path: '/dashboard/accounthistory', label: 'Account History', icon: <AccountBoxIcon /> },
  { path: '/dashboard/news', label: 'News', icon: <NewspaperIcon /> },
  { path: '/dashboard/account-settings', label: 'Account Settings', icon: <SettingsIcon /> },
  { path: '/dashboard/referuser', label: 'Referrals', icon: <GroupAddIcon /> },
  { 
    label: 'Live Analysis', 
    icon: <TrendingUpIcon />, 
    isParent: true,
    children: [
      { path: '/dashboard/technical', label: 'Technical Analysis', icon: <BuildIcon /> },
      { path: '/dashboard/calendar', label: 'Market Calendar', icon: <CalendarMonthIcon /> },
    ]
  },
  { path: '/dashboard/chart', label: 'Chart', icon: <InsertChartIcon /> },
  { 
    action: 'logout', 
    label: 'Logout', 
    icon: <LogoutIcon />,
    isAction: true
  },
];



function RequireAuth({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth');
    if (!isAuth) {
      navigate('/login');
    }
  }, [navigate]);
  return children;
}


function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  
  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('user');
    setDrawerOpen(false);
    navigate('/login');
  };

  const handleMenuClick = (page) => {
    if (page.isAction && page.action === 'logout') {
      handleLogout();
    } else if (page.isParent) {
      setOpenMenus(prev => ({
        ...prev,
        [page.label]: !prev[page.label]
      }));
    } else if (page.path) {
      navigate(page.path);
      setDrawerOpen(false);
    }
  };

  // Check if current route is login or register
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    // Render only the auth page, no AppBar/Drawer
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Box>
    );
  }

  // ...existing code for dashboard pages...
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, boxShadow: 3 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            Elon Investment Broker
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#181A20',
            color: '#fff',
            borderRight: '1px solid #23272F',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', pt: 2 }}>
          <List>
            {pages.map((page, index) => {
              if (page.isParent) {
                return (
                  <div key={page.label}>
                    <ListItem
                      button
                      onClick={() => handleMenuClick(page)}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        mx: 1,
                        color: '#fff',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: '#fff',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>{page.icon}</ListItemIcon>
                      <ListItemText primary={page.label} />
                      {openMenus[page.label] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Collapse in={openMenus[page.label]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {page.children?.map((child) => {
                          const isActive = location.pathname === child.path;
                          return (
                            <ListItem
                              button
                              key={child.path}
                              onClick={() => handleMenuClick(child)}
                              sx={{
                                borderRadius: 2,
                                mb: 1,
                                mx: 1,
                                ml: 4,
                                color: '#fff',
                                fontWeight: isActive ? 700 : 400,
                                bgcolor: isActive ? 'primary.main' : 'transparent',
                                '&:hover': {
                                  bgcolor: 'primary.main',
                                  color: '#fff',
                                },
                                boxShadow: isActive ? 2 : 0,
                                transition: 'all 0.2s',
                              }}
                            >
                              <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>{child.icon}</ListItemIcon>
                              <ListItemText primary={child.label} sx={{ '.MuiTypography-root': { fontWeight: isActive ? 700 : 400 } }} />
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  </div>
                );
              } else {
                const isActive = location.pathname === page.path;
                return (
                  <ListItem
                    button
                    key={page.path || page.label}
                    onClick={() => handleMenuClick(page)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      mx: 1,
                      color: '#fff',
                      fontWeight: isActive ? 700 : 400,
                      bgcolor: isActive ? 'primary.main' : 'transparent',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: '#fff',
                      },
                      boxShadow: isActive ? 2 : 0,
                      transition: 'all 0.2s',
                    }}
                  >
                    <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>{page.icon}</ListItemIcon>
                    <ListItemText primary={page.label} sx={{ '.MuiTypography-root': { fontWeight: isActive ? 700 : 400 } }} />
                  </ListItem>
                );
              }
            })}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: { xs: 1, sm: 3 } }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/dashboard/deposits" element={<RequireAuth><Deposits /></RequireAuth>} />
          <Route path="/dashboard/withdrawals" element={<RequireAuth><Withdrawals /></RequireAuth>} />
          <Route path="/dashboard/trade" element={<RequireAuth><Trade /></RequireAuth>} />
          <Route path="/dashboard/trades/history" element={<RequireAuth><TradeHistory /></RequireAuth>} />
          <Route path="/dashboard/copy-trading" element={<RequireAuth><CopyTrading /></RequireAuth>} />
          <Route path="/dashboard/buy-plan" element={<RequireAuth><BuyPlan /></RequireAuth>} />
          <Route path="/dashboard/nft-gallery" element={<RequireAuth><NFTGallery /></RequireAuth>} />
          <Route path="/dashboard/subscribe-signals" element={<RequireAuth><SubscribeSignals /></RequireAuth>} />
          <Route path="/dashboard/loans/apply" element={<RequireAuth><ApplyLoans /></RequireAuth>} />
          <Route path="/dashboard/verify-account" element={<RequireAuth><VerifyAccount /></RequireAuth>} />
          <Route path="/dashboard/accounthistory" element={<RequireAuth><AccountHistory /></RequireAuth>} />
          <Route path="/dashboard/news" element={<RequireAuth><News /></RequireAuth>} />
          <Route path="/dashboard/account-settings" element={<RequireAuth><AccountSettings /></RequireAuth>} />
          <Route path="/dashboard/referuser" element={<RequireAuth><ReferUser /></RequireAuth>} />
          <Route path="/dashboard/technical" element={<RequireAuth><Technical /></RequireAuth>} />
          <Route path="/dashboard/chart" element={<RequireAuth><Chart /></RequireAuth>} />
          <Route path="/dashboard/calendar" element={<RequireAuth><Calendar /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          <Route path="*" element={<RequireAuth><Dashboard /></RequireAuth>} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
