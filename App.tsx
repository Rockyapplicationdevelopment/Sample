import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text } from 'react-native';

import { store, persistor } from './src/redux/store';
import { useAppSelector } from './src/redux/hooks';

// Auth Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';

// Dashboard
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';

// Franchise Screens
import FranchiseDashboardScreen from './src/screens/Franchise/FranchiseDashboardScreen';
import FranchiseListScreen from './src/screens/Franchise/FranchiseListScreen';
import AddFranchiseScreen from './src/screens/Franchise/AddFranchiseScreen';

// Agent Screens
import AgentListScreen from './src/screens/Agent/AgentListScreen';
import AddAgentScreen from './src/screens/Agent/AddAgentScreen';

// Customer Screens
import CustomerListScreen from './src/screens/Customer/CustomerListScreen';
import AddCustomerScreen from './src/screens/Customer/AddCustomerScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  const { user, userType } = useAppSelector((state) => state.app);

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="CustomerList"
        component={CustomerListScreen}
        options={{
          title: 'Customers',
          tabBarLabel: 'Customers',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👥</Text>,
        }}
      />
      {((userType === 'AGENT' && user?.isAdmin) || userType === 'FRANCHISE') && (
        <Tab.Screen
          name="AgentList"
          component={AgentListScreen}
          options={{
            title: 'Agents',
            tabBarLabel: 'Agents',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🤝</Text>,
          }}
        />
      )}
      {userType === 'AGENT' && user?.isSuperAdmin && (
        <Tab.Screen
          name="FranchiseList"
          component={FranchiseListScreen}
          options={{
            title: 'Franchises',
            tabBarLabel: 'Franchises',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏢</Text>,
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.app);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Create Account' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          {/* Agent Screens */}
          <Stack.Screen
            name="AddAgent"
            component={AddAgentScreen}
            options={{ title: 'Add Agent' }}
          />
          {/* Customer Screens */}
          <Stack.Screen
            name="AddCustomer"
            component={AddCustomerScreen}
            options={{ title: 'Add Customer' }}
          />
          {/* Franchise Screens */}
          <Stack.Screen
            name="AddFranchise"
            component={AddFranchiseScreen}
            options={{ title: 'Add Franchise' }}
          />
          <Stack.Screen
            name="FranchiseDashboard"
            component={FranchiseDashboardScreen}
            options={{ title: 'Franchise Dashboard' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        }
        persistor={persistor}
      >
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
