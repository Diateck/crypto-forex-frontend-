# Contact Management System Documentation

## Overview
The Contact Management System allows users to easily access company contact information through a "Mail Us" button on the dashboard header, while providing admin control to update this information in real-time.

## Features

### 1. User-Facing Contact Modal
- **Location**: Dashboard header "Mail Us" button
- **Purpose**: Display comprehensive company contact information
- **Features**:
  - Multiple contact methods (Email, Phone, WhatsApp, Telegram)
  - Business hours and response time information
  - One-click copy-to-clipboard functionality
  - Direct action buttons (call, email, message)
  - Company address and emergency support details
  - Quick action chips for common inquiries

### 2. Admin Contact Management
- **Location**: Admin Dashboard → Contact Management tab
- **Purpose**: Update and manage contact information
- **Features**:
  - Real-time editing of all contact fields
  - Auto-save functionality
  - Live preview of changes
  - Restore to defaults option
  - Form validation and error handling

## Implementation Details

### Frontend Components

#### ContactModal Component (`src/components/ContactModal.jsx`)
```jsx
// Main features:
- Fetches contact info from API with fallback to defaults
- Loading state management
- Copy-to-clipboard functionality
- Direct action buttons for contact methods
- Responsive design with dark theme
```

#### AdminContactManager Component (`src/components/AdminContactManager.jsx`)
```jsx
// Main features:
- Form-based contact information editing
- Auto-save toggle
- Preview functionality
- Reset and restore options
- Input validation
```

### API Integration

#### Contact API Endpoints (`src/services/api.js`)
```javascript
contactAPI = {
  getContactInfo: () => GET '/admin/contact-info',
  updateContactInfo: (data) => PUT '/admin/contact-info',
  getDefaultContactInfo: () => Promise.resolve(defaults),
  submitContactForm: (data) => POST '/contact/submit'
}
```

### Data Structure
```javascript
contactInfo = {
  companyName: 'Elon Investment Broker',
  supportEmail: 'support@eloninvestmentbroker.com',
  salesEmail: 'sales@eloninvestmentbroker.com',
  phone: '+1 (555) 123-4567',
  whatsapp: '+1 (555) 123-4567',
  telegram: '@eloninvestmentbroker',
  address: '123 Financial District, New York, NY 10004',
  businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM (EST)',
  responseTime: 'We typically respond within 2-4 hours during business hours',
  emergencySupport: '24/7 for critical trading issues'
}
```

## Admin Usage Instructions

### Accessing Contact Management
1. Navigate to Admin Dashboard (`/admin`)
2. Click on "Contact Management" tab
3. Edit contact fields as needed

### Auto-Save Feature
- Toggle "Auto-save changes" to automatically save as you type
- When disabled, click "Save Changes" to apply updates
- Unsaved changes warning appears when auto-save is off

### Preview Changes
- Click "Preview" button to see how contact modal will appear to users
- Test all contact methods and links
- Verify formatting and appearance

### Reset and Restore
- **Reset Changes**: Reverts to last saved state
- **Restore Defaults**: Resets to original company defaults

## Backend Requirements

### Database Schema
```sql
CREATE TABLE contact_info (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_name VARCHAR(255),
  support_email VARCHAR(255),
  sales_email VARCHAR(255),
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  telegram VARCHAR(100),
  address TEXT,
  business_hours TEXT,
  response_time TEXT,
  emergency_support TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT -- admin user ID
);
```

### API Endpoints to Implement
```javascript
// Get current contact information
GET /api/admin/contact-info
Response: contactInfo object

// Update contact information (admin only)
PUT /api/admin/contact-info
Body: contactInfo object
Auth: Admin token required

// Submit contact form (public)
POST /api/contact/submit
Body: { name, email, subject, message, type }
```

## Security Considerations

### Admin-Only Updates
- Contact information updates require admin authentication
- Implement role-based access control
- Log all contact information changes

### Input Validation
- Validate email formats
- Sanitize all text inputs
- Prevent XSS attacks
- Rate limiting for contact form submissions

### Data Backup
- Maintain contact information history
- Implement rollback capability
- Regular backups of contact settings

## Future Enhancements

### Planned Features
1. **Multiple Contact Profiles**: Different contact info for different regions
2. **Schedule-Based Display**: Show different contact methods based on time zones
3. **Contact Form Integration**: Built-in contact form within the modal
4. **Analytics**: Track which contact methods are used most
5. **Notification System**: Alert admins when contact information is accessed frequently

### Integration Points
- **User Support System**: Link contact methods to support ticket creation
- **CRM Integration**: Connect with customer relationship management tools
- **Analytics Dashboard**: Track contact method effectiveness
- **Multi-language Support**: Localized contact information

## Testing Checklist

### User Experience Testing
- [ ] "Mail Us" button opens modal correctly
- [ ] All contact methods work (email, phone, messaging apps)
- [ ] Copy-to-clipboard functions properly
- [ ] Modal responsive on all device sizes
- [ ] Loading states display correctly

### Admin Functionality Testing
- [ ] Contact information editing saves correctly
- [ ] Auto-save functionality works
- [ ] Preview shows accurate information
- [ ] Reset and restore functions work
- [ ] Form validation prevents invalid data
- [ ] Admin authentication required for updates

### API Testing
- [ ] Contact info retrieval with fallbacks
- [ ] Admin updates persist correctly
- [ ] Error handling for API failures
- [ ] Rate limiting for contact submissions
- [ ] Security validation for admin endpoints

## Support and Maintenance

### Regular Tasks
- Review and update contact information quarterly
- Monitor contact method effectiveness
- Update business hours for holidays/special events
- Test all contact links and phone numbers

### Troubleshooting
- If modal doesn't open: Check ContactModal import in Dashboard.jsx
- If contact info doesn't load: Verify API endpoints and fallback data
- If admin can't update: Check authentication and admin permissions
- If emails don't work: Verify email addresses and client configurations

---

*This documentation should be updated as the system evolves and new features are added.*