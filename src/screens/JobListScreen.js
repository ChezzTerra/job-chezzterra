import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing
} from 'react-native';
import { getFirestore, collection, onSnapshot, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { app } from './firebaseConfig';

const db = getFirestore(app);

const JobListScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(getAuth(), (user) => {
      setUser(user);
    });

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();

    return () => unsubscribeAuth();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!user) {
      Alert.alert('Ошибка', 'Вы должны быть авторизованы для удаления вакансии.');
      return;
    }

    try {
      Alert.alert(
        'Подтвердить удаление',
        'Вы уверены, что хотите удалить эту вакансию?',
        [
          {
            text: 'Отмена',
            style: 'cancel',
          },
          {
            text: 'Удалить',
            onPress: async () => {
              try {
                const jobDocRef = doc(db, 'jobs', jobId);
                const jobDoc = await getDoc(jobDocRef);

                if (!jobDoc.exists()) {
                  Alert.alert('Ошибка', 'Вакансия не найдена.');
                  return;
                }

                await deleteDoc(jobDocRef);
                setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
                Alert.alert('Удалено', 'Вакансия успешно удалена.');
              } catch (error) {
                console.error('Ошибка при удалении вакансии:', error);
                Alert.alert('Ошибка', 'Не удалось удалить вакансию. Попробуйте позже.');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Ошибка при удалении вакансии:', error);
      Alert.alert('Ошибка', 'Не удалось удалить вакансию. Попробуйте позже.');
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'jobs'), (snapshot) => {
      if (snapshot.empty) {
        setJobs([]);
        setLoading(false);
        return;
      }

      const jobList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching jobs:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить вакансии');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.jobItem,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10 * index],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <TouchableOpacity
            onPress={() => handleDeleteJob(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>

        <Text style={styles.jobDescription}>{item.description}</Text>

        <View style={styles.jobDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={18} color="#1976d2" />
            <Text style={styles.detailText}>{item.salary}₽</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={18} color="#1976d2" />
            <Text style={styles.detailText}>{item.location || 'Не указано'}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Список вакансий</Text>
        <Text style={styles.subtitle}>Найди свою идеальную работу</Text>
      </Animated.View>

      {loading ? (
        <Animated.View
          style={[
            styles.loadingContainer,
            { opacity: fadeAnim }
          ]}
        >
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Загрузка вакансий...</Text>
        </Animated.View>
      ) : jobs.length === 0 ? (
        <Animated.View
          style={[
            styles.emptyContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Ionicons name="briefcase-outline" size={60} color="rgba(255,255,255,0.7)" />
          <Text style={styles.noJobsText}>Вакансий пока нет</Text>
          <Text style={styles.noJobsSubtext}>Создайте первую вакансию</Text>
        </Animated.View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Animated.View
        style={[
          styles.createButtonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateJob')}
          activeOpacity={0.8}
        >
          <View style={styles.createButtonContent}>
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.createButtonText}>Созать вакансию</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1976d2',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontFamily: 'sans-serif-light',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  jobItem: {
    marginBottom: 20,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0d47a1',
    flex: 1,
    letterSpacing: 0.3,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  jobDescription: {
    fontSize: 15,
    color: '#0d47a1',
    marginBottom: 20,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d47a1',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    margin: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  noJobsText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 20,
    textAlign: 'center',
  },
  noJobsSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
    marginTop: 20,
    fontWeight: '500',
  },
  createButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  createButton: {
    width: '80%',
    borderRadius: 15,
    backgroundColor: '#1565c0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 15,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
});

export default JobListScreen;
