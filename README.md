# Borumithra Mobile - Documentation

Welcome to the Borumithra Mobile application documentation. This repository contains comprehensive documentation for the water motor registration and certification management platform, including the newly designed **Franchise Model**.

## 📚 Documentation Overview

This documentation suite covers all aspects of the Borumithra Mobile application, from technical architecture to user guides, with a special focus on the franchise business model implementation.

## 🗂️ Document Structure

### Core Documentation Files

1. **[DOCUMENTATION_PLAN.md](./DOCUMENTATION_PLAN.md)** - *Main Document*
   - Comprehensive documentation plan covering all aspects of the application
   - Complete franchise model architecture and data models
   - API specifications and endpoints
   - User guides for all roles
   - Business model documentation
   - Implementation roadmap
   - Documentation standards and guidelines

2. **[FRANCHISE_MODEL_GUIDE.md](./FRANCHISE_MODEL_GUIDE.md)** - *Quick Reference*
   - Visual hierarchy diagrams
   - Database schema changes
   - API endpoints quick reference
   - UI/UX changes required
   - Implementation checklist
   - Testing scenarios
   - Step-by-step implementation guide

## 🎯 Quick Links

### For Developers
- [System Architecture](./DOCUMENTATION_PLAN.md#41-architecture-documentation)
- [Data Models](./DOCUMENTATION_PLAN.md#42-data-models-documentation)
- [API Documentation](./DOCUMENTATION_PLAN.md#43-api-documentation)
- [Implementation Checklist](./FRANCHISE_MODEL_GUIDE.md#5-implementation-checklist)
- [Database Schema](./FRANCHISE_MODEL_GUIDE.md#2-database-schema-changes)

### For Business Team
- [Franchise Business Model](./DOCUMENTATION_PLAN.md#61-franchise-business-model-06-business-modelfranchise-business-modelmd)
- [Revenue Sharing Structure](./DOCUMENTATION_PLAN.md#36-key-features-of-franchise-model)
- [Commission Tiers](./FRANCHISE_MODEL_GUIDE.md#14-commission-tier-system)
- [Territory Management](./DOCUMENTATION_PLAN.md#323-territory-model)

### For Franchise Owners
- [Franchise Registration Process](./DOCUMENTATION_PLAN.md#361-franchise-registration--onboarding)
- [Dashboard Overview](./DOCUMENTATION_PLAN.md#365-franchise-dashboard)
- [Agent Management](./DOCUMENTATION_PLAN.md#363-agent-allocation)
- [Commission Structure](./DOCUMENTATION_PLAN.md#364-commission-distribution)

### For Project Managers
- [Implementation Roadmap](./DOCUMENTATION_PLAN.md#5-implementation-roadmap)
- [Success Metrics](./DOCUMENTATION_PLAN.md#8-success-metrics)
- [Testing Scenarios](./FRANCHISE_MODEL_GUIDE.md#6-testing-scenarios)

## 🚀 Project Overview

**Borumithra Mobile** is a comprehensive React Native application designed for managing water motor registrations, certifications, and payments with a multi-tier franchise business model.

### Key Features

✅ **User Authentication** - Email/Password & Phone OTP  
✅ **Franchise Management** - Multi-level business hierarchy  
✅ **Agent Management** - CRUD operations with franchise integration  
✅ **Customer Management** - Registration, updates, motor assignment  
✅ **Technician Management** - Service provider management  
✅ **Motor Registration & Certification** - With PDF certificate generation  
✅ **Payment Processing** - Razorpay integration with commission split  
✅ **Commission Management** - Automated calculation and payout  
✅ **Territory Management** - Geographic area assignment  
✅ **Analytics & Reporting** - Comprehensive dashboards  
✅ **Location Tracking** - GPS-based location capture  
✅ **Push Notifications** - Firebase Cloud Messaging  

## 🏗️ Franchise Model at a Glance

```
Super Admin
    │
    ├── Franchise Owner (Territory: State/District)
    │   ├── Agent 1
    │   │   ├── Customer 1 → Motors → Payments
    │   │   └── Customer 2 → Motors → Payments
    │   ├── Agent 2
    │   └── Agent 3
    │
    └── Independent Agents (Direct to Admin)
```

### Commission Flow

```
Customer Payment (₹1000)
    │
    ├─> Platform Fee (10%) = ₹100
    ├─> Franchise Commission (15-30%) = ₹135-270
    └─> Agent Commission (60-75%) = ₹630-765
```

*Commission percentages vary by franchise tier*

## 📊 Franchise Tiers

| Tier | Monthly Revenue | Franchise Commission | Agent Commission |
|------|----------------|---------------------|------------------|
| Bronze | ₹0 - ₹50,000 | 15% | 75% |
| Silver | ₹50,001 - ₹1,00,000 | 20% | 70% |
| Gold | ₹1,00,001 - ₹2,50,000 | 25% | 65% |
| Platinum | ₹2,50,001+ | 30% | 60% |

*Platform retains 10% fee before split*

## 🛠️ Technology Stack

### Core Technologies
- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management with Redux Persist
- **React Navigation** - Navigation library

### Firebase Services
- **Authentication** - Phone OTP verification
- **Cloud Firestore** - NoSQL database
- **Cloud Storage** - File storage
- **Cloud Functions** - Backend logic
- **Cloud Messaging** - Push notifications
- **Crashlytics** - Error tracking

### Third-party Integrations
- **Razorpay** - Payment gateway
- **React Native Maps** - Location services
- **React Native HTML to PDF** - Certificate generation
- **Notifee** - Local notifications

## ✅ NATIVE FOLDERS ADDED - READY TO RUN!

**Great news! The `android/` and `ios/` folders have been successfully added to the project!**

### Current Status
✅ **Complete:**
- All TypeScript source code (10 screens)
- Redux state management (4 slices)
- Data models (9 models)
- Firebase services
- Navigation setup
- Complete documentation
- **✅ `android/` folder - ADDED!**
- **✅ `ios/` folder - ADDED!**

### Quick Start (3 Steps)

#### Step 1: Install Dependencies
```bash
npm install

# For iOS (Mac only)
cd ios && pod install && cd ..
```

#### Step 2: Configure Firebase
- Download `google-services.json` → Place in `android/app/`
- Download `GoogleService-Info.plist` → Add to Xcode project
- See **[NATIVE_FOLDERS_ADDED.md](./NATIVE_FOLDERS_ADDED.md)** for details

#### Step 3: Run the App
```bash
npm start           # Start Metro bundler
npm run android     # Run on Android
npm run ios         # Run on iOS (Mac only)
```

📖 **Read [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) for complete setup guide.**

## 📋 Implementation Status

### Phase 1: Core Development ✅
- [x] Documentation structure created
- [x] Franchise model designed
- [x] Data models defined (9 models)
- [x] Redux state management implemented
- [x] 10 screens implemented (Auth, Dashboard, Agent, Customer, Franchise)
- [x] Firebase helper functions
- [x] Navigation structure
- [x] Complete application flow

### Phase 2: Native Setup ✅
- [x] Initialize `android/` folder → **DONE!**
- [x] Initialize `ios/` folder → **DONE!**
- [ ] Configure Firebase native modules → **Next: Add config files**
- [ ] Configure permissions
- [ ] Test on emulators

### Phase 3: Integration & Testing (Upcoming)
- [ ] Firebase collections setup
- [ ] Motor registration feature
- [ ] Payment integration (Razorpay)
- [ ] Certificate generation
- [ ] Commission calculations
- [ ] Unit testing
- [ ] Integration testing

### Phase 4: Deployment (Upcoming)
- [ ] Production build (Android)
- [ ] Production build (iOS)
- [ ] App store submission
- [ ] User acceptance testing

## 🎯 Getting Started

### For Developers

1. **Review Architecture**
   ```bash
   # Read the main documentation plan
   cat DOCUMENTATION_PLAN.md
   
   # Review implementation guide
   cat FRANCHISE_MODEL_GUIDE.md
   ```

2. **Setup Development Environment**
   - Follow setup instructions in [Development Documentation](./DOCUMENTATION_PLAN.md#7-development)
   - Configure Firebase project
   - Install dependencies

3. **Start Implementation**
   - Follow the [Implementation Checklist](./FRANCHISE_MODEL_GUIDE.md#5-implementation-checklist)
   - Create feature branch: `feature/franchise-model`
   - Begin with database schema setup

### For Franchise Owners

1. **Registration Process**
   - Submit franchise application through admin
   - Provide required documents
   - Wait for approval (2-3 business days)

2. **Onboarding**
   - Receive login credentials
   - Complete profile setup
   - Review franchise agreement
   - Attend training session

3. **Start Operations**
   - Add agents to your franchise
   - Monitor dashboard analytics
   - Track commission earnings

## 📖 Documentation Sections

### 1. Architecture Documentation
- System architecture overview
- Franchise hierarchy and data flow
- Security architecture
- Infrastructure setup

### 2. Data Models
- Franchise model
- Commission model
- Territory model
- Updated agent, customer, and payment models

### 3. API Documentation
- Franchise management APIs
- Commission management APIs
- Analytics and reporting APIs
- Territory management APIs

### 4. Feature Documentation
- Franchise management features
- Agent allocation and management
- Territory management
- Commission distribution
- Analytics and reporting

### 5. User Guides
- Franchise owner guide
- Agent guide (updated with franchise context)
- Admin guide (franchise management)
- Customer guide
- Technician guide

### 6. Business Documentation
- Franchise business model
- Revenue sharing structure
- Commission tiers
- Pricing strategy
- Territory allocation
- Legal and compliance

### 7. Development Documentation
- Setup instructions
- Coding standards
- Testing guidelines
- Deployment procedures

## 🔑 Key Concepts

### Franchise
A business entity that manages multiple agents within a designated territory. Franchise owners earn commission on all transactions processed by their agents.

### Territory
A geographic area (state, district, or mandal) assigned to a franchise. Can be exclusive or shared.

### Commission Tier
Performance-based tiers (Bronze, Silver, Gold, Platinum) that determine commission percentages. Tiers upgrade automatically based on monthly revenue.

### Agent Allocation
The process of assigning agents to a franchise. Agents must operate within the franchise's territory.

### Commission Split
The distribution of payment amount between platform, franchise, and agent based on the current tier.

## 📞 Support & Contact

### Documentation Team
- **Documentation Lead**: [To be assigned]
- **Technical Writer**: [To be assigned]
- **Technical Reviewer**: [To be assigned]

### Project Team
- **Project Manager**: [Contact]
- **Technical Lead**: [Contact]
- **Business Lead**: [Contact]

### Feedback
For documentation feedback or suggestions:
- **Email**: docs@borumithra.com
- **Slack**: #documentation
- **GitHub Issues**: [Create an issue]

## 🗺️ Roadmap

### Q1 2025
- ✅ Complete documentation plan
- ✅ Design franchise model
- 🔄 Backend implementation
- 🔄 Frontend development

### Q2 2025
- Testing and QA
- Beta launch with pilot franchises
- Gather feedback and iterate

### Q3 2025
- Full production launch
- Onboard first 10 franchises
- Performance optimization

### Q4 2025
- Scale to 50+ franchises
- Advanced analytics features
- Mobile app enhancements

## 📜 Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2025-01-03 | Initial documentation plan with franchise model |

## 📝 License

[Your License Information]

## 🙏 Acknowledgments

This documentation was created to support the implementation of a comprehensive franchise model for the Borumithra Mobile application, enabling scalable growth and efficient business operations.

---

**For detailed information, refer to:**
- [Complete Documentation Plan](./DOCUMENTATION_PLAN.md)
- [Franchise Implementation Guide](./FRANCHISE_MODEL_GUIDE.md)

**Last Updated**: January 3, 2025
