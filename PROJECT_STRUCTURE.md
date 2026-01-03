# Borumithra Mobile - Project Structure

## Overview
Complete React Native TypeScript implementation of the Borumithra Mobile application with franchise model.

## Files Created

### Configuration Files (9 files)
```
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── babel.config.js                 # Babel configuration with module resolver
├── metro.config.js                 # Metro bundler configuration
├── .eslintrc.js                    # ESLint configuration
├── .prettierrc.js                  # Prettier code formatting
├── .env.example                    # Environment variables template
├── app.json                        # React Native app configuration
└── .gitignore                      # Git ignore rules (updated)
```

### Entry Points (2 files)
```
├── index.js                        # App entry point
└── App.tsx                         # Main app component with navigation
```

### Data Models (9 files)
```
src/models/
├── Location.ts                     # Location interface
├── Agent.ts                        # Agent model with franchise integration
├── Franchise.ts                    # Complete franchise model
├── Commission.ts                   # Commission and payout models
├── Territory.ts                    # Territory management model
├── Motor.ts                        # Motor registration model
├── Payment.ts                      # Payment with commission tracking
├── Customer.ts                     # Customer model
├── Technician.ts                   # Technician model
└── index.ts                        # Model exports
```

### Redux State Management (6 files)
```
src/redux/
├── slices/
│   ├── appSlice.ts                # Authentication and user session
│   ├── franchiseSlice.ts          # Franchise CRUD operations
│   ├── commissionSlice.ts         # Commission tracking
│   └── territorySlice.ts          # Territory management
├── store.ts                        # Redux store with persist configuration
└── hooks.ts                        # Typed Redux hooks
```

### Services (1 file)
```
src/services/
└── firebaseHelper.ts              # 20+ Firebase functions:
                                   # - Franchise registration
                                   # - Agent assignment
                                   # - Commission calculation
                                   # - Real-time subscriptions
                                   # - File uploads
                                   # - Authentication
```

### Screens (3 files)
```
src/screens/Franchise/
├── FranchiseDashboardScreen.tsx   # Franchise dashboard with statistics
├── FranchiseListScreen.tsx        # List and search franchises
└── AddFranchiseScreen.tsx         # Register new franchise
```

### Constants & Utils (2 files)
```
src/constants/
└── config.ts                      # App configuration, commission tiers

src/utils/
└── helpers.ts                     # 20+ utility functions:
                                   # - Validation (email, phone, PAN, etc.)
                                   # - Formatting (currency, date)
                                   # - Calculations (tier, commission, age)
                                   # - Registration number generation
```

### Documentation (7 files)
```
├── README.md                       # Project overview (existing)
├── DOCUMENTATION_PLAN.md          # Comprehensive documentation (existing)
├── FRANCHISE_MODEL_GUIDE.md       # Quick reference guide (existing)
├── QUICK_START.md                 # Quick start guide (existing)
├── CHANGELOG.md                   # Version history (existing)
├── IMPLEMENTATION_GUIDE.md        # Implementation guide (new)
├── SETUP.md                       # Setup instructions (new)
└── PROJECT_STRUCTURE.md           # This file
```

## Total Files Created: 39 files

## Key Components

### 1. Data Models (9 models)
- **Franchise**: Complete franchise entity with territory, commission structure, statistics
- **Commission**: Transaction tracking with splits, payout details, status
- **Territory**: Geographic area management with boundaries and statistics
- **Agent**: Enhanced with franchise integration, performance metrics
- **Customer**: Customer management with motor assignments
- **Technician**: Service provider management
- **Motor**: Motor registration with certificate tracking
- **Payment**: Payment processing with commission calculation
- **Location**: Geographic location data

### 2. Redux State Management
- **appSlice**: User authentication, session management
- **franchiseSlice**: Franchise CRUD, loading states, error handling
- **commissionSlice**: Commission tracking, summaries
- **territorySlice**: Territory management
- **Store**: Configured with Redux Persist for data persistence

### 3. Firebase Integration
Comprehensive Firebase helper with functions for:
- Franchise registration and authentication
- Agent-to-franchise assignment
- Commission calculation (tier-based)
- Real-time Firestore subscriptions
- Transaction-based updates
- File uploads to Storage
- Territory management

### 4. User Interface (3 screens)
- **FranchiseDashboardScreen**: 
  - Real-time statistics (agents, customers, revenue)
  - Commission overview (pending, paid, tier, rate)
  - Territory information
  - Recent agents list
  - Pull-to-refresh

- **FranchiseListScreen**:
  - Search functionality
  - Franchise cards with stats
  - Status badges (Active/Inactive/Pending)
  - Navigation to details
  - Floating action button

- **AddFranchiseScreen**:
  - Multi-section form (Owner, Franchise, Territory, Bank)
  - Real-time validation
  - Error display
  - Loading states

