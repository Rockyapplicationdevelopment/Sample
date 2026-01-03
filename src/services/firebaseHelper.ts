import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { 
  Franchise, 
  FranchiseRegistrationData, 
  FranchiseTier 
} from '@models/Franchise';
import { Commission, CommissionStatus } from '@models/Commission';
import { Territory } from '@models/Territory';
import { Agent } from '@models/Agent';

const COLLECTIONS = {
  FRANCHISES: 'Franchises',
  AGENTS: 'Agents',
  CUSTOMERS: 'Customers',
  TECHNICIANS: 'Technicians',
  COMMISSIONS: 'Commissions',
  TERRITORIES: 'Territories',
  PAYMENTS: 'Payments',
};

export const generateFranchiseId = async (state: string): Promise<string> => {
  const stateCode = state.substring(0, 2).toUpperCase();
  const snapshot = await firestore()
    .collection(COLLECTIONS.FRANCHISES)
    .where('territory.state', '==', state)
    .get();
  
  const count = snapshot.size + 1;
  return `BMFRNCH-${stateCode}-${String(count).padStart(3, '0')}`;
};

export const registerFranchise = async (
  data: FranchiseRegistrationData
): Promise<Franchise> => {
  try {
    const franchiseId = await generateFranchiseId(data.territory.state);
    const timestamp = new Date().toISOString();

    const franchiseData: Franchise = {
      id: '',
      franchiseId,
      role: 'FRANCHISE',
      ownerName: data.ownerName,
      ownerEmail: data.ownerEmail,
      ownerPhone: data.ownerPhone,
      ownerAadharNumber: data.ownerAadharNumber,
      franchiseName: data.franchiseName,
      businessType: data.businessType,
      territory: data.territory,
      commissionStructure: {
        motorRegistrationCommission: 15,
        certificateRenewalCommission: 15,
        currentTier: 'BRONZE',
        platformFee: 10,
      },
      agents: [],
      statistics: {
        totalRevenue: 0,
        totalCommission: 0,
        pendingCommission: 0,
        paidCommission: 0,
        monthlyRevenue: [],
        totalAgents: 0,
        activeAgents: 0,
        totalCustomers: 0,
        totalMotors: 0,
        totalTechnicians: 0,
      },
      bankDetails: data.bankDetails,
      documents: {
        panCard: '',
        ownerIdProof: '',
      },
      location: data.location,
      address: data.address,
      isActive: true,
      isApproved: false,
      password: data.password,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await firestore()
      .collection(COLLECTIONS.FRANCHISES)
      .add(franchiseData);

    franchiseData.id = docRef.id;

    await docRef.update({ id: docRef.id });

    return franchiseData;
  } catch (error) {
    console.error('Error registering franchise:', error);
    throw error;
  }
};

export const getFranchise = async (franchiseId: string): Promise<Franchise | null> => {
  try {
    const doc = await firestore()
      .collection(COLLECTIONS.FRANCHISES)
      .doc(franchiseId)
      .get();

    if (doc.exists) {
      return doc.data() as Franchise;
    }
    return null;
  } catch (error) {
    console.error('Error fetching franchise:', error);
    throw error;
  }
};

export const getFranchises = (
  onUpdate: (franchises: Franchise[]) => void,
  onError: (error: Error) => void
) => {
  return firestore()
    .collection(COLLECTIONS.FRANCHISES)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (snapshot) => {
        const franchises: Franchise[] = [];
        snapshot.forEach((doc) => {
          franchises.push(doc.data() as Franchise);
        });
        onUpdate(franchises);
      },
      (error) => {
        onError(error);
      }
    );
};

export const updateFranchise = async (
  franchiseId: string,
  data: Partial<Franchise>
): Promise<void> => {
  try {
    await firestore()
      .collection(COLLECTIONS.FRANCHISES)
      .doc(franchiseId)
      .update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Error updating franchise:', error);
    throw error;
  }
};

export const approveFranchise = async (
  franchiseId: string,
  approvedBy: string,
  approved: boolean,
  notes?: string
): Promise<void> => {
  try {
    const updateData: any = {
      isApproved: approved,
      approvedBy,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!approved && notes) {
      updateData.rejectionReason = notes;
    }

    await firestore()
      .collection(COLLECTIONS.FRANCHISES)
      .doc(franchiseId)
      .update(updateData);
  } catch (error) {
    console.error('Error approving franchise:', error);
    throw error;
  }
};

