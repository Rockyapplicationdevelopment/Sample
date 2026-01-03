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
import { registerFranchise } from '@services/firebaseHelper';
import { FranchiseRegistrationData, TerritoryType } from '@models/Franchise';

const AddFranchiseScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerAadharNumber: '',
    franchiseName: '',
    businessType: '',
    state: '',
    districts: '',
    territoryType: 'DISTRICT' as TerritoryType,
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Invalid email format';
    }

    if (!formData.ownerPhone.trim()) {
      newErrors.ownerPhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.ownerPhone)) {
      newErrors.ownerPhone = 'Invalid phone number (10 digits required)';
    }

    if (!formData.franchiseName.trim()) {
      newErrors.franchiseName = 'Franchise name is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.districts.trim()) {
      newErrors.districts = 'At least one district is required';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }

    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

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
      Alert.alert('Validation Error', 'Please fix all errors before submitting');
      return;
    }

    setLoading(true);

    try {
      const districts = formData.districts
        .split(',')
        .map((d) => d.trim())
        .filter((d) => d);

      const registrationData: FranchiseRegistrationData = {
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
        ownerAadharNumber: formData.ownerAadharNumber,
        franchiseName: formData.franchiseName,
        businessType: formData.businessType,
        territory: {
          type: formData.territoryType,
          state: formData.state,
          districts,
          exclusiveRights: true,
        },
        bankDetails: {
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName,
          accountHolderName: formData.accountHolderName,
        },
        address: formData.address,
        password: formData.password,
      };

      const result = await registerFranchise(registrationData);

      Alert.alert(
        'Success',
        `Franchise registered successfully!\nFranchise ID: ${result.franchiseId}\n\nPending approval from admin.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to register franchise');
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
        <Text style={styles.sectionTitle}>Owner Information</Text>

        <TextInput
          style={[styles.input, errors.ownerName && styles.inputError]}
          placeholder="Owner Name *"
          value={formData.ownerName}
          onChangeText={(text) => updateFormData('ownerName', text)}
        />
        {errors.ownerName && <Text style={styles.errorText}>{errors.ownerName}</Text>}

        <TextInput
          style={[styles.input, errors.ownerEmail && styles.inputError]}
          placeholder="Owner Email *"
          value={formData.ownerEmail}
          onChangeText={(text) => updateFormData('ownerEmail', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.ownerEmail && <Text style={styles.errorText}>{errors.ownerEmail}</Text>}

        <TextInput
          style={[styles.input, errors.ownerPhone && styles.inputError]}
          placeholder="Owner Phone *"
          value={formData.ownerPhone}
          onChangeText={(text) => updateFormData('ownerPhone', text)}
          keyboardType="phone-pad"
          maxLength={10}
        />
        {errors.ownerPhone && <Text style={styles.errorText}>{errors.ownerPhone}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Owner Aadhar Number (Optional)"
          value={formData.ownerAadharNumber}
          onChangeText={(text) => updateFormData('ownerAadharNumber', text)}
          keyboardType="number-pad"
          maxLength={12}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Franchise Details</Text>

        <TextInput
          style={[styles.input, errors.franchiseName && styles.inputError]}
          placeholder="Franchise Name *"
          value={formData.franchiseName}
          onChangeText={(text) => updateFormData('franchiseName', text)}
        />
        {errors.franchiseName && (
          <Text style={styles.errorText}>{errors.franchiseName}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Business Type (Optional)"
          value={formData.businessType}
          onChangeText={(text) => updateFormData('businessType', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Address"
          value={formData.address}
          onChangeText={(text) => updateFormData('address', text)}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Territory</Text>

        <TextInput
          style={[styles.input, errors.state && styles.inputError]}
          placeholder="State *"
          value={formData.state}
          onChangeText={(text) => updateFormData('state', text)}
        />
        {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}

        <TextInput
          style={[styles.input, errors.districts && styles.inputError]}
          placeholder="Districts (comma-separated) *"
          value={formData.districts}
          onChangeText={(text) => updateFormData('districts', text)}
        />
        {errors.districts && <Text style={styles.errorText}>{errors.districts}</Text>}

        <Text style={styles.helperText}>
          Example: Bangalore Urban, Bangalore Rural
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Details</Text>

        <TextInput
          style={[styles.input, errors.accountHolderName && styles.inputError]}
          placeholder="Account Holder Name *"
          value={formData.accountHolderName}
          onChangeText={(text) => updateFormData('accountHolderName', text)}
        />
        {errors.accountHolderName && (
          <Text style={styles.errorText}>{errors.accountHolderName}</Text>
        )}

        <TextInput
          style={[styles.input, errors.accountNumber && styles.inputError]}
          placeholder="Account Number *"
          value={formData.accountNumber}
          onChangeText={(text) => updateFormData('accountNumber', text)}
          keyboardType="number-pad"
        />
        {errors.accountNumber && (
          <Text style={styles.errorText}>{errors.accountNumber}</Text>
        )}

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
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Login Credentials</Text>

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
          <Text style={styles.submitButtonText}>Register Franchise</Text>
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
  helperText: {
    fontSize: 12,
    color: '#666',
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

export default AddFranchiseScreen;
