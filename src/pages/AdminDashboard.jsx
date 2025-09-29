import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminContactManager from '../components/AdminContactManager';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleContactInfoSave = (contactData) => {
    console.log('Saving contact information:', contactData);
    // TODO: Implement actual save to backend
  };

  return (
    <Box sx={{ bgcolor: '#0a0e1a', minHeight: '100vh', color: '#fff' }}>
      {/* Admin Header */}
      <AppBar position="static" sx={{ bgcolor: '#1a1d2b' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            🛠️ Elon Investment Broker - Admin Panel
          </Typography>
          <Button color="inherit" href="/dashboard">
            Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Admin Navigation */}
        <Paper sx={{ bgcolor: '#232742', mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: '#fff'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1976d2'
              }
            }}
          >
            <Tab 
              icon={<DashboardIcon />} 
              label="Overview" 
              {...a11yProps(0)} 
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<ContactMailIcon />} 
              label="Contact Management" 
              {...a11yProps(1)} 
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<PeopleIcon />} 
              label="User Management" 
              {...a11yProps(2)} 
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<SettingsIcon />} 
              label="System Settings" 
              {...a11yProps(3)} 
              sx={{ minHeight: 72 }}
            />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={currentTab} index={0}>
          <Paper sx={{ p: 3, bgcolor: '#1a1d2b', color: '#fff' }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              📊 Admin Dashboard Overview
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Welcome to the admin panel. Use the tabs above to manage different aspects of the system.
            </Typography>
            
            <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
              <Paper sx={{ p: 3, bgcolor: '#232742', textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#4caf50', mb: 1 }}>
                  Total Users
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ color: '#fff' }}>
                  1,247
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3, bgcolor: '#232742', textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#2196f3', mb: 1 }}>
                  Active Trades
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ color: '#fff' }}>
                  89
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3, bgcolor: '#232742', textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#ff9800', mb: 1 }}>
                  Pending KYC
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ color: '#fff' }}>
                  23
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3, bgcolor: '#232742', textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#f44336', mb: 1 }}>
                  Support Tickets
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ color: '#fff' }}>
                  7
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <AdminContactManager onSave={handleContactInfoSave} />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Paper sx={{ p: 3, bgcolor: '#1a1d2b', color: '#fff' }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              👥 User Management
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              User management features will be implemented here.
            </Typography>
          </Paper>
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <Paper sx={{ p: 3, bgcolor: '#1a1d2b', color: '#fff' }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              ⚙️ System Settings
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              System configuration settings will be available here.
            </Typography>
          </Paper>
        </TabPanel>
      </Container>
    </Box>
  );
}