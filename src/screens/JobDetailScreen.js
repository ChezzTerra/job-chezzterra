import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

const JobDetailScreen = ({ route, navigation }) => {
  const { job } = route.params;

  // Пример данных о компании и необходимых навыках
  const companyInfo = {
    name: 'Tech Solutions Ltd.',
    about: 'Мы ведущая технологическая компания, специализирующаяся на разработке инновационных решений для цифровой трансформации.',
    skills: ['React', 'Redux', 'JavaScript', 'HTML/CSS', 'Git', 'API интеграции'],
  };

  // Функция для перехода на экран подачи заявки
  const handleApply = () => {
    navigation.navigate('Application', { job });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.companyName}>{companyInfo.name}</Text>
      </View>
      <Text style={styles.description}>{job.description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О компании</Text>
        <Text style={styles.sectionContent}>{companyInfo.about}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Необходимые навыки</Text>
        {companyInfo.skills.map((skill, index) => (
          <Text key={index} style={styles.skillItem}>
            • {skill}
          </Text>
        ))}
      </View>

      <Text style={styles.coordinates}>Координаты: {job.latitude}, {job.longitude}</Text>

      <Button title="Подать заявку" onPress={handleApply} style={styles.applyButton} />

      {/* Обертка для кнопки "Назад" с дополнительным отступом */}
      <View style={styles.buttonContainer}>
        <Button title="Назад на главную" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#356CDF',
  },
  companyName: {
    fontSize: 18,
    color: '#6c757d',
    marginTop: 5,
  },
  description: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 20,
    lineHeight: 22,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  skillItem: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 5,
  },
  coordinates: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
    marginBottom: 10,
  },
  applyButton: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20, 
  },
});

export default JobDetailScreen;
