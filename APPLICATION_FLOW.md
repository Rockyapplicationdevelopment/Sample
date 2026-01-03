# Borumithra Mobile - Application Flow

## Complete User Journey

### 1. Authentication Flow

#### Login Flow (Email/Password)
```
┌─────────────────────────────────────────────────────────────┐
│                      LOGIN SCREEN                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Email / Phone OTP Selection                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Email: _______________________                      │  │
│  │  Password: ____________________                      │  │
│  │                                                       │  │
│  │  [ Login ]                                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Don't have an account? [Register Here]                    │
│  [Forgot Password?]                                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────────┐
              │  Firebase Authentication    │
              │  - Check Agent collection   │
              │  - Check Franchise collection│
              └─────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        ┌──────────────┐        ┌──────────────┐
        │ Agent Found  │        │Franchise Found│
        └──────────────┘        └──────────────┘
                │                       │
                └───────────┬───────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Save to Redux   │
                   │ Save to AsyncStorage │
                   └─────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Navigate to     │
                   │ Dashboard       │
                   └─────────────────┘
```

#### Registration Flow
```
┌─────────────────────────────────────────────────────────────┐
│                   REGISTRATION SCREEN                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  User Type: [ Agent ] [ Franchise ]                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Personal Information                                       │
│  ├─ Full Name: _______________                             │
│  ├─ Email: ___________________                             │
│  ├─ Phone: ___________________                             │
│  └─ Aadhar: __________________                             │
│                                                             │
│  Location                                                   │
│  ├─ State: ___________________                             │
│  ├─ District: ________________                             │
│  ├─ Mandal: __________________                             │
│  └─ Village: _________________                             │
│                                                             │
│  Security                                                   │
│  ├─ Password: ________________                             │
│  └─ Confirm: _________________                             │
│                                                             │
│  [ Continue to Registration ]                              │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
   ┌─────────────────┐           ┌─────────────────┐
   │ Agent Reg Form  │           │Franchise Reg Form│
   │ - Bank Details  │           │ - Territory      │
   │ - PAN, etc      │           │ - Bank Details   │
   └─────────────────┘           │ - Documents      │
            │                     └─────────────────┘
            │                               │
            └───────────────┬───────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Create Firestore Doc│
                 │ - Generate ID       │
                 │ - Set defaults      │
                 └─────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Success Message    │
                 │  Show Generated ID  │
                 └─────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Navigate to Login  │
                 └─────────────────────┘
```

### 2. Dashboard Flow

#### Main Dashboard (All User Types)
```
┌─────────────────────────────────────────────────────────────┐
│                      DASHBOARD SCREEN                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Welcome back, [User Name]                          │  │
│  │  ID: [Agent/Franchise ID]                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │  Customers   │  │   Agents     │ (if admin/franchise)  │
│  │     150      │  │     25       │                       │
│  └──────────────┘  └──────────────┘                       │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │ Total Motors │  │ Technicians  │ (if agent)            │
│  │     320      │  │     45       │                       │
│  └──────────────┘  └──────────────┘                       │
│                                                             │
│  Quick Actions                                              │
│  ┌───────────────────────────────────────────────────┐    │
│  │ 👥 Add Customer                                    │    │
│  │ 🤝 Add Agent        (if admin/franchise)          │    │
│  │ 📋 View Customers                                  │    │
│  │ 👔 View Agents      (if admin/franchise)          │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  Account Information                                        │
│  ├─ Role: [Agent/Franchise/Admin]                         │
│  ├─ Phone: [Phone Number]                                  │
│  ├─ Email: [Email Address]                                 │
│  └─ District/Territory: [Location]                         │
└─────────────────────────────────────────────────────────────┘

Bottom Navigation:
[🏠 Home] [👥 Customers] [🤝 Agents] [🏢 Franchises]
          (always)        (admin)    (super admin)
```

### 3. Customer Management Flow

#### Add Customer Flow
```
┌─────────────────────────────────────────────────────────────┐
│              ADD CUSTOMER SCREEN (Agent Only)                │
│                                                             │
│  Customer Information                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Full Name: _______________                          │  │
│  │  Phone: ____________________                         │  │
│  │  Aadhar: ___________________                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Location                                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  State: _______________________                      │  │
│  │  District: ____________________                      │  │
│  │  Mandal: _______________________                     │  │
│  │  Village: ______________________                     │  │
│  │  Pincode: ______________________                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [ Register Customer ]                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Validate Form       │
                 │ - Check phone exists│
                 └─────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Generate Customer ID│
                 │ BMCUST[ST][DIST]####│
                 └─────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Create Firestore Doc│
                 │ - Link to Agent     │
                 │ - Set location      │
                 └─────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Update Agent Stats  │
                 │ customerCount++     │
                 └─────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Success Alert      │
                 │  Show Customer ID   │
                 └─────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
   ┌─────────────────┐          ┌──────────────────┐
   │  Back to List   │          │  Add Motor       │
   └─────────────────┘          └──────────────────┘
```

