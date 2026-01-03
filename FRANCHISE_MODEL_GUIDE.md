# Franchise Model - Quick Implementation Guide

## Overview

This guide provides a quick reference for implementing the franchise model in the Borumithra Mobile application. It serves as a companion to the comprehensive [DOCUMENTATION_PLAN.md](./DOCUMENTATION_PLAN.md).

---

## Table of Contents

1. [Franchise Model at a Glance](#1-franchise-model-at-a-glance)
2. [Database Schema Changes](#2-database-schema-changes)
3. [API Endpoints Quick Reference](#3-api-endpoints-quick-reference)
4. [UI/UX Changes Required](#4-uiux-changes-required)
5. [Implementation Checklist](#5-implementation-checklist)
6. [Testing Scenarios](#6-testing-scenarios)

---

## 1. Franchise Model at a Glance

### 1.1 Visual Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                        SUPER ADMIN                          │
│                   (Platform Administrator)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  FRANCHISE 1  │ │  FRANCHISE 2  │ │  FRANCHISE 3  │
│ (Karnataka)   │ │ (Telangana)   │ │ (Andhra)      │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │                 │                 │
   ┌────┼────┐       ┌────┼────┐       ┌────┼────┐
   │    │    │       │    │    │       │    │    │
   ▼    ▼    ▼       ▼    ▼    ▼       ▼    ▼    ▼
┌─────┐ │ ┌─────┐ ┌─────┐ │ ┌─────┐ ┌─────┐ │ ┌─────┐
│AGT-1│ │ │AGT-2│ │AGT-3│ │ │AGT-4│ │AGT-5│ │ │AGT-6│
└──┬──┘ │ └──┬──┘ └──┬──┘ │ └──┬──┘ └──┬──┘ │ └──┬──┘
   │    │    │       │    │    │       │    │    │
   ▼    ▼    ▼       ▼    ▼    ▼       ▼    ▼    ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│   CUSTOMERS    │ │   CUSTOMERS    │ │   CUSTOMERS    │
│   TECHNICIANS  │ │   TECHNICIANS  │ │   TECHNICIANS  │
│   MOTORS       │ │   MOTORS       │ │   MOTORS       │
└────────────────┘ └────────────────┘ └────────────────┘
```

### 1.2 User Roles & Permissions Matrix

| Feature | Super Admin | Franchise Owner | Agent | Customer |
|---------|------------|----------------|-------|----------|
| **Franchise Management** |
| Create Franchise | ✅ | ❌ | ❌ | ❌ |
| Approve Franchise | ✅ | ❌ | ❌ | ❌ |
| View All Franchises | ✅ | ❌ (own only) | ❌ | ❌ |
| Edit Franchise | ✅ | ✅ (own only) | ❌ | ❌ |
| Delete Franchise | ✅ | ❌ | ❌ | ❌ |
| **Territory Management** |
| Assign Territory | ✅ | ❌ | ❌ | ❌ |
| View Territory | ✅ | ✅ (assigned) | ❌ | ❌ |
| Territory Analytics | ✅ | ✅ (own only) | ❌ | ❌ |
| **Agent Management** |
| Add Agent to Franchise | ✅ | ✅ | ❌ | ❌ |
| Approve Agent | ✅ | ✅ (within franchise) | ❌ | ❌ |
| View All Agents | ✅ | ✅ (franchise agents) | ❌ (self only) | ❌ |
| Edit Agent | ✅ | ✅ (franchise agents) | ✅ (self only) | ❌ |
| Suspend Agent | ✅ | ✅ (franchise agents) | ❌ | ❌ |
| **Customer Management** |
| Register Customer | ✅ | ❌ | ✅ | ❌ |
| View Customers | ✅ | ✅ (franchise) | ✅ (own) | ✅ (self) |
| Edit Customer | ✅ | ❌ | ✅ (own) | ❌ |
| **Commission Management** |
| Set Commission Structure | ✅ | ❌ | ❌ | ❌ |
| View Commission | ✅ | ✅ (own) | ✅ (own) | ❌ |
| Process Payout | ✅ | ❌ | ❌ | ❌ |
| **Analytics & Reports** |
| View All Analytics | ✅ | ❌ | ❌ | ❌ |
| Franchise Dashboard | ✅ | ✅ (own) | ❌ | ❌ |
| Agent Dashboard | ✅ | ✅ (view only) | ✅ | ❌ |
| Revenue Reports | ✅ | ✅ (franchise) | ✅ (own) | ❌ |

### 1.3 Data Flow: Customer Payment to Commission Split

```
┌──────────────────────────────────────────────────────────────┐
│                    CUSTOMER MAKES PAYMENT                    │
│                   (Motor Registration ₹1000)                 │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                   RAZORPAY PROCESSES PAYMENT                 │
│                   (Payment Successful)                       │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│               CREATE PAYMENT RECORD IN FIRESTORE             │
│                 (Collection: 'Payments')                     │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│              CALCULATE COMMISSION SPLIT                      │
│                                                              │
│  Total Amount: ₹1000                                         │
│  ├─ Platform Fee (10%): ₹100                                │
│  ├─ Remaining: ₹900                                          │
│  │                                                           │
│  ├─ Franchise Commission (20% of ₹900): ₹180                │
│  └─ Agent Commission (80% of ₹900): ₹720                    │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│           CREATE COMMISSION TRANSACTION RECORDS              │
│                                                              │
│  1. Franchise Commission Record                             │
│     - Amount: ₹180                                           │
│     - Status: PENDING                                        │
│     - FranchiseID: BMFRNCH-KA-001                           │
│                                                              │
│  2. Agent Commission Record                                 │
│     - Amount: ₹720                                           │
│     - Status: PENDING                                        │
│     - AgentID: BMAGLI1061                                   │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│              UPDATE STATISTICS                               │
│                                                              │
│  1. Franchise Statistics                                     │
│     - totalRevenue += ₹1000                                 │
│     - pendingCommission += ₹180                             │
│                                                              │
│  2. Agent Performance Metrics                               │
│     - currentMonthRevenue += ₹1000                          │
│     - pendingCommission += ₹720                             │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│            MONTHLY PAYOUT PROCESS (1st of Month)             │
│                                                              │
│  1. Calculate total pending commission                       │
│  2. If > Minimum threshold (₹1000)                          │
│  3. Process bank transfer                                    │
│  4. Update commission status: PENDING → PAID                 │
│  5. Record payout details (UTR, date, method)               │
└──────────────────────────────────────────────────────────────┘
```

### 1.4 Commission Tier System

```
┌─────────────────────────────────────────────────────────────┐
│                    COMMISSION TIER SYSTEM                   │
└─────────────────────────────────────────────────────────────┘

Tier: BRONZE (Default)
├─ Monthly Revenue: ₹0 - ₹50,000
├─ Platform Fee: 10%
├─ Franchise Commission: 15% of (Total - Platform Fee)
├─ Agent Commission: 75% of (Total - Platform Fee)
└─ Example: ₹1000 payment
   ├─ Platform: ₹100
   ├─ Franchise: ₹135 (15% of ₹900)
   └─ Agent: ₹675 (75% of ₹900)

Tier: SILVER
├─ Monthly Revenue: ₹50,001 - ₹1,00,000
├─ Platform Fee: 10%
├─ Franchise Commission: 20% of (Total - Platform Fee)
├─ Agent Commission: 70% of (Total - Platform Fee)
└─ Example: ₹1000 payment
   ├─ Platform: ₹100
   ├─ Franchise: ₹180 (20% of ₹900)
   └─ Agent: ₹720 (70% of ₹900)

Tier: GOLD
├─ Monthly Revenue: ₹1,00,001 - ₹2,50,000
├─ Platform Fee: 10%
├─ Franchise Commission: 25% of (Total - Platform Fee)
├─ Agent Commission: 65% of (Total - Platform Fee)
└─ Example: ₹1000 payment
   ├─ Platform: ₹100
   ├─ Franchise: ₹225 (25% of ₹900)
   └─ Agent: ₹675 (65% of ₹900)

Tier: PLATINUM
├─ Monthly Revenue: ₹2,50,001+
├─ Platform Fee: 10%
├─ Franchise Commission: 30% of (Total - Platform Fee)
├─ Agent Commission: 60% of (Total - Platform Fee)
└─ Example: ₹1000 payment
   ├─ Platform: ₹100
   ├─ Franchise: ₹270 (30% of ₹900)
   └─ Agent: ₹630 (60% of ₹900)

* Tier upgrades happen automatically based on previous month's revenue
* Bonus structure: Additional 2% for exceeding tier target by 20%
```

---

## 2. Database Schema Changes

### 2.1 New Firestore Collections

#### Collection: `Franchises`

```
Franchises/
├─ {franchiseDocId}/
   ├─ id: string
   ├─ franchiseId: string (unique, e.g., "BMFRNCH-KA-001")
   ├─ role: "FRANCHISE"
   ├─ ownerName: string
   ├─ ownerEmail: string
   ├─ ownerPhone: string
   ├─ franchiseName: string
   ├─ territory: object
   │  ├─ type: string
   │  ├─ state: string
   │  ├─ districts: array
   │  └─ exclusiveRights: boolean
   ├─ commissionStructure: object
   │  ├─ motorRegistrationCommission: number
   │  ├─ certificateRenewalCommission: number
   │  └─ currentTier: string
   ├─ agents: array [agentId1, agentId2, ...]
   ├─ statistics: object
   │  ├─ totalRevenue: number
   │  ├─ totalCommission: number
   │  ├─ pendingCommission: number
   │  └─ monthlyRevenue: array
   ├─ isActive: boolean
   ├─ isApproved: boolean
   ├─ createdAt: timestamp
   └─ updatedAt: timestamp
```

#### Collection: `Commissions`

```
Commissions/
├─ {commissionDocId}/
   ├─ id: string
   ├─ transactionId: string (unique)
   ├─ franchiseId: string
   ├─ franchiseIdRef: string
   ├─ agentId: string
   ├─ agentIdRef: string
   ├─ customerId: string
   ├─ motorId: string
   ├─ paymentId: string
   ├─ transactionType: string
   ├─ totalAmount: number
   ├─ commissionPercentage: number
   ├─ commissionAmount: number
   ├─ splits: object
   │  ├─ franchiseCommission: number
   │  ├─ agentCommission: number
   │  ├─ adminShare: number
   │  └─ taxDeducted: number
   ├─ status: string
   ├─ payoutDetails: object
   │  ├─ payoutDate: string
   │  ├─ payoutMethod: string
   │  └─ utrNumber: string
   ├─ createdAt: timestamp
   └─ processedAt: timestamp
```

#### Collection: `Territories`

```
Territories/
├─ {territoryDocId}/
   ├─ id: string
   ├─ territoryId: string (e.g., "BMTER-KA-BGP")
   ├─ state: string
   ├─ district: string
   ├─ mandals: array
   ├─ franchiseId: string (nullable)
   ├─ franchiseIdRef: string (nullable)
   ├─ assignmentType: string
   ├─ boundaries: object (GeoJSON)
   ├─ statistics: object
   │  ├─ activeCustomers: number
   │  ├─ activeAgents: number
   │  └─ totalRevenue: number
   ├─ isActive: boolean
   └─ assignedAt: timestamp
```

### 2.2 Updates to Existing Collections

#### Collection: `Agents` (Updates)

```
Agents/
├─ {agentDocId}/
   ├─ ... (existing fields)
   ├─ franchiseId: string (NEW - nullable)
   ├─ franchiseIdRef: string (NEW - nullable)
   ├─ isFranchiseAgent: boolean (NEW)
   ├─ commissionSettings: object (NEW)
   │  ├─ motorRegistrationShare: number
   │  └─ certificateRenewalShare: number
   └─ performanceMetrics: object (NEW)
      ├─ monthlyTarget: number
      ├─ currentMonthRevenue: number
      ├─ totalRevenue: number
      └─ totalCommission: number
```

#### Collection: `Payments` (Updates)

```
Payments/
├─ {paymentDocId}/
   ├─ ... (existing fields)
   ├─ franchiseId: string (NEW - nullable)
   ├─ franchiseIdRef: string (NEW - nullable)
   ├─ commissionCalculated: boolean (NEW)
   ├─ commissionTransactionId: string (NEW)
   └─ tierApplied: string (NEW)
```

### 2.3 Firebase Security Rules Updates

```javascript
// rules_v2.0.rules

// Franchise Collection Rules
match /Franchises/{franchiseId} {
  // Allow read for authenticated franchise owners (their own doc)
  allow read: if request.auth != null && 
                 request.auth.uid == resource.data.id;
  
  // Allow read for super admins
  allow read: if request.auth != null && 
                 get(/databases/$(database)/documents/Agents/$(request.auth.uid)).data.isSuperAdmin == true;
  
  // Allow create only for super admins
  allow create: if request.auth != null && 
                   get(/databases/$(database)/documents/Agents/$(request.auth.uid)).data.isSuperAdmin == true;
  
  // Allow update for franchise owner (their own doc) or super admin
  allow update: if request.auth != null && (
                     request.auth.uid == resource.data.id ||
                     get(/databases/$(database)/documents/Agents/$(request.auth.uid)).data.isSuperAdmin == true
                   );
  
  // Allow delete only for super admins
  allow delete: if request.auth != null && 
                   get(/databases/$(database)/documents/Agents/$(request.auth.uid)).data.isSuperAdmin == true;
}

// Commission Collection Rules
match /Commissions/{commissionId} {
  // Allow read for franchise owner (their commissions)
  allow read: if request.auth != null && 
                 resource.data.franchiseIdRef == request.auth.uid;
  
  // Allow read for agent (their commissions)
  allow read: if request.auth != null && 
                 resource.data.agentIdRef == request.auth.uid;
  
  // Allow read for super admins
  allow read: if request.auth != null && 
                 get(/databases/$(database)/documents/Agents/$(request.auth.uid)).data.isSuperAdmin == true;
  
  // Allow create only via Cloud Functions (service account)
  allow create: if request.auth != null && 
                   get(/databases/$(database)/documents/Agents/$(request.auth.uid)).data.isAdmin == true;
  
  // Allow update only for super admins (payout processing)
  allow update: if request.auth != null && 
                   get(/databases/$(database)/documents/Agents/$(request.auth.uid)).data.isSuperAdmin == true;
}

// Territory Collection Rules
match /Territories/{territoryId} {
  // Allow read for all authenticated users
  allow read: if request.auth != null;
  
  // Allow write only for super admins
  allow write: if request.auth != null && 
                  get(/databases/$(database)/documents/Agents/$(request.auth.uid)).data.isSuperAdmin == true;
}

// Updated Agent Rules
match /Agents/{agentId} {
  // ... existing rules ...
  
  // Allow franchise owner to read their agents
  allow read: if request.auth != null && 
                 resource.data.franchiseIdRef == request.auth.uid;
}
```

---

## 3. API Endpoints Quick Reference

### 3.1 Franchise Management APIs

```typescript
// BASE URL: /api/franchise

// 1. Register Franchise (Admin only)
POST /api/franchise/register
Authorization: Bearer {admin_token}
Body: {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  franchiseName: string;
  territory: {
    type: string;
    state: string;
    districts: string[];
  };
  bankDetails: {...};
  documents: {...};
}
Response: {
  success: boolean;
  franchiseId: string;
  message: string;
}

// 2. Get Franchise Details
GET /api/franchise/:franchiseId
Authorization: Bearer {franchise_token | admin_token}
Response: {
  success: boolean;
  franchise: Franchise;
}

// 3. Update Franchise
PUT /api/franchise/:franchiseId
Authorization: Bearer {franchise_token | admin_token}
Body: Partial<Franchise>
Response: {
  success: boolean;
  franchise: Franchise;
}

// 4. Approve/Reject Franchise (Admin only)
POST /api/franchise/:franchiseId/approve
Authorization: Bearer {admin_token}
Body: {
  approved: boolean;
  notes?: string;
}
Response: {
  success: boolean;
  message: string;
}

// 5. Get Franchise Dashboard
GET /api/franchise/:franchiseId/dashboard
Authorization: Bearer {franchise_token}
Response: {
  success: boolean;
  data: {
    totalAgents: number;
    activeAgents: number;
    totalCustomers: number;
    totalMotors: number;
    totalRevenue: number;
    pendingCommission: number;
    currentTier: string;
    monthlyRevenueChart: {...};
    topAgents: Agent[];
  }
}

// 6. Get Franchise Agents
GET /api/franchise/:franchiseId/agents
Authorization: Bearer {franchise_token}
Query: {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'all';
  district?: string;
}
Response: {
  success: boolean;
  agents: Agent[];
  total: number;
  page: number;
}

// 7. Add Agent to Franchise
POST /api/franchise/:franchiseId/agents
Authorization: Bearer {franchise_token}
Body: AgentData & {
  district: string;
  commissionShare: number;
}
Response: {
  success: boolean;
  agentId: string;
}

// 8. Remove Agent from Franchise
DELETE /api/franchise/:franchiseId/agents/:agentId
Authorization: Bearer {franchise_token | admin_token}
Response: {
  success: boolean;
  message: string;
}

// 9. Get Franchise Statistics
GET /api/franchise/:franchiseId/statistics
Authorization: Bearer {franchise_token}
Query: {
  startDate?: string;
  endDate?: string;
}
Response: {
  success: boolean;
  statistics: FranchiseStatistics;
}

// 10. Suspend/Activate Franchise (Admin only)
POST /api/franchise/:franchiseId/status
Authorization: Bearer {admin_token}
Body: {
  isActive: boolean;
  reason?: string;
}
Response: {
  success: boolean;
  message: string;
}
```

### 3.2 Commission Management APIs

```typescript
// BASE URL: /api/commission

// 1. Get Commission History
GET /api/commission/franchise/:franchiseId
Authorization: Bearer {franchise_token}
Query: {
  startDate?: string;
  endDate?: string;
  status?: 'PENDING' | 'PAID' | 'all';
  page?: number;
  limit?: number;
}
Response: {
  success: boolean;
  commissions: CommissionTransaction[];
  total: number;
  page: number;
}

// 2. Get Pending Commission
GET /api/commission/franchise/:franchiseId/pending
Authorization: Bearer {franchise_token}
Response: {
  success: boolean;
  totalPending: number;
  transactions: CommissionTransaction[];
}

// 3. Get Commission Summary
GET /api/commission/franchise/:franchiseId/summary
Authorization: Bearer {franchise_token}
Query: {
  month?: number;
  year?: number;
}
Response: {
  success: boolean;
  summary: {
    totalEarned: number;
    totalPending: number;
    totalPaid: number;
    transactionCount: number;
    averageCommission: number;
  }
}

// 4. Process Commission Payout (Admin only)
POST /api/commission/payout/:commissionId
Authorization: Bearer {admin_token}
Body: {
  payoutMethod: 'BANK_TRANSFER' | 'UPI';
  utrNumber?: string;
  payoutDate: string;
}
Response: {
  success: boolean;
  message: string;
  payout: PayoutDetails;
}

// 5. Bulk Process Payouts (Admin only)
POST /api/commission/payout/bulk
Authorization: Bearer {admin_token}
Body: {
  franchiseId?: string;  // Optional: specific franchise
  month: number;
  year: number;
  payoutMethod: string;
}
Response: {
  success: boolean;
  processed: number;
  failed: number;
  details: PayoutResult[];
}

// 6. Get Commission Report
GET /api/commission/franchise/:franchiseId/report
Authorization: Bearer {franchise_token}
Query: {
  startDate: string;
  endDate: string;
  format?: 'json' | 'pdf' | 'excel';
}
Response: CommissionReport | File

// 7. Dispute Commission (Franchise Owner)
POST /api/commission/:commissionId/dispute
Authorization: Bearer {franchise_token}
Body: {
  reason: string;
  expectedAmount?: number;
}
Response: {
  success: boolean;
  message: string;
  disputeId: string;
}

// 8. Get Agent Commission (Agent)
GET /api/commission/agent/:agentId
Authorization: Bearer {agent_token}
Query: {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
Response: {
  success: boolean;
  commissions: CommissionTransaction[];
  totalEarned: number;
  totalPending: number;
}
```

### 3.3 Analytics & Reporting APIs

```typescript
// BASE URL: /api/analytics

// 1. Franchise Dashboard Analytics
GET /api/analytics/franchise/:franchiseId/dashboard
Authorization: Bearer {franchise_token}
Response: {
  success: boolean;
  data: {
    revenue: {
      current: number;
      previous: number;
      growth: number;
    };
    agents: {
      total: number;
      active: number;
      inactive: number;
      newThisMonth: number;
    };
    customers: {
      total: number;
      newThisMonth: number;
      growth: number;
    };
    motors: {
      total: number;
      thisMonth: number;
    };
    topAgents: AgentPerformance[];
    revenueChart: ChartData;
    motorTypeDistribution: ChartData;
  }
}

// 2. Revenue Trends
GET /api/analytics/franchise/:franchiseId/revenue/trends
Authorization: Bearer {franchise_token}
Query: {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
}
Response: {
  success: boolean;
  trends: {
    date: string;
    revenue: number;
    commission: number;
    transactions: number;
  }[]
}

// 3. Agent Performance Report
GET /api/analytics/franchise/:franchiseId/agents/performance
Authorization: Bearer {franchise_token}
Query: {
  agentId?: string;
  startDate: string;
  endDate: string;
  sortBy?: 'revenue' | 'customers' | 'motors';
}
Response: {
  success: boolean;
  performance: {
    agentId: string;
    agentName: string;
    totalRevenue: number;
    customersAdded: number;
    motorsRegistered: number;
    averageTransactionValue: number;
    rating: number;
  }[]
}

// 4. Territory Analytics
GET /api/analytics/territory/:territoryId
Authorization: Bearer {admin_token | franchise_token}
Response: {
  success: boolean;
  analytics: {
    coverage: number;  // Percentage
    activeCustomers: number;
    potentialCustomers: number;
    revenue: number;
    topPerformingAreas: {
      district: string;
      revenue: number;
    }[];
  }
}

// 5. Customer Insights
GET /api/analytics/franchise/:franchiseId/customers/insights
Authorization: Bearer {franchise_token}
Query: {
  startDate: string;
  endDate: string;
}
Response: {
  success: boolean;
  insights: {
    newCustomers: number;
    repeatCustomers: number;
    customersByArea: {...};
    motorTypePreferences: {...};
    paymentMethodDistribution: {...};
  }
}

// 6. Commission Analytics
GET /api/analytics/franchise/:franchiseId/commission/breakdown
Authorization: Bearer {franchise_token}
Query: {
  month: number;
  year: number;
}
Response: {
  success: boolean;
  breakdown: {
    totalCommission: number;
    byTransactionType: {...};
    byAgent: {...};
    tierWiseBreakdown: {...};
  }
}

// 7. Comparison Report (Multi-Franchise)
GET /api/analytics/franchises/compare
Authorization: Bearer {admin_token}
Query: {
  franchiseIds: string[];
  metric: 'revenue' | 'growth' | 'agents' | 'customers';
  startDate: string;
  endDate: string;
}
Response: {
  success: boolean;
  comparison: {
    franchiseId: string;
    franchiseName: string;
    value: number;
    rank: number;
  }[]
}
```

### 3.4 Territory Management APIs

```typescript
// BASE URL: /api/territory

// 1. Get All Territories
GET /api/territory
Authorization: Bearer {admin_token}
Query: {
  state?: string;
  assignmentType?: 'EXCLUSIVE' | 'SHARED' | 'UNASSIGNED';
}
Response: {
  success: boolean;
  territories: Territory[];
}

// 2. Get Territory Details
GET /api/territory/:territoryId
Authorization: Bearer {admin_token | franchise_token}
Response: {
  success: boolean;
  territory: Territory;
}

// 3. Create Territory (Admin only)
POST /api/territory
Authorization: Bearer {admin_token}
Body: {
  state: string;
  district: string;
  mandals?: string[];
  boundaries?: GeoJSON;
}
Response: {
  success: boolean;
  territoryId: string;
}

// 4. Assign Territory to Franchise (Admin only)
POST /api/territory/:territoryId/assign
Authorization: Bearer {admin_token}
Body: {
  franchiseId: string;
  assignmentType: 'EXCLUSIVE' | 'SHARED';
}
Response: {
  success: boolean;
  message: string;
}

// 5. Unassign Territory (Admin only)
POST /api/territory/:territoryId/unassign
Authorization: Bearer {admin_token}
Response: {
  success: boolean;
  message: string;
}

// 6. Get Franchise Territories
GET /api/territory/franchise/:franchiseId
Authorization: Bearer {franchise_token | admin_token}
Response: {
  success: boolean;
  territories: Territory[];
}

// 7. Territory Coverage Map
GET /api/territory/:territoryId/map
Authorization: Bearer {franchise_token | admin_token}
Response: {
  success: boolean;
  mapData: {
    boundaries: GeoJSON;
    agents: {id, location}[];
    customers: {id, location}[];
  }
}
```

---

## 4. UI/UX Changes Required

### 4.1 New Screens to Add

#### 4.1.1 Franchise Registration Screen

**Path**: `src/screens/Franchise/FranchiseRegistrationScreen.tsx`

**Components:**
- Multi-step form wizard
- Step 1: Owner Information
- Step 2: Business Information
- Step 3: Territory Selection
- Step 4: Bank Details
- Step 5: Document Upload
- Step 6: Review & Submit

**Key Features:**
- Form validation
- Document upload with preview
- Interactive territory map
- Progress indicator
- Save draft functionality

#### 4.1.2 Franchise Dashboard Screen

**Path**: `src/screens/Franchise/FranchiseDashboardScreen.tsx`

**Components:**
- Statistics cards (Revenue, Agents, Customers, Commission)
- Revenue chart (line/bar chart)
- Top performing agents list
- Recent transactions list
- Quick actions menu
- Notification center

**Key Features:**
- Real-time updates
- Date range filter
- Pull-to-refresh
- Export reports button

#### 4.1.3 Agent Management Screen (Franchise)

**Path**: `src/screens/Franchise/AgentManagementScreen.tsx`

**Components:**
- Agent list with search
- Filter by status/district
- Agent cards with key metrics
- Add agent button
- Bulk actions

**Key Features:**
- Real-time agent status
- Performance indicators
- Approval workflow
- Quick contact options

#### 4.1.4 Territory Map Screen

**Path**: `src/screens/Franchise/TerritoryMapScreen.tsx`

**Components:**
- Interactive map (React Native Maps)
- Territory boundaries overlay
- Agent location markers
- Customer location markers
- Territory info panel

**Key Features:**
- Zoom and pan
- Heat map option
- Filter layers (agents/customers)
- Area statistics

#### 4.1.5 Commission Report Screen

**Path**: `src/screens/Franchise/CommissionReportScreen.tsx`

**Components:**
- Commission summary cards
- Pending vs. paid breakdown
- Transaction list with filters
- Date range picker
- Export options (PDF, Excel)
- Commission tier indicator

**Key Features:**
- Monthly/yearly view toggle
- Transaction details modal
- Dispute button
- Download reports

#### 4.1.6 Franchise Analytics Screen

**Path**: `src/screens/Franchise/FranchiseAnalyticsScreen.tsx`

**Components:**
- Multiple chart types (line, bar, pie)
- KPI cards
- Performance metrics
- Comparison graphs
- Trend indicators

**Key Features:**
- Interactive charts
- Custom date ranges
- Multiple metrics selection
- Export charts

### 4.2 Updated Screens

#### 4.2.1 Login Screen (Update)

**Changes:**
- Add "Login as Franchise" option
- Update authentication flow to handle franchise role

#### 4.2.2 Agent Registration Screen (Update)

**Changes:**
- Add franchise selection dropdown (if registering under franchise)
- Add commission settings fields
- Update validation to check territory

#### 4.2.3 Customer Registration Screen (Update)

**Changes:**
- Display franchise info if agent is under franchise
- Update commission calculation

#### 4.2.4 Payment Screen (Update)

**Changes:**
- Display commission breakdown before payment
- Show tier information
- Update payment success to show commission split

#### 4.2.5 Agent Dashboard (Update)

**Changes:**
- Add franchise info card
- Display commission earnings
- Show tier progress
- Add franchise contact option

### 4.3 New Components

#### 4.3.1 Commission Calculator Component

```typescript
// src/components/Commission/CommissionCalculator.tsx

interface CommissionCalculatorProps {
  amount: number;
  franchiseTier: string;
  onCalculate: (breakdown: CommissionBreakdown) => void;
}

const CommissionCalculator: React.FC<CommissionCalculatorProps> = ({
  amount,
  franchiseTier,
  onCalculate
}) => {
  // Calculate and display commission breakdown
  // Show visual breakdown chart
  // Animate numbers
};
```

#### 4.3.2 Tier Progress Component

```typescript
// src/components/Franchise/TierProgressBar.tsx

interface TierProgressProps {
  currentRevenue: number;
  currentTier: string;
  nextTierThreshold: number;
}

const TierProgressBar: React.FC<TierProgressProps> = ({
  currentRevenue,
  currentTier,
  nextTierThreshold
}) => {
  // Display progress bar
  // Show tier badges
  // Animate progress
  // Show time to next tier
};
```

#### 4.3.3 Territory Map Component

```typescript
// src/components/Franchise/TerritoryMap.tsx

interface TerritoryMapProps {
  territory: Territory;
  agents: Agent[];
  customers: Customer[];
  onMarkerPress: (item: Agent | Customer) => void;
}

const TerritoryMap: React.FC<TerritoryMapProps> = ({
  territory,
  agents,
  customers,
  onMarkerPress
}) => {
  // Render map with boundaries
  // Show markers
  // Handle interactions
};
```

#### 4.3.4 Revenue Chart Component

```typescript
// src/components/Franchise/RevenueChart.tsx

interface RevenueChartProps {
  data: RevenueData[];
  type: 'line' | 'bar';
  period: 'daily' | 'weekly' | 'monthly';
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  type,
  period
}) => {
  // Render chart using react-native-chart-kit or Victory Native
  // Handle interactions
  // Show tooltips
};
```

### 4.4 Navigation Updates

```typescript
// src/navigation/AppNavigator.tsx

// Add Franchise Stack Navigator
const FranchiseStack = createStackNavigator();

function FranchiseNavigator() {
  return (
    <FranchiseStack.Navigator>
      <FranchiseStack.Screen 
        name="FranchiseDashboard" 
        component={FranchiseDashboardScreen} 
      />
      <FranchiseStack.Screen 
        name="AgentManagement" 
        component={AgentManagementScreen} 
      />
      <FranchiseStack.Screen 
        name="TerritoryMap" 
        component={TerritoryMapScreen} 
      />
      <FranchiseStack.Screen 
        name="CommissionReport" 
        component={CommissionReportScreen} 
      />
      <FranchiseStack.Screen 
        name="FranchiseAnalytics" 
        component={FranchiseAnalyticsScreen} 
      />
    </FranchiseStack.Navigator>
  );
}

// Update Main Navigator
<Tab.Navigator>
  {/* Existing tabs */}
  
  {/* Add Franchise tab (conditional) */}
  {user?.role === 'FRANCHISE' && (
    <Tab.Screen 
      name="FranchiseTab" 
      component={FranchiseNavigator}
      options={{
        tabBarIcon: 'briefcase-outline',
        tabBarLabel: 'Franchise'
      }}
    />
  )}
</Tab.Navigator>
```

---

## 5. Implementation Checklist

### Phase 1: Foundation (Week 1-2)

#### Database & Backend

- [ ] Create Firestore collections
  - [ ] `Franchises` collection
  - [ ] `Commissions` collection
  - [ ] `Territories` collection
- [ ] Update existing collections schema
  - [ ] `Agents` - add franchise fields
  - [ ] `Payments` - add commission fields
- [ ] Update Firebase Security Rules
- [ ] Create indexes for efficient queries
- [ ] Test database structure

#### Firebase Cloud Functions

- [ ] Create `calculateCommission` function
  - [ ] Triggered on payment success
  - [ ] Calculate commission split
  - [ ] Create commission transaction
  - [ ] Update statistics
- [ ] Create `processFranchiseApproval` function
  - [ ] Send notification to franchise owner
  - [ ] Update franchise status
- [ ] Create `monthlyCommissionPayout` function
  - [ ] Scheduled function (1st of every month)
  - [ ] Calculate pending commissions
  - [ ] Process payouts
  - [ ] Send payout notifications
- [ ] Create `updateTierStatus` function
  - [ ] Scheduled function (end of month)
  - [ ] Calculate monthly revenue
  - [ ] Update tier status
  - [ ] Send tier upgrade notifications

#### API Development

- [ ] Franchise management APIs
  - [ ] Register franchise
  - [ ] Get franchise details
  - [ ] Update franchise
  - [ ] Approve/reject franchise
  - [ ] Get franchise dashboard data
- [ ] Agent management APIs (franchise context)
  - [ ] Add agent to franchise
  - [ ] Get franchise agents
  - [ ] Update agent commission
- [ ] Commission APIs
  - [ ] Get commission history
  - [ ] Get pending commissions
  - [ ] Process payout
  - [ ] Generate reports
- [ ] Analytics APIs
  - [ ] Franchise dashboard analytics
  - [ ] Revenue trends
  - [ ] Agent performance
  - [ ] Territory analytics

### Phase 2: Frontend Development (Week 3-5)

#### Redux State Management

- [ ] Create `franchiseSlice.ts`
  - [ ] State: franchise data, loading, error
  - [ ] Actions: load, update, reset
  - [ ] Selectors
- [ ] Create `commissionSlice.ts`
  - [ ] State: commissions, pending, statistics
  - [ ] Actions: load, filter, update
- [ ] Create `territorySlice.ts`
  - [ ] State: territories, selected, map data
  - [ ] Actions: load, select, update
- [ ] Update `appSlice.ts`
  - [ ] Add franchise user role
  - [ ] Update permissions logic

#### Helper Functions

- [ ] Create `franchiseHelper.ts`
  - [ ] `registerFranchise()`
  - [ ] `getFranchiseDetails()`
  - [ ] `updateFranchise()`
  - [ ] `getFranchiseAgents()`
  - [ ] `getFranchiseStatistics()`
- [ ] Create `commissionHelper.ts`
  - [ ] `calculateCommission()`
  - [ ] `getCommissionHistory()`
  - [ ] `getPendingCommissions()`
  - [ ] `generateCommissionReport()`
- [ ] Update `razorpayPayment.ts`
  - [ ] Add commission metadata to payments
  - [ ] Update payment callbacks

#### New Screens

- [ ] `FranchiseRegistrationScreen.tsx`
- [ ] `FranchiseDashboardScreen.tsx`
- [ ] `AgentManagementScreen.tsx` (franchise)
- [ ] `TerritoryMapScreen.tsx`
- [ ] `CommissionReportScreen.tsx`
- [ ] `FranchiseAnalyticsScreen.tsx`
- [ ] `CommissionDetailsScreen.tsx`
- [ ] `TierInformationScreen.tsx`

#### Updated Screens

- [ ] `LoginScreen.tsx` - Add franchise login
- [ ] `AgentRegistrationScreen.tsx` - Add franchise context
- [ ] `AgentDashboardScreen.tsx` - Add franchise info & commission
- [ ] `PaymentScreen.tsx` - Show commission breakdown

#### New Components

- [ ] `CommissionCalculator.tsx`
- [ ] `TierProgressBar.tsx`
- [ ] `TerritoryMap.tsx`
- [ ] `RevenueChart.tsx`
- [ ] `AgentPerformanceCard.tsx`
- [ ] `CommissionSummaryCard.tsx`
- [ ] `StatisticsCard.tsx`
- [ ] `FranchiseInfoCard.tsx`

#### Navigation

- [ ] Create `FranchiseNavigator.tsx`
- [ ] Update `AppNavigator.tsx`
- [ ] Add conditional rendering based on user role
- [ ] Update deep linking configuration

### Phase 3: Integration & Testing (Week 6-7)

#### Integration

- [ ] Integrate payment flow with commission calculation
- [ ] Integrate agent registration with franchise
- [ ] Integrate customer registration with commission
- [ ] Connect real-time listeners for franchise data
- [ ] Implement notification system

#### Unit Testing

- [ ] Test commission calculation logic
- [ ] Test tier upgrade logic
- [ ] Test payment split logic
- [ ] Test API endpoints
- [ ] Test Cloud Functions

#### Integration Testing

- [ ] Test end-to-end payment flow with commission
- [ ] Test franchise registration to approval flow
- [ ] Test agent addition to franchise flow
- [ ] Test payout processing flow

#### UI/UX Testing

- [ ] Test all new screens on iOS
- [ ] Test all new screens on Android
- [ ] Test navigation flows
- [ ] Test error handling
- [ ] Test loading states

### Phase 4: Documentation & Deployment (Week 8)

#### Documentation

- [ ] API documentation
- [ ] Code documentation (JSDoc comments)
- [ ] User guides for franchise owners
- [ ] User guides for agents (updated)
- [ ] Admin guide for franchise management
- [ ] Deployment guide

#### Deployment Preparation

- [ ] Environment configuration (Dev, Staging, Production)
- [ ] Firebase project setup (Production)
- [ ] Razorpay account setup (Production keys)
- [ ] Deploy Cloud Functions
- [ ] Setup monitoring and alerts

#### Deployment

- [ ] Deploy backend (Firebase Functions)
- [ ] Deploy database updates (migration script if needed)
- [ ] Build and test iOS app
- [ ] Build and test Android app
- [ ] Submit to App Store / Play Store (if major update)
- [ ] Roll out to beta users

#### Post-Deployment

- [ ] Monitor error logs
- [ ] Monitor Cloud Functions performance
- [ ] Monitor commission calculations
- [ ] Gather user feedback
- [ ] Fix critical bugs (if any)

---

## 6. Testing Scenarios

### 6.1 Franchise Registration & Approval

#### Scenario 1: Successful Registration

**Steps:**
1. Admin logs in
2. Navigate to "Add Franchise"
3. Fill all required fields
4. Upload documents
5. Select territory
6. Submit registration

**Expected:**
- Franchise created with status `isApproved: false`
- Document URLs stored in Firebase Storage
- Notification sent to admin
- Franchise ID generated (e.g., BMFRNCH-KA-001)

#### Scenario 2: Franchise Approval

**Steps:**
1. Admin logs in
2. Navigate to "Pending Franchises"
3. Review franchise details
4. Click "Approve"

**Expected:**
- Franchise status updated to `isApproved: true`
- Notification sent to franchise owner
- Franchise can now log in

#### Scenario 3: Incomplete Registration

**Steps:**
1. Admin fills registration form
2. Skip required fields
3. Attempt to submit

**Expected:**
- Validation errors displayed
- Form not submitted
- Error messages shown for missing fields

### 6.2 Agent Addition to Franchise

#### Scenario 1: Franchise Adds Agent

**Steps:**
1. Franchise owner logs in
2. Navigate to "Add Agent"
3. Fill agent details
4. Select district within franchise territory
5. Set commission share
6. Submit

**Expected:**
- Agent created with `franchiseId` reference
- Agent status: `isApproved: false` (pending franchise approval)
- Franchise statistics updated (`activeAgentsCount`)
- Notification sent to agent

#### Scenario 2: Agent Outside Territory

**Steps:**
1. Franchise owner tries to add agent
2. Select district outside franchise territory
3. Submit

**Expected:**
- Validation error: "District not in your franchise territory"
- Form not submitted

### 6.3 Commission Calculation & Split

#### Scenario 1: Motor Registration Payment (Bronze Tier)

**Given:**
- Franchise tier: Bronze (15% commission)
- Motor registration price: ₹1000
- Platform fee: 10%

**Steps:**
1. Customer makes payment of ₹1000
2. Payment successful via Razorpay

**Expected Commission Split:**
- Total: ₹1000
- Platform fee (10%): ₹100
- Remaining: ₹900
- Franchise commission (15% of ₹900): ₹135
- Agent commission (85% of ₹900): ₹765

**Database Updates:**
1. Payment record created in `Payments` collection
2. Commission transaction created in `Commissions` collection
   - Franchise commission: ₹135 (status: PENDING)
   - Agent commission: ₹765 (status: PENDING)
3. Franchise statistics updated:
   - `totalRevenue` += ₹1000
   - `pendingCommission` += ₹135
4. Agent performance metrics updated:
   - `currentMonthRevenue` += ₹1000
   - `totalCommission` += ₹765

#### Scenario 2: Multiple Payments - Tier Upgrade

**Given:**
- Current tier: Bronze
- Current month revenue: ₹49,000
- Next payment: ₹2,000

**Steps:**
1. New payment of ₹2,000 processed
2. Total monthly revenue: ₹51,000

**Expected:**
- Payment processed with Bronze tier rates initially
- Tier upgrade triggered (₹51,000 > ₹50,000)
- Next payment will use Silver tier rates
- Notification sent to franchise owner about tier upgrade

### 6.4 Commission Payout

#### Scenario 1: Monthly Payout (Above Threshold)

**Given:**
- Franchise pending commission: ₹5,000
- Minimum payout threshold: ₹1,000
- Date: 1st of the month

**Steps:**
1. Scheduled Cloud Function runs
2. Calculate total pending commission
3. Commission > threshold
4. Process bank transfer

**Expected:**
- Payout initiated
- Commission status updated: PENDING → PAID
- `payoutDetails` added with UTR number
- Notification sent to franchise owner
- `pendingCommission` reset to 0
- `totalCommission` updated

#### Scenario 2: Below Threshold

**Given:**
- Franchise pending commission: ₹500
- Minimum payout threshold: ₹1,000

**Steps:**
1. Scheduled function runs
2. Check commission amount
3. Amount < threshold

**Expected:**
- Payout skipped
- Commission remains PENDING
- Notification sent: "Commission below minimum threshold"
- Commission carries over to next month

### 6.5 Franchise Dashboard

#### Scenario 1: Load Dashboard Data

**Steps:**
1. Franchise owner logs in
2. Navigate to Dashboard

**Expected:**
- Statistics cards loaded:
  - Total Agents: [count]
  - Active Customers: [count]
  - Total Motors: [count]
  - Pending Commission: ₹[amount]
- Revenue chart displayed (last 6 months)
- Top 5 performing agents list
- Recent transactions (last 10)
- Real-time updates via Firebase listeners

#### Scenario 2: Filter by Date Range

**Steps:**
1. On dashboard
2. Select date range (e.g., Last 30 days)
3. Apply filter

**Expected:**
- Statistics recalculated for selected range
- Chart updates with filtered data
- Transaction list updates

### 6.6 Territory Management

#### Scenario 1: Assign Territory to Franchise

**Steps:**
1. Super admin logs in
2. Navigate to "Territory Management"
3. Select unassigned territory
4. Click "Assign to Franchise"
5. Select franchise
6. Choose assignment type (Exclusive)
7. Submit

**Expected:**
- Territory `franchiseId` updated
- Territory `assignmentType` set to EXCLUSIVE
- Franchise `territory` updated
- Notification sent to franchise owner
- Map boundaries displayed in franchise dashboard

### 6.7 Error Handling

#### Scenario 1: Payment Failure

**Steps:**
1. Customer initiates payment
2. Payment fails at Razorpay

**Expected:**
- Payment status: FAILED
- No commission created
- Error message displayed to user
- Retry option available

#### Scenario 2: Firebase Connection Lost

**Steps:**
1. User on franchise dashboard
2. Internet connection lost
3. Attempt to load data

**Expected:**
- Cached data displayed (if available)
- Error message: "Connection lost. Retrying..."
- Auto-retry when connection restored

#### Scenario 3: Commission Calculation Error

**Steps:**
1. Payment successful
2. Commission calculation fails (Cloud Function error)

**Expected:**
- Error logged to Firebase Crashlytics
- Payment marked as `commissionCalculated: false`
- Admin notification sent
- Retry mechanism triggered

### 6.8 Security Testing

#### Scenario 1: Unauthorized Access

**Steps:**
1. Agent user logs in
2. Attempts to access franchise dashboard URL

**Expected:**
- Access denied
- Error: "You don't have permission to access this resource"
- Redirected to agent dashboard

#### Scenario 2: Cross-Franchise Data Access

**Steps:**
1. Franchise A owner logs in
2. Attempts to view Franchise B's commission data via API

**Expected:**
- Request blocked by Firebase Security Rules
- Error: "Permission denied"
- No data returned

#### Scenario 3: Agent Trying to Modify Commission

**Steps:**
1. Agent logs in
2. Attempts to update their commission percentage via API

**Expected:**
- Request rejected
- Error: "Unauthorized operation"
- Commission percentage unchanged

---

## 7. Next Steps

### 7.1 Immediate Actions

1. **Review Documentation Plan**: 
   - Review with stakeholders
   - Get approval on franchise model structure
   - Finalize commission tiers and percentages

2. **Setup Development Environment**:
   - Create Firebase project (Dev/Staging)
   - Setup Git branch for franchise feature
   - Configure development tools

3. **Design Review**:
   - Create UI mockups for all new screens
   - Review with design team
   - Get user feedback on dashboard layout

4. **Technical Architecture Review**:
   - Review database schema with tech team
   - Discuss scaling considerations
   - Plan for data migration (if updating existing app)

### 7.2 Questions to Address

1. **Business Model**:
   - Finalize commission percentages for each tier
   - Decide on minimum payout threshold
   - Determine territory assignment criteria

2. **Legal & Compliance**:
   - Franchise agreement template
   - Tax handling (TDS deduction?)
   - Data privacy compliance

3. **Technical**:
   - What if payment succeeds but commission calculation fails?
   - How to handle commission disputes?
   - Backup and recovery strategy

4. **User Experience**:
   - Onboarding process for franchise owners
   - Training materials needed
   - Support system for franchise queries

---

## 8. Support & Resources

### 8.1 Documentation Links

- [Main Documentation Plan](./DOCUMENTATION_PLAN.md)
- Firebase Console: [Your Firebase Project URL]
- Razorpay Dashboard: [Your Razorpay Dashboard URL]
- Design Files: [Figma/Design Tool URL]

### 8.2 Contact

For questions or clarifications on this implementation guide:

- **Project Lead**: [Name/Email]
- **Technical Lead**: [Name/Email]
- **Business Lead**: [Name/Email]

---

**Last Updated**: January 3, 2025

**Status**: Draft - Pending Review
