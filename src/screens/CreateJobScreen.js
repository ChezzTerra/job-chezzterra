import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { app } from './firebaseConfig';

const db = getFirestore(app);

const CreateJobScreen = ({ navigation }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [salary, setSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = [];

    if (!jobTitle.trim()) errors.push('• Название вакансии должно быть заполнено');
    if (!jobDescription.trim()) errors.push('• Описание вакансии должно быть заполнено');
    if (!salary.trim()) errors.push('• Зарплата должна быть указана');
    else if (isNaN(salary)) errors.push('• Зарплата должна быть числом');
    else if (parseFloat(salary) <= 0) errors.push('• Зарплата должна быть больше нуля');

    if (errors.length > 0) {
      Alert.alert('Ошибка валидации', errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleCreateJob = async () => {
    if (!validateForm()) return;

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Ошибка', 'Вы должны быть авторизованы для создания вакансии');
      navigation.navigate('Login');
      return;
    }

    setIsSubmitting(true);

    try {
      const docRef = await addDoc(collection(db, 'jobs'), {
        title: jobTitle.trim(),
        description: jobDescription.trim(),
        salary: parseFloat(salary),
        createdAt: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        status: 'active', // Добавляем статус вакансии
      });

      console.log('Вакансия создана с ID:', docRef.id);

      Alert.alert('Успех!', 'Вакансия успешно опубликована', [
        {
          text: 'OK',
          onPress: () => navigation.replace('JobListScreen')
        }
      ]);
    } catch (error) {
      console.error('Ошибка при добавлении вакансии:', error);
      Alert.alert(
        'Ошибка публикации',
        error.code === 'permission-denied'
          ? 'У вас нет прав на создание вакансий. Пожалуйста, войдите в систему.'
          : `Не удалось опубликовать вакансию: ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#4F46E5" />
        </TouchableOpacity>

        <Text style={styles.title}>Создать вакансию</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Название вакансии</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите название должности"
            placeholderTextColor="#94a3b8"
            value={jobTitle}
            onChangeText={setJobTitle}
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Описание вакансии</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Опишите обязанности и требования"
            placeholderTextColor="#94a3b8"
            value={jobDescription}
            onChangeText={setJobDescription}
            multiline
            numberOfLines={4}
            maxLength={1000}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Зарплата</Text>
          <TextInput
            style={styles.input}
            placeholder="Укажите сумму в рублях"
            placeholderTextColor="#94a3b8"
            value={salary}
            onChangeText={(value) => {
              if (/^\d*\.?\d*$/.test(value)) setSalary(value);
            }}
            keyboardType="decimal-pad"
            maxLength={10}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            isSubmitting && styles.buttonDisabled
          ]}
          onPress={handleCreateJob}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Опубликовать вакансию</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#1e293b',
    marginTop: 15,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 10,
    fontWeight: '500',
    paddingLeft: 5,
  },
  input: {
    height: 56,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#818CF8',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateJobScreen;
