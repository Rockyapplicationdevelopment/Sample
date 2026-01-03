import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { validateEmail, validatePhone } from '@utils/helpers';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'AGENT' | 'FRANCHISE'>('AGENT');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    state: '',
    district: '',
    mandal: '',
    village: '',
    pincode: '',
    aadharNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors before submitting');
      return;
    }

    setLoading(true);

    try {
      if (userType === 'AGENT') {
        navigation.navigate('AgentRegistrationForm' as never, { formData } as never);
      } else {
        navigation.navigate('AddFranchise' as never, { formData } as never);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Register as Agent or Franchise</Text>
      </View>

      <View style={styles.userTypeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, userType === 'AGENT' && styles.typeButtonActive]}
          onPress={() => setUserType('AGENT')}
        >
          <Text style={[styles.typeButtonText, userType === 'AGENT' && styles.typeButtonTextActive]}>
            Agent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, userType === 'FRANCHISE' && styles.typeButtonActive]}
          onPress={() => setUserType('FRANCHISE')}
        >
          <Text style={[styles.typeButtonText, userType === 'FRANCHISE' && styles.typeButtonTextActive]}>
            Franchise
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Full Name *"
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email *"
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="Phone Number *"
          value={formData.phone}
          onChangeText={(text) => updateFormData('phone', text)}
          keyboardType="phone-pad"
          maxLength={10}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Aadhar Number (Optional)"
          value={formData.aadharNumber}
          onChangeText={(text) => updateFormData('aadharNumber', text)}
          keyboardType="number-pad"
          maxLength={12}
        />

        <Text style={styles.sectionTitle}>Location</Text>

        <TextInput
          style={[styles.input, errors.state && styles.inputError]}
          placeholder="State *"
          value={formData.state}
          onChangeText={(text) => updateFormData('state', text)}
        />
        {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}

        <TextInput
          style={[styles.input, errors.district && styles.inputError]}
          placeholder="District *"
          value={formData.district}
          onChangeText={(text) => updateFormData('district', text)}
        />
        {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Mandal"
          value={formData.mandal}
          onChangeText={(text) => updateFormData('mandal', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Village"
          value={formData.village}
          onChangeText={(text) => updateFormData('village', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Pincode"
          value={formData.pincode}
          onChangeText={(text) => updateFormData('pincode', text)}
          keyboardType="number-pad"
          maxLength={6}
        />

        <Text style={styles.sectionTitle}>Security</Text>

        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Password *"
          value={formData.password}
          onChangeText={(text) => updateFormData('password', text)}
          secureTextEntry
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholder="Confirm Password *"
          value={formData.confirmPassword}
          onChangeText={(text) => updateFormData('confirmPassword', text)}
          secureTextEntry
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}

        <TouchableOpacity
          style={[styles.registerButton, loading && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.registerButtonText}>Continue to Registration</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
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
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 5,
    opacity: 0.9,
  },
  userTypeContainer: {
    flexDirection: 'row',
    margin: 20,
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
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
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    marginRight: 5,
  },
  loginLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
