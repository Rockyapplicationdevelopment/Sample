import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@redux/hooks';
import { login } from '@redux/slices/appSlice';
import { authenticateFranchise } from '@services/firebaseHelper';
import firestore from '@react-native-firebase/firestore';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [phone, setPhone] = useState('');

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = email.toLowerCase().trim();

      // Try agent login first
      const agentSnapshot = await firestore()
        .collection('Agents')
        .where('email', '==', normalizedEmail)
        .where('password', '==', password)
        .limit(1)
        .get();

      if (!agentSnapshot.empty) {
        const agentData = agentSnapshot.docs[0].data();
        
        if (!agentData.isActive) {
          Alert.alert('Error', 'Your account is inactive. Please contact admin.');
          setLoading(false);
          return;
        }

        dispatch(login({ user: agentData as any, userType: 'AGENT' }));
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as never }],
        });
        return;
      }

      // Try franchise login
      const franchise = await authenticateFranchise(email, password);
      
      if (franchise) {
        dispatch(login({ user: franchise, userType: 'FRANCHISE' }));
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as never }],
        });
        return;
      }

      Alert.alert('Error', 'Invalid email or password');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    if (!phone.trim() || phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
    
    navigation.navigate('OTPVerification' as never, { phone } as never);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Borumithra Mobile</Text>
          <Text style={styles.subtitle}>Water Motor Registration System</Text>
        </View>

        <View style={styles.loginTypeContainer}>
          <TouchableOpacity
            style={[styles.typeButton, loginType === 'email' && styles.typeButtonActive]}
            onPress={() => setLoginType('email')}
          >
            <Text style={[styles.typeButtonText, loginType === 'email' && styles.typeButtonTextActive]}>
              Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, loginType === 'phone' && styles.typeButtonActive]}
            onPress={() => setLoginType('phone')}
          >
            <Text style={[styles.typeButtonText, loginType === 'phone' && styles.typeButtonTextActive]}>
              Phone OTP
            </Text>
          </TouchableOpacity>
        </View>

        {loginType === 'email' ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleEmailLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handlePhoneLogin}
            >
              <Text style={styles.loginButtonText}>Send OTP</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
            <Text style={styles.registerLink}>Register Here</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => Alert.alert('Info', 'Please contact admin to reset password')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loginTypeContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    marginRight: 5,
  },
  registerLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#007AFF',
  },
});

export default LoginScreen;
