import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ApplicationScreen = ({ navigation, route }) => {
  const { vacancy } = route.params || {};
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    if (!name || !email || !phone) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните обязательные поля.');
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Ошибка', 'Введите корректный email.');
      setIsSubmitting(false);
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert('Ошибка', 'Введите корректный номер телефона.');
      setIsSubmitting(false);
      return;
    }

    console.log('Заявка отправлена:', {
      name,
      email,
      phone,
      resume,
      vacancy: vacancy?.title || 'Не указана'
    });

    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert('Успех', 'Ваша заявка успешно отправлена!', [
        {
          text: 'Отлично',
          onPress: () => navigation.goBack()
        }
      ]);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Фиолетовый фон */}
      <View style={styles.background} />

      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Подать заявку</Text>

        {vacancy && (
          <Text style={styles.vacancyTitle} numberOfLines={1}>
            {vacancy.title}
          </Text>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Информация о вакансии */}
            {vacancy && (
              <View style={styles.vacancyCard}>
                <View style={styles.companyInfo}>
                  {vacancy.employer_logo ? (
                    <ImageBackground
                      source={{ uri: vacancy.employer_logo }}
                      style={styles.companyLogo}
                      resizeMode="contain"
                      imageStyle={styles.logoImage}
                    />
                  ) : (
                    <View style={styles.logoPlaceholder}>
                      <Ionicons name="business" size={24} color="#718096" />
                    </View>
                  )}
                  <View style={styles.companyDetails}>
                    <Text style={styles.companyName}>{vacancy.employer}</Text>
                    <Text style={styles.jobSalary}>{vacancy.salary}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Форма заявки */}
            <Text style={styles.sectionTitle}>Контактные данные</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>ФИО*</Text>
              <TextInput
                style={styles.input}
                placeholder="Иванов Иван Иванович"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email*</Text>
              <TextInput
                style={styles.input}
                placeholder="example@mail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Телефон*</Text>
              <TextInput
                style={styles.input}
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Сопроводительное письмо</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Расскажите о своем опыте и почему вы подходите на эту должность..."
                value={resume}
                onChangeText={setResume}
                multiline
                numberOfLines={5}
                placeholderTextColor="#A0AEC0"
              />
              <Text style={styles.hintText}>Необязательное поле</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                isSubmitting && styles.buttonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Отправить заявку</Text>
                  <Ionicons
                    name="paper-plane-outline"
                    size={20}
                    color="#FFF"
                    style={styles.buttonIcon}
                  />
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#6A11CB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    backgroundColor: '#6A11CB',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: Platform.OS === 'ios' ? 50 : 30,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 10,
  },
  vacancyTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  formContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  vacancyCard: {
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    borderRadius: 12,
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  jobSalary: {
    fontSize: 15,
    color: '#6A11CB',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#1A202C',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  hintText: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 6,
  },
  button: {
    backgroundColor: '#6A11CB',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#9B59B6',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
});

export default ApplicationScreen;
