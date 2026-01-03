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
import { Franchise } from '@models/Franchise';
import { getFranchises } from '@services/firebaseHelper';

const FranchiseListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [filteredFranchises, setFilteredFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = getFranchises(
      (data) => {
        setFranchises(data);
        setFilteredFranchises(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching franchises:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFranchises(franchises);
    } else {
      const filtered = franchises.filter(
        (franchise) =>
          franchise.franchiseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          franchise.franchiseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          franchise.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFranchises(filtered);
    }
  }, [searchQuery, franchises]);

  const renderFranchiseCard = ({ item }: { item: Franchise }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('FranchiseDetail' as never, { franchise: item } as never)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.franchiseName}>{item.franchiseName}</Text>
        <View
          style={[
            styles.statusBadge,
            item.isApproved && item.isActive
              ? styles.statusActive
              : item.isApproved
              ? styles.statusInactive
              : styles.statusPending,
          ]}
        >
          <Text style={styles.statusText}>
            {item.isApproved && item.isActive
              ? 'Active'
              : item.isApproved
              ? 'Inactive'
              : 'Pending'}
          </Text>
        </View>
      </View>

      <Text style={styles.franchiseId}>{item.franchiseId}</Text>
      <Text style={styles.ownerName}>Owner: {item.ownerName}</Text>

      <View style={styles.territoryInfo}>
        <Text style={styles.territoryText}>
          {item.territory.state} • {item.territory.districts.join(', ')}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.agents.length}</Text>
          <Text style={styles.statLabel}>Agents</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            ₹{(item.statistics.totalRevenue || 0).toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.commissionStructure.currentTier}</Text>
          <Text style={styles.statLabel}>Tier</Text>
        </View>
      </View>
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
          placeholder="Search franchises..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredFranchises}
        renderItem={renderFranchiseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No franchises found</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddFranchise' as never)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  franchiseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  franchiseId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  ownerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  territoryInfo: {
    marginBottom: 15,
  },
  territoryText: {
    fontSize: 14,
    color: '#007AFF',
  },
  statsRow: {
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

export default FranchiseListScreen;
