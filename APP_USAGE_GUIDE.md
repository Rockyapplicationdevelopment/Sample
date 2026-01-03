# Borumithra Mobile - User Guide

## Getting Started

### First Time Setup

1. **Install the App**
   - Download and install Borumithra Mobile
   - Allow necessary permissions (location, storage, camera)

2. **Create an Account**
   - Open the app
   - Tap "Register Here" on login screen
   - Choose user type (Agent or Franchise)
   - Fill in registration details
   - Submit and wait for approval

3. **Login**
   - Use your registered email and password
   - Or use phone number with OTP
   - Tap "Login"

---

## For Agents

### Dashboard Overview
After logging in, you'll see your dashboard with:
- **Customer Count** - Total customers you've registered
- **Motor Count** - Total motors registered
- **Technician Count** - Technicians under you
- **Quick Actions** - Fast access to common tasks

### Adding a Customer

1. **Navigate to Customer Screen**
   - Tap on "Customers" tab at the bottom
   - Or tap "Add Customer" from dashboard

2. **Fill Customer Details**
   ```
   Customer Information:
   - Full Name *
   - Phone Number * (10 digits)
   - Aadhar Number (optional)
   
   Location:
   - State *
   - District *
   - Mandal *
   - Village *
   - Pincode
   ```

3. **Submit**
   - Tap "Register Customer"
   - System generates unique Customer ID
   - Option to add motor immediately or later

4. **Success**
   - Customer appears in your customer list
   - Your customer count increases
   - Customer can now be assigned motors

### Adding a Motor (Future Feature)
*To be implemented*
1. Select customer
2. Fill motor details
3. Capture motor photos
4. Set pricing
5. Process payment
6. Generate certificate

### Viewing Customers

1. **Customer List**
   - Tap "Customers" tab
   - See all your customers
   - Use search bar to find specific customer

2. **Customer Card Shows**:
   - Customer name and avatar
   - Customer ID
   - Phone number
   - Location
   - Number of motors
   - Active status

3. **Search Customers**
   - Type in search box
   - Search by name, ID, or phone
   - Results filter in real-time

---

## For Franchise Owners

### Dashboard Overview
Your dashboard shows:
- **Total Agents** - Agents in your franchise
- **Active Agents** - Currently active agents
- **Total Revenue** - Revenue generated
- **Total Customers** - Customers across all agents
- **Commission Overview** - Pending and paid commissions
- **Territory Information** - Your assigned territory

### Adding an Agent

1. **Navigate**
   - Go to "Agents" tab
   - Tap "+ " button

2. **Fill Agent Details**
   ```
   Personal Information:
   - Full Name *
   - Email *
   - Phone * (10 digits)
   - Aadhar Number
   - Blood Group
   
   Location:
   - State *
   - District *
   - Mandal
   - Village
   - Pincode
   
   Bank Details:
   - Account Number *
   - IFSC Code *
   - Bank Name *
   - PAN Number
   
   Security:
   - Password *
   - Confirm Password *
   ```

3. **Submit**
   - Tap "Register Agent"
   - Agent ID is auto-generated
   - Agent linked to your franchise
   - Agent count increases

### Viewing Agents

1. **Agent List**
   - Tap "Agents" tab
   - See all franchise agents
   - Search by name, ID, or phone

2. **Agent Card Shows**:
   - Agent name and avatar
   - Agent ID
   - Phone number
   - Number of customers
   - Number of technicians
   - District
   - Active status
   - "Franchise Agent" badge

### Monitoring Performance
- View agent customer counts
- Track revenue by agent
- Monitor commission earnings
- View territory coverage

---

## For Admin/Super Admin

### Additional Capabilities

1. **View All Data**
   - See all agents across system
   - View all franchises
   - Access all customers
   - System-wide statistics

2. **Franchise Management**
   - Tap "Franchises" tab
   - View all franchises
   - Add new franchise
   - Approve/reject franchise applications
   - Assign territories

3. **System Reports**
   - Total system users
   - Revenue across all franchises
   - Commission summaries
   - Performance analytics

---

## Navigation Guide

### Bottom Tab Navigation

```
┌─────────────────────────────────────────────┐
│  [🏠 Home] [👥 Customers] [🤝 Agents] [🏢] │
└─────────────────────────────────────────────┘

🏠 Home - Dashboard screen
👥 Customers - Customer list (all users)
🤝 Agents - Agent list (admin/franchise)
🏢 Franchises - Franchise list (super admin)
```

### Quick Actions

**From Dashboard:**
- Add Customer → Opens customer form
- Add Agent → Opens agent form (admin/franchise)
- View Customers → Opens customer list
- View Agents → Opens agent list (admin/franchise)

**From List Screens:**
- "+" FAB button → Add new entity
- Search bar → Filter results
- Card tap → View details

---

## Common Tasks

### Task 1: Register New Customer
```
1. Login as Agent
2. Tap "Customers" tab or "Add Customer"
3. Fill required fields (marked with *)
4. Tap "Register Customer"
5. Note the Customer ID
6. Choose "Add Motor" or "Later"
```

### Task 2: Search for Customer
```
1. Go to "Customers" tab
2. Tap search bar
3. Type name, ID, or phone
4. Results update automatically
5. Tap customer card to view details
```

### Task 3: Add Agent to Franchise
```
1. Login as Franchise Owner
2. Tap "Agents" tab
3. Tap "+" button
4. Fill all agent details
5. Agent auto-linked to your franchise
6. Tap "Register Agent"
7. Agent receives credentials
```