export const assignAgentToFranchise = async (
  agentId: string,
  franchiseId: string,
  franchiseIdRef: string
): Promise<void> => {
  try {
    await firestore().runTransaction(async (transaction) => {
      const agentRef = firestore().collection(COLLECTIONS.AGENTS).doc(agentId);
      const franchiseRef = firestore().collection(COLLECTIONS.FRANCHISES).doc(franchiseIdRef);

      const franchiseDoc = await transaction.get(franchiseRef);
      const franchise = franchiseDoc.data() as Franchise;

      transaction.update(agentRef, {
        franchiseId,
        franchiseIdRef,
        isFranchiseAgent: true,
        updatedAt: new Date().toISOString(),
      });

      const updatedAgents = [...franchise.agents, agentId];
      transaction.update(franchiseRef, {
        agents: updatedAgents,
        'statistics.totalAgents': updatedAgents.length,
        updatedAt: new Date().toISOString(),
      });
    });
  } catch (error) {
    console.error('Error assigning agent to franchise:', error);
    throw error;
  }
};

export const removeAgentFromFranchise = async (
  agentId: string,
  franchiseIdRef: string
): Promise<void> => {
  try {
    await firestore().runTransaction(async (transaction) => {
      const agentRef = firestore().collection(COLLECTIONS.AGENTS).doc(agentId);
      const franchiseRef = firestore().collection(COLLECTIONS.FRANCHISES).doc(franchiseIdRef);

      const franchiseDoc = await transaction.get(franchiseRef);
      const franchise = franchiseDoc.data() as Franchise;

      transaction.update(agentRef, {
        franchiseId: null,
        franchiseIdRef: null,
        isFranchiseAgent: false,
        updatedAt: new Date().toISOString(),
      });

      const updatedAgents = franchise.agents.filter(id => id !== agentId);
      transaction.update(franchiseRef, {
        agents: updatedAgents,
        'statistics.totalAgents': updatedAgents.length,
        updatedAt: new Date().toISOString(),
      });
    });
  } catch (error) {
    console.error('Error removing agent from franchise:', error);
    throw error;
  }
};

export const getFranchiseAgents = (
  franchiseId: string,
  onUpdate: (agents: Agent[]) => void,
  onError: (error: Error) => void
) => {
  return firestore()
    .collection(COLLECTIONS.AGENTS)
    .where('franchiseId', '==', franchiseId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (snapshot) => {
        const agents: Agent[] = [];
        snapshot.forEach((doc) => {
          agents.push(doc.data() as Agent);
        });
        onUpdate(agents);
      },
      (error) => {
        onError(error);
      }
    );
};

export const calculateCommission = (
  totalAmount: number,
  tier: FranchiseTier,
  platformFee: number = 10
) => {
  const platformAmount = (totalAmount * platformFee) / 100;
  const remainingAmount = totalAmount - platformAmount;

  let franchisePercentage = 15;
  let agentPercentage = 75;

  switch (tier) {
    case 'BRONZE':
      franchisePercentage = 15;
      agentPercentage = 75;
      break;
    case 'SILVER':
      franchisePercentage = 20;
      agentPercentage = 70;
      break;
    case 'GOLD':
      franchisePercentage = 25;
      agentPercentage = 65;
      break;
    case 'PLATINUM':
      franchisePercentage = 30;
      agentPercentage = 60;
      break;
  }

  const franchiseCommission = (remainingAmount * franchisePercentage) / 100;
  const agentCommission = (remainingAmount * agentPercentage) / 100;

  return {
    platformAmount,
    franchiseCommission,
    agentCommission,
    franchisePercentage,
    agentPercentage,
  };
};

export const createCommissionTransaction = async (
  paymentId: string,
  totalAmount: number,
  agentId: string,
  agentIdRef: string,
  franchiseId?: string,
  franchiseIdRef?: string,
  customerId?: string,
  motorId?: string
): Promise<string> => {
  try {
    let tier: FranchiseTier = 'BRONZE';

    if (franchiseIdRef) {
      const franchiseDoc = await firestore()
        .collection(COLLECTIONS.FRANCHISES)
        .doc(franchiseIdRef)
        .get();
      
      if (franchiseDoc.exists) {
        const franchise = franchiseDoc.data() as Franchise;
        tier = franchise.commissionStructure.currentTier;
      }
    }

    const commissionCalc = calculateCommission(totalAmount, tier);
    const timestamp = new Date().toISOString();
    const now = new Date();

    const commissionData: Omit<Commission, 'id'> = {
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      franchiseId,
      franchiseIdRef,
      agentId,
      agentIdRef,
      customerId,
      motorId,
      paymentId,
      transactionType: 'MOTOR_REGISTRATION',
      totalAmount,
      commissionPercentage: franchiseId ? commissionCalc.franchisePercentage : commissionCalc.agentPercentage,
      commissionAmount: franchiseId ? commissionCalc.franchiseCommission : commissionCalc.agentCommission,
      splits: {
        franchiseCommission: commissionCalc.franchiseCommission,
        agentCommission: commissionCalc.agentCommission,
        adminShare: commissionCalc.platformAmount,
        platformFee: commissionCalc.platformAmount,
        taxDeducted: 0,
      },
      tierApplied: tier,
      status: 'PENDING',
      createdAt: timestamp,
      month: now.toLocaleString('default', { month: 'long' }),
      year: now.getFullYear(),
    };

    const docRef = await firestore()
      .collection(COLLECTIONS.COMMISSIONS)
      .add(commissionData);

    await docRef.update({ id: docRef.id });

    if (franchiseIdRef) {
      await updateFranchiseStatistics(franchiseIdRef, totalAmount, commissionCalc.franchiseCommission);
    }

    return docRef.id;
  } catch (error) {
    console.error('Error creating commission transaction:', error);
    throw error;
  }
};

