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
import { validatePhone } from '@utils/helpers';

const AddCustomerScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAppSelector((state) => state.app);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadharNumber: '',
    state: '',
    district: '',
    mandal: '',
    village: '',
    pincode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateCustomerId = async (): Promise<string> => {
    const stateCode = formData.state.substring(0, 2).toUpperCase();
    const districtCode = formData.district.substring(0, 3).toUpperCase();
    
    const snapshot = await firestore()
      .collection('Customers')
      .where('state', '==', formData.state)
      .get();
    
    const count = snapshot.size + 1;
    return `BMCUST${stateCode}${districtCode}${String(count).padStart(4, '0')}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.mandal.trim()) newErrors.mandal = 'Mandal is required';
    if (!formData.village.trim()) newErrors.village = 'Village is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors');
      return;
    }

    if (!user?.id || !user?.agentId) {
      Alert.alert('Error', 'Agent information not found');
      return;
    }

    setLoading(true);

    try {
      // Check if phone already exists
      const phoneCheck = await firestore()
        .collection('Customers')
        .where('phone', '==', formData.phone)
        .get();

      if (!phoneCheck.empty) {
        Alert.alert('Error', 'Phone number already registered');
        setLoading(false);
        return;
      }

      const customerId = await generateCustomerId();
      const timestamp = new Date().toISOString();

      const customerData = {
        id: '',
        customerId,
        role: 'CUST',
        name: formData.name,
        phone: formData.phone,
        aadharNumber: formData.aadharNumber,
        state: formData.state,
        district: formData.district,
        mandal: formData.mandal,
        village: formData.village,
        pincode: formData.pincode,
        agentId: user.agentId,
        agentIdRef: user.id,
        motorInfo: [],
        location: {
          address: `${formData.village}, ${formData.mandal}, ${formData.district}`,
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
        timeStamp: Date.now(),
        isActive: true,
        agent: null,
      };

      const docRef = await firestore().collection('Customers').add(customerData);
      await docRef.update({ id: docRef.id });

      // Update agent customer count
      await firestore()
        .collection('Agents')
        .doc(user.id)
        .update({
          customerCount: firestore.FieldValue.increment(1),
        });

      Alert.alert(
        'Success',
        `Customer registered successfully!\nCustomer ID: ${customerId}\n\nWould you like to add motor details?`,
        [
          {
            text: 'Later',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Add Motor',
            onPress: () =>
              navigation.navigate('AddMotor' as never, {
                customerId: docRef.id,
                customerName: formData.name,
              } as never),
          },
        ]
      );
    } catch (error: any) {
      console.error('Customer registration error:', error);
      Alert.alert('Error', error.message || 'Failed to register customer');
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
        <Text style={styles.headerText}>Register New Customer</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Customer Information</Text>

        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Full Name *"
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

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
          style={[styles.input, errors.mandal && styles.inputError]}
          placeholder="Mandal *"
          value={formData.mandal}
          onChangeText={(text) => updateFormData('mandal', text)}
        />
        {errors.mandal && <Text style={styles.errorText}>{errors.mandal}</Text>}

        <TextInput
          style={[styles.input, errors.village && styles.inputError]}
          placeholder="Village *"
          value={formData.village}
          onChangeText={(text) => updateFormData('village', text)}
        />
        {errors.village && <Text style={styles.errorText}>{errors.village}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Pincode"
          value={formData.pincode}
          onChangeText={(text) => updateFormData('pincode', text)}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Register Customer</Text>
          )}
        </TouchableOpacity>
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
    backgroundColor: '#34C759',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
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
  submitButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
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

export default AddCustomerScreen;
