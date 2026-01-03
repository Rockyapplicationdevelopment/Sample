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
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@redux/hooks';
import firestore from '@react-native-firebase/firestore';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, userType } = useAppSelector((state) => state.app);

  const [stats, setStats] = useState({
    customers: 0,
    agents: 0,
    technicians: 0,
    motors: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      if (userType === 'AGENT') {
        if (user?.isSuperAdmin || user?.isAdmin) {
          // Admin sees all stats
          const [customersSnap, agentsSnap, techniciansSnap] = await Promise.all([
            firestore().collection('Customers').get(),
            firestore().collection('Agents').get(),
            firestore().collection('Technicians').get(),
          ]);

          let totalMotors = 0;
          customersSnap.docs.forEach((doc) => {
            const customer = doc.data();
            totalMotors += customer.motorInfo?.length || 0;
          });

          setStats({
            customers: customersSnap.size,
            agents: agentsSnap.size,
            technicians: techniciansSnap.size,
            motors: totalMotors,
            pendingApprovals: 0,
          });
        } else {
          // Regular agent sees their stats
          const [customersSnap, techniciansSnap] = await Promise.all([
            firestore().collection('Customers').where('agentIdRef', '==', user?.id).get(),
            firestore().collection('Technicians').where('agentIdRef', '==', user?.id).get(),
          ]);

          let totalMotors = 0;
          customersSnap.docs.forEach((doc) => {
            const customer = doc.data();
            totalMotors += customer.motorInfo?.length || 0;
          });

          setStats({
            customers: customersSnap.size,
            agents: 0,
            technicians: techniciansSnap.size,
            motors: totalMotors,
            pendingApprovals: 0,
          });
        }
      } else if (userType === 'FRANCHISE' && user?.id) {
        // Franchise sees their franchise stats
        const agentsSnap = await firestore()
          .collection('Agents')
          .where('franchiseIdRef', '==', user.id)
          .get();

        const agentIds = agentsSnap.docs.map((doc) => doc.id);

        if (agentIds.length > 0) {
          const customersSnap = await firestore()
            .collection('Customers')
            .where('agentIdRef', 'in', agentIds.slice(0, 10))
            .get();

          let totalMotors = 0;
          customersSnap.docs.forEach((doc) => {
            const customer = doc.data();
            totalMotors += customer.motorInfo?.length || 0;
          });

          setStats({
            customers: customersSnap.size,
            agents: agentsSnap.size,
            technicians: 0,
            motors: totalMotors,
            pendingApprovals: 0,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user, userType]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const quickActions = [
    {
      title: 'Add Customer',
      icon: '👥',
      color: '#34C759',
      onPress: () => navigation.navigate('AddCustomer' as never),
      visible: userType === 'AGENT',
    },
    {
      title: 'Add Agent',
      icon: '🤝',
      color: '#007AFF',
      onPress: () => navigation.navigate('AddAgent' as never),
      visible: userType === 'AGENT' && (user?.isAdmin || userType === 'FRANCHISE'),
    },
    {
      title: 'Customers',
      icon: '📋',
      color: '#FF9500',
      onPress: () => navigation.navigate('CustomerList' as never),
      visible: true,
    },
    {
      title: 'Agents',
      icon: '👔',
      color: '#5856D6',
      onPress: () => navigation.navigate('AgentList' as never),
      visible: (userType === 'AGENT' && user?.isAdmin) || userType === 'FRANCHISE',
    },
  ];

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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        {userType === 'AGENT' && user?.agentId && (
          <Text style={styles.userId}>ID: {user.agentId}</Text>
        )}
        {userType === 'FRANCHISE' && (user as any)?.franchiseId && (
          <Text style={styles.userId}>ID: {(user as any).franchiseId}</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: '#34C759' }]}
            onPress={() => navigation.navigate('CustomerList' as never)}
          >
            <Text style={styles.statValue}>{stats.customers}</Text>
            <Text style={styles.statLabel}>Customers</Text>
          </TouchableOpacity>

          {(userType === 'AGENT' && user?.isAdmin) || userType === 'FRANCHISE' ? (
            <TouchableOpacity
              style={[styles.statCard, { backgroundColor: '#007AFF' }]}
              onPress={() => navigation.navigate('AgentList' as never)}
            >
              <Text style={styles.statValue}>{stats.agents}</Text>
              <Text style={styles.statLabel}>Agents</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#FF9500' }]}>
            <Text style={styles.statValue}>{stats.motors}</Text>
            <Text style={styles.statLabel}>Total Motors</Text>
          </View>

          {userType === 'AGENT' && (
            <View style={[styles.statCard, { backgroundColor: '#5856D6' }]}>
              <Text style={styles.statValue}>{stats.technicians}</Text>
              <Text style={styles.statLabel}>Technicians</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          {quickActions
            .filter((action) => action.visible)
            .map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { borderLeftColor: action.color }]}
                onPress={action.onPress}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>
              {userType === 'AGENT'
                ? user?.isSuperAdmin
                  ? 'Super Admin'
                  : user?.isAdmin
                  ? 'Admin'
                  : 'Agent'
                : 'Franchise Owner'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{user?.phone || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
          </View>

          {userType === 'AGENT' && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>District:</Text>
              <Text style={styles.infoValue}>{user?.district || 'N/A'}</Text>
            </View>
          )}

          {userType === 'FRANCHISE' && (user as any)?.territory && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Territory:</Text>
              <Text style={styles.infoValue}>
                {(user as any).territory.state} - {(user as any).territory.districts.join(', ')}
              </Text>
            </View>
          )}
        </View>
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
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  userId: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 5,
  },
  statsContainer: {
    padding: 15,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 15,
  },
  statCard: {
    flex: 1,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 5,
    opacity: 0.9,
  },
  quickActionsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionsGrid: {
    gap: 15,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoSection: {
    padding: 15,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
});

export default DashboardScreen;