#### Customer List Flow
```
┌─────────────────────────────────────────────────────────────┐
│                   CUSTOMER LIST SCREEN                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Search: ____________________  [🔍]                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Total Customers: 150    Active: 145                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [RK] Rajesh Kumar                      [Active]     │  │
│  │       BMCUSTKA1094                                    │  │
│  │       9876543210                                      │  │
│  │  📍 Village, Mandal, District                        │  │
│  │                                                       │  │
│  │  Motors: 2  Approved: 2  State: Karnataka            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [SM] Suresh Mehta                     [Active]      │  │
│  │       BMCUSTKA1095                                    │  │
│  │       9876543211                                      │  │
│  │  📍 Village, Mandal, District                        │  │
│  │                                                       │  │
│  │  Motors: 1  Approved: 0  State: Karnataka            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│                                            [ + FAB ]        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (Tap on Customer)
                            ▼
                ┌─────────────────────────┐
                │  Customer Detail Screen │
                │  - View Motors          │
                │  - Add Motor            │
                │  - Edit Customer        │
                │  - View Payments        │
                └─────────────────────────┘
```

### 4. Agent Management Flow

#### Add Agent Flow
```
┌─────────────────────────────────────────────────────────────┐
│          ADD AGENT SCREEN (Admin/Franchise Only)             │
│                                                             │
│  Personal Information                                        │
│  ├─ Full Name: _______________                             │
│  ├─ Email: ___________________                             │
│  ├─ Phone: ___________________                             │
│  ├─ Aadhar: __________________                             │
│  └─ Blood Group: _____________                             │
│                                                             │
│  Location                                                   │
│  ├─ State: ___________________                             │
│  ├─ District: ________________                             │
│  ├─ Mandal: __________________                             │
│  ├─ Village: _________________                             │
│  └─ Pincode: _________________                             │
│                                                             │
│  Bank Details                                               │
│  ├─ Account Number: ___________                            │
│  ├─ IFSC Code: _______________                             │
│  ├─ Bank Name: _______________                             │
│  └─ PAN Number: ______________                             │
│                                                             │
│  Security                                                   │
│  ├─ Password: ________________                             │
│  └─ Confirm: _________________                             │
│                                                             │
│  [ Register Agent ]                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Validate Form       │
                 │ - Check phone exists│
                 │ - Validate bank     │
                 └─────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Generate Agent ID   │
                 │ BMAGL[ST][DIST]#### │
                 └─────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Create Firestore Doc│
                 │ - Link to Franchise │
                 │   (if franchise)    │
                 │ - Set defaults      │
                 │ - Init metrics      │
                 └─────────────────────┘
                            │
                            ▼
          ┌──────────────────────────────────┐
          │ If Franchise User:               │
          │ - Add to franchise.agents[]      │
          │ - Update franchise stats         │
          └──────────────────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Success Alert      │
                 │  Show Agent ID      │
                 └─────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Back to Agent List │
                 └─────────────────────┘
```

#### Agent List Flow
```
┌─────────────────────────────────────────────────────────────┐
│                     AGENT LIST SCREEN                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Search: ____________________  [🔍]                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [RS] Ramesh Sharma                     [Active]     │  │
│  │       BMAGLIKA1234                                    │  │
│  │       9876543210                                      │  │
│  │                                                       │  │
│  │  Customers: 45  Technicians: 12  District: Karnataka │  │
│  │                                                       │  │
│  │  [Franchise Agent]                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [PK] Prakash Kumar                    [Active]      │  │
│  │       BMAGLIKA1235                                    │  │
│  │       9876543211                                      │  │
│  │                                                       │  │
│  │  Customers: 32  Technicians: 8   District: Karnataka │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│                                            [ + FAB ]        │
└─────────────────────────────────────────────────────────────┘
```

### 5. Application State Flow

#### Redux State Structure
```
AppState
├─ user: Agent | Franchise | null
├─ userType: 'AGENT' | 'FRANCHISE' | null
├─ isAuthenticated: boolean
├─ loading: boolean
└─ error: string | null

FranchiseState
├─ franchises: Franchise[]
├─ currentFranchise: Franchise | null
├─ loading: boolean
└─ error: string | null

CommissionState
├─ commissions: Commission[]
├─ summary: CommissionSummary | null
├─ loading: boolean
└─ error: string | null

TerritoryState
├─ territories: Territory[]
├─ selectedTerritory: Territory | null
├─ loading: boolean
└─ error: string | null
```

