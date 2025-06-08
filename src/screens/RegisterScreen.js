import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const handleJobSeekerRegister = () => {
    navigation.navigate('JobSeekerScreen');
  };

  const handleEmployerRegister = () => {
    navigation.navigate('EmployerPage');
  };

  const handleGoBack = () => {
    navigation.goBack(); // или navigation.navigate('HomeScreen') если нужно на конкретный экран
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        {/* Кнопка назад */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          hitSlop={{ top: 20, bottom: 30, left: 20, right: 20 }}
        >
          <Ionicons name="arrow-back" size={29} color="#fff" />
          
        </TouchableOpacity>

        <View style={styles.container}>
          <Text style={styles.title}>Регистрация</Text>
          <Text style={styles.subtitle}>Выберите тип аккаунта</Text>

          {/* Кнопка регистрации для соискателя */}
          <TouchableOpacity
            style={[styles.button, styles.jobSeekerButton]}
            onPress={handleJobSeekerRegister}
            activeOpacity={0.9}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="person-outline" size={28} color="#fff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.buttonTitle}>Соискатель</Text>
              <Text style={styles.buttonDescription}>Ищу работу</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Кнопка регистрации для работодателя */}
          <TouchableOpacity
            style={[styles.button, styles.employerButton]}
            onPress={handleEmployerRegister}
            activeOpacity={0.9}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="business-outline" size={28} color="#fff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.buttonTitle}>Работодатель</Text>
              <Text style={styles.buttonDescription}>Предлагаю работу</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4F46E5',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 76,
    left: 16,
    zIndex: 10,
    padding: 30,
  },
  container: {
    padding: 24,
    marginHorizontal: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  jobSeekerButton: {
    backgroundColor: '#10B981',
  },
  employerButton: {
    backgroundColor: '#EF4444',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  buttonDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});

export default RegisterScreen;
