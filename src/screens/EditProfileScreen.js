import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('Калачев Артем');
  const [jobStatus, setJobStatus] = useState('Frontend-разработчик');
  const [location, setLocation] = useState('Якутск');
  const [skills, setSkills] = useState('React, Redux, JavaScript, TypeScript, HTML, CSS, REST API, Git');

  const handleSave = () => {
    // Логика сохранения данных
    // После сохранения возвращаемся на экран профиля
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Имя</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Должность</Text>
      <TextInput
        style={styles.input}
        value={jobStatus}
        onChangeText={setJobStatus}
      />

      <Text style={styles.label}>Местоположение</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Навыки</Text>
      <TextInput
        style={styles.input}
        value={skills}
        onChangeText={setSkills}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Сохранить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#171716',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditProfileScreen;
