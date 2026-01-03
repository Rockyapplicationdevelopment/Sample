# Borumithra Mobile - Setup Instructions

## Project Overview

This is a React Native TypeScript application implementing a comprehensive franchise model for water motor registration and certification management.

## What's Been Implemented

### ✅ Core Architecture
- React Native 0.73.2 with TypeScript
- Redux Toolkit for state management with Redux Persist
- React Navigation for routing
- Firebase integration (Firestore, Auth, Storage, Functions, Messaging, Crashlytics)

### ✅ Data Models
1. **Franchise Model** - Complete franchise entity with territory, commission structure, and statistics
2. **Commission Model** - Commission tracking with splits and payout details
3. **Territory Model** - Geographic territory management
4. **Agent Model** - Enhanced with franchise integration
5. **Customer, Technician, Motor, Payment Models** - Complete domain models

### ✅ State Management
- `appSlice` - Authentication and user session
- `franchiseSlice` - Franchise CRUD operations
- `commissionSlice` - Commission tracking
- `territorySlice` - Territory management

### ✅ Firebase Services
- `firebaseHelper.ts` - Comprehensive Firebase operations including:
  - Franchise registration and authentication
  - Agent-to-franchise assignment
  - Commission calculation and transaction creation
  - Real-time data subscriptions
  - File uploads to Firebase Storage

### ✅ User Interface
1. **FranchiseDashboardScreen** - Complete dashboard showing:
   - Franchise statistics (agents, customers, revenue)
   - Commission overview (pending, paid, tier, rate)
   - Territory information
   - Recent agents list

2. **FranchiseListScreen** - List view with:
   - Search functionality
   - Franchise cards with key stats
   - Navigation to detail screens

3. **AddFranchiseScreen** - Registration form with:
   - Owner information
   - Franchise details
   - Territory selection
   - Bank details
   - Form validation

### ✅ Utilities
- Helper functions for date formatting, currency, validation
- Commission tier calculation
- Motor pricing logic
- Registration number generation

## Project Structure

```
src/
├── models/           # TypeScript interfaces (8 models)
├── screens/          # React Native screens (3 franchise screens)
├── services/         # Firebase helper with 20+ functions
├── redux/            # 4 Redux slices + store configuration
├── constants/        # App configuration and constants
└── utils/            # Helper utilities
```

## Next Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Firebase and Razorpay credentials
```

### 3. Set Up Firebase
- Create a Firebase project
- Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
- Create Firestore collections: Franchises, Agents, Customers, Technicians, Commissions, Territories, Payments
- Configure Firebase Authentication (Email/Password, Phone)

### 4. Additional Screens to Implement

#### Agent Screens
- `AgentDashboardScreen.tsx` - Agent dashboard
- `AgentListScreen.tsx` - List all agents
- `AddAgentScreen.tsx` - Agent registration
- `EditAgentScreen.tsx` - Agent profile editing

#### Customer Screens
- `CustomerListScreen.tsx` - Customer list
- `AddCustomerScreen.tsx` - Customer registration
- `CustomerDetailScreen.tsx` - Customer details

#### Motor & Certificate Screens
- `AddMotorScreen.tsx` - Motor registration
- `MotorListScreen.tsx` - Motor list
- `CertificateGenerationScreen.tsx` - PDF certificate generation
- `PdfViewerScreen.tsx` - View generated certificates

#### Payment Screens
- `PaymentScreen.tsx` - Payment processing with Razorpay
- `QRPaymentScreen.tsx` - QR code payment

#### Commission Screens
- `CommissionListScreen.tsx` - Commission transactions
- `CommissionDetailScreen.tsx` - Commission details
- `PayoutScreen.tsx` - Process payouts

#### Territory Screens
- `TerritoryListScreen.tsx` - Territory management
- `AssignTerritoryScreen.tsx` - Assign territories to franchises

#### Authentication Screens
- `LoginScreen.tsx` - Email/Password and Phone OTP login
- `RegisterScreen.tsx` - User registration
- `ForgotPasswordScreen.tsx` - Password recovery

### 5. Navigation Setup

Update `App.tsx` to include complete navigation:
- Auth Stack (Login, Register)
- Main Stack (Dashboard, Lists)
- Franchise Stack (Franchise management)
- Agent Stack (Agent operations)
- Payment Stack (Payment processing)

### 6. Backend Development

#### Cloud Functions
Create Firebase Cloud Functions for:
- Automated commission calculation on payment
- Monthly payout processing
- Tier upgrade calculations
- Push notification triggers
- Certificate generation

#### Security Rules
Implement comprehensive Firestore security rules as documented in `FRANCHISE_MODEL_GUIDE.md`

### 7. Additional Services

#### Payment Integration
- Complete Razorpay integration in `razorpayPayment.ts`
- QR code generation
- Payment verification

#### PDF Generation
- Certificate template in `certificateTemplate.ts`
- PDF generator in `pdfGenerator.ts`

#### Location Services
- Map integration for territory boundaries
- Location picker for customer/agent registration

#### Notifications
- Push notification service with FCM
- Local notifications with Notifee

### 8. Testing

Create tests for:
- Redux slices (unit tests)
- Firebase helper functions (integration tests)
- Commission calculation logic (unit tests)
- Screen navigation (e2e tests)

## Commission System Details

### Tier Calculation
```typescript
Bronze: ₹0 - ₹50,000 (15% franchise, 75% agent)
Silver: ₹50,001 - ₹1,00,000 (20% franchise, 70% agent)
Gold: ₹1,00,001 - ₹2,50,000 (25% franchise, 65% agent)
Platinum: ₹2,50,001+ (30% franchise, 60% agent)
```

Platform fee: 10% (deducted before split)

### Example Calculation
```
Payment: ₹1,000
Platform Fee (10%): ₹100
Remaining: ₹900

For Silver Tier:
- Franchise Commission (20%): ₹180
- Agent Commission (70%): ₹630
- Total distributed: ₹810
```

## Database Schema

### Franchises Collection
```typescript
{
  id, franchiseId, role, ownerName, ownerEmail, ownerPhone,
  franchiseName, territory, commissionStructure, agents,
  statistics, bankDetails, documents, isActive, isApproved
}
```

### Commissions Collection
```typescript
{
  id, transactionId, franchiseId, agentId, paymentId,
  totalAmount, commissionAmount, splits, tierApplied,
  status, payoutDetails
}
```

### Territories Collection
```typescript
{
  id, territoryId, state, district, mandals,
  franchiseId, assignmentType, boundaries, statistics
}
```

## Development Workflow

1. **Start Metro Bundler**: `npm start`
2. **Run Android**: `npm run android`
3. **Run iOS**: `npm run ios`
4. **Type Check**: `npm run type-check`
5. **Lint**: `npm run lint`

## Key Files to Review

1. `src/models/Franchise.ts` - Complete franchise data model
2. `src/services/firebaseHelper.ts` - All Firebase operations
3. `src/redux/slices/franchiseSlice.ts` - Franchise state management
4. `src/screens/Franchise/FranchiseDashboardScreen.tsx` - Dashboard implementation
5. `FRANCHISE_MODEL_GUIDE.md` - Complete franchise model documentation

## Resources

- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)

## Support

For questions or issues:
1. Review the documentation files
2. Check Firebase console for data
3. Review Redux DevTools for state
4. Check Metro bundler logs

---

**Status**: Core franchise model implementation complete. Ready for extension with additional screens and features.

**Last Updated**: January 3, 2025
