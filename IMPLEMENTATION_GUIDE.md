# Borumithra Mobile - Implementation Guide

This guide will help you set up and run the Borumithra Mobile application with the franchise model implementation.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9
- React Native development environment set up
- Firebase project created
- Razorpay account (for payment integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd borumithra-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase and Razorpay credentials:
   ```
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Configure Firebase**
   
   Download the following files from your Firebase console:
   - For Android: `google-services.json` → Place in `android/app/`
   - For iOS: `GoogleService-Info.plist` → Place in `ios/`

5. **Install iOS dependencies (macOS only)**
   ```bash
   cd ios
   pod install
   cd ..
   ```

### Running the App

#### Android
```bash
npm run android
```

#### iOS (macOS only)
```bash
npm run ios
```

#### Start Metro Bundler (if not started automatically)
```bash
npm start
```

## 📁 Project Structure

```
borumithra-mobile/
├── src/
│   ├── models/              # TypeScript interfaces and types
│   │   ├── Agent.ts
│   │   ├── Franchise.ts
│   │   ├── Commission.ts
│   │   ├── Territory.ts
│   │   ├── Customer.ts
│   │   ├── Technician.ts
│   │   ├── Motor.ts
│   │   ├── Payment.ts
│   │   └── Location.ts
│   │
│   ├── screens/             # Screen components
│   │   └── Franchise/
│   │       ├── FranchiseDashboardScreen.tsx
│   │       ├── FranchiseListScreen.tsx
│   │       └── AddFranchiseScreen.tsx
│   │
│   ├── services/            # Business logic and API calls
│   │   └── firebaseHelper.ts
│   │
│   ├── redux/               # State management
│   │   ├── slices/
│   │   │   ├── appSlice.ts
│   │   │   ├── franchiseSlice.ts
│   │   │   ├── commissionSlice.ts
│   │   │   └── territorySlice.ts
│   │   ├── store.ts
│   │   └── hooks.ts
│   │
│   ├── constants/           # App constants and configuration
│   │   └── config.ts
│   │
│   └── utils/               # Utility functions
│       └── helpers.ts
│
├── App.tsx                  # Main app component
├── index.js                 # App entry point
├── package.json
├── tsconfig.json
├── babel.config.js
└── metro.config.js
```

## 🗄️ Firebase Setup

### 1. Create Firestore Collections

Create the following collections in your Firebase Firestore:

- `Franchises` - Franchise data
- `Agents` - Agent data
- `Customers` - Customer data
- `Technicians` - Technician data
- `Commissions` - Commission transactions
- `Territories` - Territory assignments
- `Payments` - Payment records

### 2. Configure Firestore Security Rules

Update your Firestore security rules to match the franchise model requirements. See `FRANCHISE_MODEL_GUIDE.md` section 2.3 for detailed rules.

### 3. Set up Firebase Storage

Create the following folders in Firebase Storage:
- `/agents/` - Agent profile photos and documents
- `/franchises/` - Franchise documents
- `/customers/` - Customer profile photos
- `/motors/` - Motor photos
- `/certificates/` - Generated PDF certificates

### 4. Configure Firebase Authentication

Enable the following authentication methods:
- Email/Password
- Phone (for OTP verification)

## 🔑 Key Features Implemented

### Franchise Management
- ✅ Franchise registration and onboarding
- ✅ Franchise dashboard with statistics
- ✅ Agent assignment to franchises
- ✅ Territory management
- ✅ Commission tracking

### Commission System
- ✅ Automatic commission calculation
- ✅ Tiered commission structure (Bronze, Silver, Gold, Platinum)
- ✅ Commission split between franchise, agent, and platform
- ✅ Real-time commission tracking

### Data Models
- ✅ Franchise model with territory and statistics
- ✅ Commission model with splits and payout details
- ✅ Territory model with geographic boundaries
- ✅ Updated Agent model with franchise integration
- ✅ Payment model with commission tracking

### State Management
- ✅ Redux Toolkit for state management
- ✅ Redux Persist for data persistence
- ✅ Separate slices for franchise, commission, and territory

### Firebase Integration
- ✅ Real-time Firestore subscriptions
- ✅ Firebase Authentication
- ✅ Firebase Storage for file uploads
- ✅ Transaction-based updates for data consistency

## 📊 Commission Tier System

| Tier | Monthly Revenue | Franchise Commission | Agent Commission |
|------|----------------|---------------------|------------------|
| Bronze | ₹0 - ₹50,000 | 15% | 75% |
| Silver | ₹50,001 - ₹1,00,000 | 20% | 70% |
| Gold | ₹1,00,001 - ₹2,50,000 | 25% | 65% |
| Platinum | ₹2,50,001+ | 30% | 60% |

*Platform retains 10% fee before split*

## 🧪 Testing

### Manual Testing Checklist

1. **Franchise Registration**
   - [ ] Create a new franchise
   - [ ] Verify franchise ID generation
   - [ ] Check default commission tier (Bronze)
   - [ ] Verify pending approval status

2. **Franchise Dashboard**
   - [ ] View franchise statistics
   - [ ] Check agent count
   - [ ] Verify commission calculations
   - [ ] Review territory information

3. **Agent Assignment**
   - [ ] Assign agent to franchise
   - [ ] Verify agent appears in franchise list
   - [ ] Check franchise statistics update

4. **Commission Calculation**
   - [ ] Process a payment
   - [ ] Verify commission split calculation
   - [ ] Check commission status (PENDING)
   - [ ] Verify franchise statistics update

## 🔧 Development Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run tests (when implemented)
npm test
```

## 📱 Screen Navigation

### Current Implementation

```
FranchiseListScreen (Main)
├── AddFranchiseScreen (Add new franchise)
└── FranchiseDashboardScreen (View franchise details)
```

### To be Extended

```
AuthScreen (Login/Register)
├── AgentDashboard
│   ├── CustomerList
│   │   └── AddCustomer
│   ├── TechnicianList
│   │   └── AddTechnician
│   └── MotorRegistration
│       └── PaymentScreen
│
└── FranchiseDashboard
    ├── FranchiseAgentList
    ├── CommissionReport
    └── TerritoryView
```

## 🚧 Next Steps

### Phase 2: Backend Development (In Progress)
- [ ] Implement Cloud Functions for commission processing
- [ ] Set up automated payout system
- [ ] Configure Firebase security rules
- [ ] Implement push notifications

### Phase 3: Frontend Development
- [ ] Complete all CRUD screens
- [ ] Implement payment integration
- [ ] Add certificate generation
- [ ] Create analytics dashboard

### Phase 4: Testing & Deployment
- [ ] Unit tests
- [ ] Integration tests
- [ ] User acceptance testing
- [ ] Production deployment

## 📚 Additional Resources

- [Complete Documentation Plan](./DOCUMENTATION_PLAN.md)
- [Franchise Model Guide](./FRANCHISE_MODEL_GUIDE.md)
- [Quick Start Guide](./QUICK_START.md)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler errors**
   ```bash
   npm start -- --reset-cache
   ```

2. **Android build errors**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

3. **iOS build errors (macOS)**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   npm run ios
   ```

4. **TypeScript errors**
   ```bash
   npm run type-check
   ```

## 📞 Support

For issues or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Refer to documentation files

## 📄 License

[Your License Information]

---

**Last Updated**: January 3, 2025