### 5. Utilities & Helpers
- Validation functions (email, phone, Aadhar, PAN, IFSC)
- Formatting functions (currency, date, datetime)
- Calculation functions (tier, commission, motor age)
- Registration number generation
- Data masking (phone, email)

## Architecture Highlights

### TypeScript Integration
- Strict type checking enabled
- Interface-based models
- Typed Redux hooks
- Type-safe Firebase operations

### State Management Pattern
- Redux Toolkit (no legacy Redux patterns)
- Slice-based organization
- Async thunks for side effects
- Redux Persist for data persistence

### Firebase Architecture
- Real-time subscriptions with onSnapshot
- Transaction-based updates for consistency
- Optimistic UI updates
- Error handling and retry logic

### Commission System
- Automatic tier calculation based on revenue
- Multi-party split (platform, franchise, agent)
- Real-time statistics updates
- Pending/Processing/Paid status tracking

### Code Organization
- Feature-based folder structure
- Separation of concerns (models, services, screens)
- Reusable utilities
- Constants extracted to config

## Dependencies Overview

### Core (9 packages)
- react, react-native
- @react-navigation/* (navigation)
- @reduxjs/toolkit, react-redux (state)
- redux-persist (persistence)

### Firebase (6 packages)
- @react-native-firebase/app
- @react-native-firebase/auth
- @react-native-firebase/firestore
- @react-native-firebase/storage
- @react-native-firebase/functions
- @react-native-firebase/messaging
- @react-native-firebase/crashlytics

### UI & Utils (8 packages)
- react-native-maps
- react-native-geolocation-service
- react-native-html-to-pdf
- react-native-pdf
- react-native-image-picker
- react-native-razorpay
- @notifee/react-native
- react-native-vector-icons

## Commission Flow Implementation

```typescript
// 1. Payment received
const payment = { amount: 1000, agentId, franchiseId }

// 2. Calculate commission split
const commission = calculateCommission(1000, 'SILVER', 10)
// Returns: { platformAmount: 100, franchiseCommission: 180, agentCommission: 630 }

// 3. Create commission transaction
const txnId = await createCommissionTransaction(
  paymentId, totalAmount, agentId, agentIdRef, franchiseId, franchiseIdRef
)

// 4. Update franchise statistics
await updateFranchiseStatistics(franchiseIdRef, revenue, commission)

// 5. Payout processing (monthly)
await updateCommissionStatus(txnId, 'PAID', payoutDetails)
```

## Database Schema

### Collections Structure
```
Firestore
├── Franchises/
│   └── {franchiseId}
│       ├── id, franchiseId, role
│       ├── ownerName, ownerEmail, ownerPhone
│       ├── franchiseName, territory
│       ├── commissionStructure
│       ├── agents[]
│       ├── statistics
│       └── bankDetails
│
├── Agents/
│   └── {agentId}
│       ├── (existing fields)
│       ├── franchiseId
│       ├── franchiseIdRef
│       ├── isFranchiseAgent
│       └── performanceMetrics
│
├── Commissions/
│   └── {commissionId}
│       ├── transactionId
│       ├── franchiseId, agentId
│       ├── totalAmount
│       ├── commissionAmount
│       ├── splits
│       ├── status
│       └── payoutDetails
│
└── Territories/
    └── {territoryId}
        ├── state, district, mandals
        ├── franchiseId
        ├── assignmentType
        └── statistics
```

## Next Development Phase

### Screens to Create (15+ screens)
1. Authentication (Login, Register, OTP)
2. Agent Management (List, Add, Edit, Detail)
3. Customer Management (List, Add, Edit, Detail)
4. Motor Registration (Add, Edit, List)
5. Payment Processing (Payment, QR, Success)
6. Certificate (Generate, View)
7. Commission Reports
8. Territory Management

### Services to Implement
1. Razorpay payment service
2. PDF generation service
3. Push notification service
4. Location service
5. Image upload service

### Cloud Functions
1. Commission calculation trigger
2. Monthly payout automation
3. Tier upgrade calculation
4. Certificate generation
5. Push notification triggers

## Testing Strategy

### Unit Tests
- Redux slice reducers
- Utility functions
- Commission calculations
- Validation functions

### Integration Tests
- Firebase operations
- API calls
- State management

### E2E Tests
- User flows
- Navigation
- Form submissions
- Payment processing

## Performance Considerations

### Optimization Implemented
- Redux Persist for offline support
- Real-time subscriptions with cleanup
- Memoized selectors
- Lazy loading of screens

### Future Optimizations
- Image optimization
- PDF caching
- Pagination for lists
- Query indexing in Firestore

## Security Implementation

### Current
- TypeScript type safety
- Environment variable protection
- .gitignore for sensitive files

### To Implement
- Firestore security rules
- API key restrictions
- Role-based access control
- Data validation rules

---

**Status**: Core infrastructure complete. Ready for feature extension.
**Next**: Implement remaining screens and services.
**Last Updated**: January 3, 2025
