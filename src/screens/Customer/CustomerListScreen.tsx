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
import { Customer } from '@models/Customer';
import firestore from '@react-native-firebase/firestore';

const CustomerListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, userType } = useAppSelector((state) => state.app);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let unsubscribe: () => void;

    if (userType === 'AGENT') {
      if (user?.isSuperAdmin || user?.isAdmin) {
        // Admin can see all customers
        unsubscribe = firestore()
          .collection('Customers')
          .orderBy('createdAt', 'desc')
          .onSnapshot(
            (snapshot) => {
              const customerData: Customer[] = [];
              snapshot.forEach((doc) => {
                customerData.push(doc.data() as Customer);
              });
              setCustomers(customerData);
              setFilteredCustomers(customerData);
              setLoading(false);
            },
            (error) => {
              console.error('Error fetching customers:', error);
              setLoading(false);
            }
          );
      } else {
        // Regular agent sees their customers
        unsubscribe = firestore()
          .collection('Customers')
          .where('agentIdRef', '==', user?.id)
          .orderBy('createdAt', 'desc')
          .onSnapshot(
            (snapshot) => {
              const customerData: Customer[] = [];
              snapshot.forEach((doc) => {
                customerData.push(doc.data() as Customer);
              });
              setCustomers(customerData);
              setFilteredCustomers(customerData);
              setLoading(false);
            },
            (error) => {
              console.error('Error fetching customers:', error);
              setLoading(false);
            }
          );
      }
    } else if (userType === 'FRANCHISE' && user?.id) {
      // Franchise sees customers from their agents
      firestore()
        .collection('Agents')
        .where('franchiseIdRef', '==', user.id)
        .get()
        .then((agentSnapshot) => {
          const agentIds = agentSnapshot.docs.map((doc) => doc.id);
          
          if (agentIds.length > 0) {
            unsubscribe = firestore()
              .collection('Customers')
              .where('agentIdRef', 'in', agentIds.slice(0, 10)) // Firestore 'in' limit
              .orderBy('createdAt', 'desc')
              .onSnapshot(
                (snapshot) => {
                  const customerData: Customer[] = [];
                  snapshot.forEach((doc) => {
                    customerData.push(doc.data() as Customer);
                  });
                  setCustomers(customerData);
                  setFilteredCustomers(customerData);
                  setLoading(false);
                },
                (error) => {
                  console.error('Error fetching customers:', error);
                  setLoading(false);
                }
              );
          } else {
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, userType]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const renderCustomerCard = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CustomerDetail' as never, { customer: item } as never)}
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

        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.customerId}>{item.customerId}</Text>
          <Text style={styles.customerPhone}>{item.phone}</Text>
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

      <View style={styles.locationInfo}>
        <Text style={styles.locationText}>
          📍 {item.village}, {item.mandal}, {item.district}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.motorInfo?.length || 0}</Text>
          <Text style={styles.statLabel}>Motors</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {item.motorInfo?.filter((m) => m.approved).length || 0}
          </Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.state}</Text>
          <Text style={styles.statLabel}>State</Text>
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
          placeholder="Search customers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          Total Customers: <Text style={styles.statsValue}>{customers.length}</Text>
        </Text>
        <Text style={styles.statsText}>
          Active: <Text style={styles.statsValue}>{customers.filter((c) => c.isActive).length}</Text>
        </Text>
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No customers found</Text>
            <Text style={styles.emptySubtext}>Add your first customer to get started</Text>
          </View>
        }
      />

      {userType === 'AGENT' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddCustomer' as never)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
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
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  statsValue: {
    fontWeight: 'bold',
    color: '#007AFF',
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
    marginBottom: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  customerId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  customerPhone: {
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
  locationInfo: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#34C759',
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

export default CustomerListScreen;