const updateFranchiseStatistics = async (
  franchiseIdRef: string,
  revenue: number,
  commission: number
): Promise<void> => {
  try {
    const franchiseRef = firestore().collection(COLLECTIONS.FRANCHISES).doc(franchiseIdRef);
    const doc = await franchiseRef.get();
    
    if (!doc.exists) return;

    const franchise = doc.data() as Franchise;
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();

    const monthlyRevenue = franchise.statistics.monthlyRevenue || [];
    const existingMonthIndex = monthlyRevenue.findIndex(
      m => m.month === currentMonth && m.year === currentYear
    );

    if (existingMonthIndex >= 0) {
      monthlyRevenue[existingMonthIndex].revenue += revenue;
      monthlyRevenue[existingMonthIndex].commissionEarned += commission;
      monthlyRevenue[existingMonthIndex].transactionCount += 1;
    } else {
      monthlyRevenue.push({
        month: currentMonth,
        year: currentYear,
        revenue,
        commissionEarned: commission,
        transactionCount: 1,
      });
    }

    await franchiseRef.update({
      'statistics.totalRevenue': firestore.FieldValue.increment(revenue),
      'statistics.totalCommission': firestore.FieldValue.increment(commission),
      'statistics.pendingCommission': firestore.FieldValue.increment(commission),
      'statistics.monthlyRevenue': monthlyRevenue,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating franchise statistics:', error);
    throw error;
  }
};

export const getFranchiseCommissions = (
  franchiseIdRef: string,
  onUpdate: (commissions: Commission[]) => void,
  onError: (error: Error) => void
) => {
  return firestore()
    .collection(COLLECTIONS.COMMISSIONS)
    .where('franchiseIdRef', '==', franchiseIdRef)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (snapshot) => {
        const commissions: Commission[] = [];
        snapshot.forEach((doc) => {
          commissions.push({ ...doc.data(), id: doc.id } as Commission);
        });
        onUpdate(commissions);
      },
      (error) => {
        onError(error);
      }
    );
};

export const updateCommissionStatus = async (
  commissionId: string,
  status: CommissionStatus,
  payoutDetails?: any
): Promise<void> => {
  try {
    const updateData: any = {
      status,
      processedAt: new Date().toISOString(),
    };

    if (payoutDetails) {
      updateData.payoutDetails = payoutDetails;
    }

    await firestore()
      .collection(COLLECTIONS.COMMISSIONS)
      .doc(commissionId)
      .update(updateData);
  } catch (error) {
    console.error('Error updating commission status:', error);
    throw error;
  }
};

export const uploadFile = async (
  filePath: string,
  destination: string
): Promise<string> => {
  try {
    const reference = storage().ref(destination);
    await reference.putFile(filePath);
    const url = await reference.getDownloadURL();
    return url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const authenticateFranchise = async (
  email: string,
  password: string
): Promise<Franchise | null> => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    const snapshot = await firestore()
      .collection(COLLECTIONS.FRANCHISES)
      .where('ownerEmail', '==', normalizedEmail)
      .where('password', '==', password)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const franchise = snapshot.docs[0].data() as Franchise;
    
    if (!franchise.isActive || !franchise.isApproved) {
      throw new Error('Franchise account is not active or approved');
    }

    return franchise;
  } catch (error) {
    console.error('Error authenticating franchise:', error);
    throw error;
  }
};

export const getTerritories = (
  onUpdate: (territories: Territory[]) => void,
  onError: (error: Error) => void
) => {
  return firestore()
    .collection(COLLECTIONS.TERRITORIES)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (snapshot) => {
        const territories: Territory[] = [];
        snapshot.forEach((doc) => {
          territories.push(doc.data() as Territory);
        });
        onUpdate(territories);
      },
      (error) => {
        onError(error);
      }
    );
};

export const assignTerritory = async (
  territoryId: string,
  franchiseId: string,
  franchiseIdRef: string,
  assignedBy: string
): Promise<void> => {
  try {
    await firestore()
      .collection(COLLECTIONS.TERRITORIES)
      .doc(territoryId)
      .update({
        franchiseId,
        franchiseIdRef,
        assignmentType: 'EXCLUSIVE',
        assignedAt: new Date().toISOString(),
        assignedBy,
        updatedAt: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Error assigning territory:', error);
    throw error;
  }
};
