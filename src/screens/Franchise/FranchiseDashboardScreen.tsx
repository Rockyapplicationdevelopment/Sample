import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAppSelector } from '@redux/hooks';
import { Franchise } from '@models/Franchise';
import { getFranchiseAgents, getFranchiseCommissions } from '@services/firebaseHelper';
import { Agent } from '@models/Agent';
import { Commission } from '@models/Commission';

const FranchiseDashboardScreen: React.FC = () => {
  const { user } = useAppSelector((state) => state.app);
  const franchise = user as Franchise;

  const [agents, setAgents] = useState<Agent[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!franchise?.id) return;

    const unsubscribeAgents = getFranchiseAgents(
      franchise.franchiseId,
      (data) => {
        setAgents(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching agents:', error);
        setLoading(false);
      }
    );

    const unsubscribeCommissions = getFranchiseCommissions(
      franchise.id,
      (data) => {
        setCommissions(data);
      },
      (error) => {
        console.error('Error fetching commissions:', error);
      }
    );

    return () => {
      unsubscribeAgents();
      unsubscribeCommissions();
    };
  }, [franchise?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const calculateTotalRevenue = () => {
    return franchise?.statistics.totalRevenue || 0;
  };

  const calculatePendingCommission = () => {
    return commissions
      .filter((c) => c.status === 'PENDING')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
  };

  const calculatePaidCommission = () => {
    return commissions
      .filter((c) => c.status === 'PAID')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.franchiseName}>{franchise?.franchiseName}</Text>
        <Text style={styles.franchiseId}>{franchise?.franchiseId}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{agents.length}</Text>
          <Text style={styles.statLabel}>Total Agents</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {agents.filter((a) => a.isActive).length}
          </Text>
          <Text style={styles.statLabel}>Active Agents</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            ₹{calculateTotalRevenue().toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {franchise?.statistics.totalCustomers || 0}
          </Text>
          <Text style={styles.statLabel}>Total Customers</Text>
        </View>
      </View>

      <View style={styles.commissionSection}>
        <Text style={styles.sectionTitle}>Commission Overview</Text>
        
        <View style={styles.commissionCard}>
          <View style={styles.commissionRow}>
            <Text style={styles.commissionLabel}>Pending Commission</Text>
            <Text style={styles.commissionValuePending}>
              ₹{calculatePendingCommission().toLocaleString()}
            </Text>
          </View>

          <View style={styles.commissionRow}>
            <Text style={styles.commissionLabel}>Paid Commission</Text>
            <Text style={styles.commissionValuePaid}>
              ₹{calculatePaidCommission().toLocaleString()}
            </Text>
          </View>

          <View style={styles.commissionRow}>
            <Text style={styles.commissionLabel}>Current Tier</Text>
            <Text style={styles.commissionTier}>
              {franchise?.commissionStructure.currentTier}
            </Text>
          </View>

          <View style={styles.commissionRow}>
            <Text style={styles.commissionLabel}>Commission Rate</Text>
            <Text style={styles.commissionRate}>
              {franchise?.commissionStructure.motorRegistrationCommission}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.territorySection}>
        <Text style={styles.sectionTitle}>Territory</Text>
        <View style={styles.territoryCard}>
          <Text style={styles.territoryLabel}>State: {franchise?.territory.state}</Text>
          <Text style={styles.territoryLabel}>
            Districts: {franchise?.territory.districts.join(', ')}
          </Text>
          <Text style={styles.territoryLabel}>
            Type: {franchise?.territory.type}
          </Text>
        </View>
      </View>

      <View style={styles.recentAgentsSection}>
        <Text style={styles.sectionTitle}>Recent Agents</Text>
        {agents.slice(0, 5).map((agent) => (
          <View key={agent.id} style={styles.agentCard}>
            <View style={styles.agentInfo}>
              <Text style={styles.agentName}>{agent.name}</Text>
              <Text style={styles.agentId}>{agent.agentId}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                agent.isActive ? styles.statusActive : styles.statusInactive,
              ]}
            >
              <Text style={styles.statusText}>
                {agent.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  franchiseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  franchiseId: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  commissionSection: {
    padding: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  commissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  commissionLabel: {
    fontSize: 16,
    color: '#666',
  },
  commissionValuePending: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  commissionValuePaid: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
  },
  commissionTier: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  commissionRate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  territorySection: {
    padding: 15,
  },
  territoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  territoryLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  recentAgentsSection: {
    padding: 15,
  },
  agentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  agentId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusInactive: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default FranchiseDashboardScreen;
