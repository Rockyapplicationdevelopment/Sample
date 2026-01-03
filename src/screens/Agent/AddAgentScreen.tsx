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
import { useAppSelector } from '@redux/hooks';
import firestore from '@react-native-firebase/firestore';
import { validateEmail, validatePhone } from '@utils/helpers';

const AddAgentScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, userType } = useAppSelector((state) => state.app);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadharNumber: '',
    state: '',
    district: '',
    mandal: '',
    village: '',
    pincode: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    panNumber: '',
    bloodGroup: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateAgentId = async (): Promise<string> => {
    const stateCode = formData.state.substring(0, 2).toUpperCase();
    const districtCode = formData.district.substring(0, 3).toUpperCase();
    
    const snapshot = await firestore()
      .collection('Agents')
      .where('state', '==', formData.state)
      .get();
    
    const count = snapshot.size + 1;
    return `BMAGL${stateCode}${districtCode}${String(count).padStart(4, '0')}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
    if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors');
      return;
    }

    setLoading(true);

    try {
      // Check if phone already exists
      const phoneCheck = await firestore()
        .collection('Agents')
        .where('phone', '==', formData.phone)
        .get();

      if (!phoneCheck.empty) {
        Alert.alert('Error', 'Phone number already registered');
        setLoading(false);
        return;
      }

      const agentId = await generateAgentId();
      const timestamp = new Date().toISOString();

      const agentData = {
        id: '',
        agentId,
        role: 'AG',
        name: formData.name,
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone,
        aadharNumber: formData.aadharNumber,
        state: formData.state,
        district: formData.district,
        mandal: formData.mandal,
        village: formData.village,
        pincode: formData.pincode,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode.toUpperCase(),
        bankName: formData.bankName,
        panNumber: formData.panNumber.toUpperCase(),
        bloodGroup: formData.bloodGroup,
        password: formData.password,
        isActive: true,
        isAdmin: false,
        isSuperAdmin: false,
        isMobileAccess: true,
        isExecutive: false,
        executiveTaggedDistrict: '',
        isAdminScriptEnabled: false,
        profilePhoto: '',
        location: {
          address: '',
          postalCode: formData.pincode,
          locality: formData.village,
          sublocality: formData.mandal,
          state: formData.state,
          country: 'India',
          lat: '',
          lng: '',
          latitude: '',
          longitude: '',
        },
        createdAt: timestamp,
        customerCount: 0,
        technicianCount: 0,
        isFranchiseAgent: userType === 'FRANCHISE',
        franchiseId: userType === 'FRANCHISE' ? (user as any)?.franchiseId : null,
        franchiseIdRef: userType === 'FRANCHISE' ? user?.id : null,
        commissionSettings: {
          motorRegistrationShare: 70,
          certificateRenewalShare: 70,
        },
        performanceMetrics: {
          monthlyTarget: 0,
          currentMonthRevenue: 0,
          totalRevenue: 0,
          totalCommission: 0,
        },
      };

      const docRef = await firestore().collection('Agents').add(agentData);
      await docRef.update({ id: docRef.id });

      // Update franchise agent count if applicable
      if (userType === 'FRANCHISE' && user?.id) {
        const franchiseRef = firestore().collection('Franchises').doc(user.id);
        const franchiseDoc = await franchiseRef.get();
        const franchise = franchiseDoc.data();
        
        await franchiseRef.update({
          agents: [...(franchise?.agents || []), agentId],
          'statistics.totalAgents': firestore.FieldValue.increment(1),
          'statistics.activeAgents': firestore.FieldValue.increment(1),
        });
      }

      Alert.alert('Success', `Agent registered successfully!\nAgent ID: ${agentId}`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Agent registration error:', error);
      Alert.alert('Error', error.message || 'Failed to register agent');
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
      <View style={styles.section}>
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
          placeholder="Aadhar Number"
          value={formData.aadharNumber}
          onChangeText={(text) => updateFormData('aadharNumber', text)}
          keyboardType="number-pad"
          maxLength={12}
        />

        <TextInput
          style={styles.input}
          placeholder="Blood Group (Optional)"
          value={formData.bloodGroup}
          onChangeText={(text) => updateFormData('bloodGroup', text.toUpperCase())}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.section}>
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
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Details</Text>

        <TextInput
          style={[styles.input, errors.accountNumber && styles.inputError]}
          placeholder="Account Number *"
          value={formData.accountNumber}
          onChangeText={(text) => updateFormData('accountNumber', text)}
          keyboardType="number-pad"
        />
        {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}

        <TextInput
          style={[styles.input, errors.ifscCode && styles.inputError]}
          placeholder="IFSC Code *"
          value={formData.ifscCode}
          onChangeText={(text) => updateFormData('ifscCode', text.toUpperCase())}
          autoCapitalize="characters"
        />
        {errors.ifscCode && <Text style={styles.errorText}>{errors.ifscCode}</Text>}

        <TextInput
          style={[styles.input, errors.bankName && styles.inputError]}
          placeholder="Bank Name *"
          value={formData.bankName}
          onChangeText={(text) => updateFormData('bankName', text)}
        />
        {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}

        <TextInput
          style={styles.input}
          placeholder="PAN Number (Optional)"
          value={formData.panNumber}
          onChangeText={(text) => updateFormData('panNumber', text.toUpperCase())}
          autoCapitalize="characters"
          maxLength={10}
        />
      </View>

      <View style={styles.section}>
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
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Register Agent</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
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
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddAgentScreen;
