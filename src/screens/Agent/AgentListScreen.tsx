import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@redux/hooks';
import { Agent } from '@models/Agent';
import firestore from '@react-native-firebase/firestore';

const AgentListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, userType } = useAppSelector((state) => state.app);

  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let unsubscribe: () => void;

    if (userType === 'AGENT' && user?.isSuperAdmin) {
      // Super admin can see all agents
      unsubscribe = firestore()
        .collection('Agents')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          (snapshot) => {
            const agentData: Agent[] = [];
            snapshot.forEach((doc) => {
              agentData.push(doc.data() as Agent);
            });
            setAgents(agentData);
            setFilteredAgents(agentData);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching agents:', error);
            setLoading(false);
          }
        );
    } else if (userType === 'FRANCHISE' && user?.id) {
      // Franchise can see their agents
      unsubscribe = firestore()
        .collection('Agents')
        .where('franchiseIdRef', '==', user.id)
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          (snapshot) => {
            const agentData: Agent[] = [];
            snapshot.forEach((doc) => {
              agentData.push(doc.data() as Agent);
            });
            setAgents(agentData);
            setFilteredAgents(agentData);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching agents:', error);
            setLoading(false);
          }
        );
    } else {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, userType]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter(
        (agent) =>
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.agentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.phone.includes(searchQuery)
      );
      setFilteredAgents(filtered);
    }
  }, [searchQuery, agents]);

  const renderAgentCard = ({ item }: { item: Agent }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AgentDetail' as never, { agent: item } as never)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2)}
          </Text>
        </View>

        <View style={styles.agentInfo}>
          <Text style={styles.agentName}>{item.name}</Text>
          <Text style={styles.agentId}>{item.agentId}</Text>
          <Text style={styles.agentPhone}>{item.phone}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            item.isActive ? styles.statusActive : styles.statusInactive,
          ]}
        >
          <Text style={styles.statusText}>{item.isActive ? 'Active' : 'Inactive'}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.customerCount || 0}</Text>
          <Text style={styles.statLabel}>Customers</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.technicianCount || 0}</Text>
          <Text style={styles.statLabel}>Technicians</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {item.district || 'N/A'}
          </Text>
          <Text style={styles.statLabel}>District</Text>
        </View>
      </View>

      {item.isFranchiseAgent && (
        <View style={styles.franchiseBadge}>
          <Text style={styles.franchiseBadgeText}>Franchise Agent</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search agents..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredAgents}
        renderItem={renderAgentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No agents found</Text>
          </View>
        }
      />

      {(userType === 'AGENT' && user?.isAdmin) || userType === 'FRANCHISE' ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddAgent' as never)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      ) : null}
    </View>
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
  searchContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    height: 45,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  agentId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  agentPhone: {
    fontSize: 14,
    color: '#666',
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
    color: '#333',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  franchiseBadge: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  franchiseBadgeText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fabText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AgentListScreen;
