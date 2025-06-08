import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebaseConfig';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [profileData, setProfileData] = useState({
    имя: '',
    должность: '',
    местоположение: '',
    навыки: '',
    опыт: [],
    аватар: 'https://randomuser.me/api/portraits/men/1.jpg',
    email: '',
    телефон: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [inputData, setInputData] = useState({ ...profileData });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!navigation) {
      console.error("Navigation not initialized");
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const loadProfileData = async () => {
      try {
        if (!userId) {
          console.log("No user ID available");
          setLoading(false);
          return;
        }

        if (!db) {
          console.error("Firebase database not initialized");
          setLoading(false);
          return;
        }

        const profileRef = ref(db, `users/${userId}`);
        const snapshot = await get(profileRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setProfileData(data);
          setInputData(data);
        }

        const user = auth.currentUser;
        if (user?.email) {
          setProfileData(prev => ({ ...prev, email: user.email || '' }));
          setInputData(prev => ({ ...prev, email: user.email || '' }));
        }
      } catch (error) {
        console.error("Ошибка загрузки данных: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProfileData();
    } else {
      setLoading(false);
    }
  }, [userId, navigation]);

  const handleChange = (name, value) => {
    setInputData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...inputData.опыт || []];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    handleChange('опыт', updatedExperience);
  };

  const handleSave = async () => {
    if (!userId) {
      console.error("No user ID available for save");
      alert("Пользователь не авторизован");
      return;
    }

    try {
      if (!db) {
        console.error("Firebase database not initialized");
        alert("Ошибка базы данных");
        return;
      }

      const profileRef = ref(db, `users/${userId}`);
      await set(profileRef, inputData);

      setProfileData(inputData);
      setIsEditing(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Ошибка сохранения: ", error);
      alert("Не удалось сохранить данные");
    }
  };

  const addExperience = () => {
    const newExperience = {
      должность: '',
      компания: '',
      период: '',
      описание: ''
    };
    handleChange('опыт', [...(inputData.опыт || []), newExperience]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileCard}>
          {/* Аватар */}
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={{ uri: inputData.аватар }}
              defaultSource={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            />
            {isEditing && (
              <TouchableOpacity style={styles.avatarEditButton}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {/* Личная информация */}
          <View style={styles.section}>
            {isEditing && <Text style={styles.label}>Имя</Text>}
            <TextInput
              style={[styles.inputField, !isEditing && styles.disabledInput]}
              value={inputData.имя}
              onChangeText={(text) => handleChange('имя', text)}
              editable={isEditing}
              placeholder="Ваше имя"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.inputField, styles.disabledInput]}
                onChangeText={(text) => handleChange('пот', text)}
              value={inputData.email || ''}
              editable={false}
            />

            {isEditing && <Text style={styles.label}>Телефон</Text>}
            <TextInput
              style={[styles.inputField, !isEditing && styles.disabledInput]}
              value={inputData.телефон}
              onChangeText={(text) => handleChange('телефон', text)}
              editable={isEditing}
              placeholder="Ваш телефон"
              keyboardType="phone-pad"
            />

            {isEditing && <Text style={styles.label}>Навыки</Text>}
            <TextInput
              style={[styles.inputField, !isEditing && styles.disabledInput]}
              value={inputData.навыки}
              onChangeText={(text) => handleChange('навыки', text)}
              editable={isEditing}
              placeholder="Ваши навыки (через запятую)"
              multiline
            />
          </View>

          {/* Опыт работы */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Опыт работы</Text>
              {isEditing && (
                <TouchableOpacity onPress={addExperience} style={styles.addButton}>
                  <Ionicons name="add" size={24} color="#4f46e5" />
                </TouchableOpacity>
              )}
            </View>

            {inputData.опыт?.map((item, index) => (
              <View key={index} style={styles.experienceItem}>
                {isEditing && <Text style={styles.label}>Должность</Text>}
                <TextInput
                  style={[styles.inputField, !isEditing && styles.disabledInput]}
                  value={item.должность}
                  onChangeText={(text) => handleExperienceChange(index, 'должность', text)}
                  editable={isEditing}
                  placeholder="Ваша должность"
                />

                {isEditing && <Text style={styles.label}>Компания</Text>}
                <TextInput
                  style={[styles.inputField, !isEditing && styles.disabledInput]}
                  value={item.компания}
                  onChangeText={(text) => handleExperienceChange(index, 'компания', text)}
                  editable={isEditing}
                  placeholder="Название компании"
                />

                {isEditing && <Text style={styles.label}>Период работы</Text>}
                <TextInput
                  style={[styles.inputField, !isEditing && styles.disabledInput]}
                  value={item.период}
                  onChangeText={(text) => handleExperienceChange(index, 'период', text)}
                  editable={isEditing}
                  placeholder="ММ/ГГГГ - ММ/ГГГГ"
                />

                {isEditing && <Text style={styles.label}>Описание</Text>}
                <TextInput
                  style={[styles.inputField, !isEditing && styles.disabledInput]}
                  value={item.описание}
                  onChangeText={(text) => handleExperienceChange(index, 'описание', text)}
                  editable={isEditing}
                  placeholder="Обязанности и достижения"
                  multiline
                />
              </View>
            ))}
          </View>
        </View>

        {/* Кнопки действий */}
        <View style={styles.buttonsContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Сохранить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setInputData(profileData);
                  setIsEditing(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Редактировать</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#4a5568" />
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#e8f4ff',
  },
  avatarEditButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#4f46e5',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a365d',
  },
  addButton: {
    padding: 5,
  },
  label: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 5,
    marginLeft: 5,
  },
  inputField: {
    fontSize: 16,
    color: '#2d3748',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  disabledInput: {
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    borderColor: 'transparent',
  },
  experienceItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    marginBottom: 15,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#e53e3e',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e0',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4a5568',
    marginLeft: 8,
  },
});

export default ProfileScreen;