#### Data Persistence Flow
```
┌─────────────────────────────────────────────────────────────┐
│                    App Launch                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
            ┌─────────────────────┐
            │  Redux Persist      │
            │  Load from AsyncStorage │
            └─────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌───────────────┐            ┌───────────────┐
│Authenticated? │            │Not Authenticated│
│     YES       │            │       NO        │
└───────┬───────┘            └───────┬───────┘
        │                             │
        ▼                             ▼
┌───────────────┐            ┌───────────────┐
│Navigate to    │            │Navigate to    │
│Dashboard      │            │Login Screen   │
└───────────────┘            └───────────────┘
```

### 6. Navigation Structure

```
Root Navigator
│
├─ Auth Stack (if not authenticated)
│  ├─ Login Screen
│  └─ Register Screen
│
└─ Main Stack (if authenticated)
   ├─ Bottom Tab Navigator
   │  ├─ Dashboard (Home Tab)
   │  ├─ Customer List Tab
   │  ├─ Agent List Tab (if admin/franchise)
   │  └─ Franchise List Tab (if super admin)
   │
   └─ Modal Screens
      ├─ Add Agent
      ├─ Add Customer
      ├─ Add Franchise
      ├─ Customer Detail
      ├─ Agent Detail
      └─ Franchise Dashboard
```

### 7. Role-Based Access Control

```
┌─────────────────────────────────────────────────────────────┐
│                  User Role Hierarchy                         │
└─────────────────────────────────────────────────────────────┘

Super Admin
├─ View/Manage all Agents
├─ View/Manage all Franchises
├─ View/Manage all Customers
├─ View all Reports
└─ Access all features

Franchise Owner
├─ View/Manage Franchise Agents
├─ View Franchise Customers (via agents)
├─ View Commission Reports
├─ View Territory
└─ Franchise Dashboard

Admin Agent
├─ View/Manage Agents (same level)
├─ View all Customers
├─ Manage Technicians
└─ Admin Dashboard

Regular Agent
├─ Add/Manage own Customers
├─ Add/Manage own Technicians
├─ Register Motors
├─ Process Payments
└─ Agent Dashboard
```

### 8. Firestore Data Flow

```
User Action (e.g., Add Customer)
        │
        ▼
┌────────────────┐
│ Validate Form  │
└────────────────┘
        │
        ▼
┌────────────────┐
│ Generate IDs   │
└────────────────┘
        │
        ▼
┌────────────────┐
│ Firestore Write│
│ (Transactions) │
└────────────────┘
        │
        ▼
┌────────────────┐
│ Update Related │
│ Documents      │
│ (e.g., Agent)  │
└────────────────┘
        │
        ▼
┌────────────────┐
│ Real-time      │
│ Listener       │
│ Updates UI     │
└────────────────┘
```

### 9. Offline Support

```
┌─────────────────────────────────────────────────────────────┐
│                    Offline Handling                          │
└─────────────────────────────────────────────────────────────┘

Online State
├─ Real-time Firestore subscriptions
├─ Immediate data sync
└─ Full functionality

Offline State
├─ Redux Persist maintains state
├─ AsyncStorage keeps data
├─ Show offline indicator
└─ Queue operations for sync

Back Online
├─ Auto-sync pending operations
├─ Refresh all subscriptions
├─ Update UI with latest data
└─ Show sync complete notification
```

## Summary

### User Journey Flow
1. **Launch App** → Check authentication
2. **Login/Register** → Validate & save credentials
3. **Dashboard** → View statistics & quick actions
4. **Manage Entities** → Add/Edit Agents, Customers
5. **View Lists** → Search & filter data
6. **Real-time Updates** → Firestore subscriptions
7. **Logout** → Clear state & return to login

### Key Features
- ✅ Role-based access control
- ✅ Real-time data synchronization
- ✅ Offline support with Redux Persist
- ✅ Auto-generated unique IDs
- ✅ Form validation
- ✅ Search and filter functionality
- ✅ Bottom tab navigation
- ✅ Franchise model integration
- ✅ Commission tracking ready

### Screen Count
- **Auth**: 2 screens (Login, Register)
- **Dashboard**: 1 screen
- **Agent**: 2 screens (List, Add)
- **Customer**: 2 screens (List, Add)
- **Franchise**: 3 screens (Dashboard, List, Add)

**Total**: 10 screens implemented

---

**Last Updated**: January 3, 2025