### Task 4: View Statistics
```
1. Open Dashboard
2. View stat cards:
   - Customers, Agents, Motors, etc.
3. Pull down to refresh
4. Tap stat card to see details
```

---

## Data Validation

### Phone Number
- Must be exactly 10 digits
- Numbers only
- No special characters
- Unique per user type

### Email
- Valid email format
- Must contain @ and domain
- Unique per user type

### Aadhar Number
- 12 digits (if provided)
- Numbers only

### IFSC Code
- 11 characters
- Format: ABCD0123456
- First 4 letters, then 0, then alphanumeric

### PAN Number
- 10 characters
- Format: ABCDE1234F
- 5 letters, 4 numbers, 1 letter

---

## ID Generation Format

### Customer ID
```
Format: BMCUST[ST][DIST]####
Example: BMCUSTKA1094

BM - Borumithra
CUST - Customer
KA - State code (Karnataka)
1094 - Sequential number
```

### Agent ID
```
Format: BMAGL[ST][DIST]####
Example: BMAGLIKA1234

BM - Borumithra
AGL - Agent
I - State code
KA - District code
1234 - Sequential number
```

### Franchise ID
```
Format: BMFRNCH-[ST]-###
Example: BMFRNCH-KA-001

BM - Borumithra
FRNCH - Franchise
KA - State code
001 - Sequential number
```

---

## Troubleshooting

### Cannot Login
**Problem**: Email/password not working
**Solutions**:
- Check email is lowercase
- Verify password is correct
- Try "Forgot Password"
- Contact admin for account status

### Phone Number Already Exists
**Problem**: "Phone number already registered" error
**Solutions**:
- Verify you're not re-registering
- Check if user exists in system
- Use different phone number
- Contact admin if error persists

### Data Not Updating
**Problem**: List not showing new entries
**Solutions**:
- Pull down to refresh
- Check internet connection
- Logout and login again
- Clear app cache

### Search Not Working
**Problem**: Can't find customer/agent
**Solutions**:
- Check spelling
- Use Customer/Agent ID
- Try partial name
- Clear search and try again
- Ensure entity exists under your account

---

## Tips & Best Practices

### For Agents

1. **Keep Customer Data Accurate**
   - Double-check phone numbers
   - Verify location details
   - Update inactive customers

2. **Regular Check-ins**
   - Review dashboard daily
   - Monitor customer list
   - Track motor registrations

3. **Quick Access**
   - Use search frequently
   - Bookmark common tasks
   - Use quick actions

### For Franchise Owners

1. **Monitor Agents**
   - Check agent performance
   - Review customer counts
   - Track commission earnings

2. **Territory Management**
   - Ensure agents cover territory
   - Monitor district coverage
   - Plan agent distribution

3. **Financial Tracking**
   - Review commission reports
   - Track pending payouts
   - Monitor revenue trends

### For Admins

1. **System Oversight**
   - Regular data audits
   - Monitor system health
   - Review approval queues

2. **User Support**
   - Respond to agent queries
   - Resolve data issues
   - Provide training

---

## Security Best Practices

1. **Password**
   - Minimum 6 characters
   - Use mix of letters and numbers
   - Don't share with others
   - Change periodically

2. **Account Safety**
   - Logout on shared devices
   - Don't save passwords on public devices
   - Report suspicious activity
   - Keep contact info updated

3. **Data Privacy**
   - Handle customer data responsibly
   - Don't share sensitive information
   - Follow company policies
   - Respect user privacy

---

## Support & Contact

### Technical Support
- **Email**: support@borumithra.com
- **Phone**: [Support Number]
- **Hours**: 9 AM - 6 PM IST

### Training
- New user orientation
- Feature walkthroughs
- Best practices sessions
- Q&A webinars

### Feedback
- Report bugs via app
- Suggest features
- Share improvements
- Rate your experience

---

## Glossary

**Agent**: Field representative who registers customers and motors

**Franchise**: Business entity managing multiple agents in a territory

**Customer**: End user who owns water motors

**Motor**: Water pump/motor being registered

**Commission**: Earnings from customer registrations

**Territory**: Geographic area assigned to franchise

**Tier**: Commission level based on revenue (Bronze/Silver/Gold/Platinum)

**Customer ID**: Unique identifier for each customer

**Agent ID**: Unique identifier for each agent

**Motor Registration**: Process of officially registering a water motor

**Certificate**: PDF document proving motor registration

**Dashboard**: Main screen showing statistics and quick actions

**Quick Actions**: Shortcut buttons for common tasks

---

## Version Information

**Current Version**: 1.0.0
**Last Updated**: January 3, 2025
**Platform**: React Native (iOS & Android)

### Features in Current Version
✅ User authentication (email/password, phone OTP)
✅ Agent registration and management
✅ Customer registration and management
✅ Franchise management
✅ Dashboard with statistics
✅ Real-time data synchronization
✅ Search functionality
✅ Role-based access control
✅ Offline support
✅ Auto-generated IDs

### Upcoming Features
🔄 Motor registration
🔄 Payment processing
🔄 Certificate generation
🔄 Technician management
🔄 Commission reports
🔄 Territory mapping
🔄 Push notifications
🔄 Advanced analytics

---

**Thank you for using Borumithra Mobile!**

For more information, visit: [Your Website]
