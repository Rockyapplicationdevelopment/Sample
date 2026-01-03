import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import { store, persistor } from './src/redux/store';

import FranchiseDashboardScreen from './src/screens/Franchise/FranchiseDashboardScreen';
import FranchiseListScreen from './src/screens/Franchise/FranchiseListScreen';
import AddFranchiseScreen from './src/screens/Franchise/AddFranchiseScreen';

const Stack = createStackNavigator();

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
            <Stack.Navigator
              initialRouteName="FranchiseList"
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
              <Stack.Screen
                name="FranchiseList"
                component={FranchiseListScreen}
                options={{ title: 'Franchises' }}
              />
              <Stack.Screen
                name="AddFranchise"
                component={AddFranchiseScreen}
                options={{ title: 'Add Franchise' }}
              />
              <Stack.Screen
                name="FranchiseDashboard"
                component={FranchiseDashboardScreen}
                options={{ title: 'Dashboard' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
