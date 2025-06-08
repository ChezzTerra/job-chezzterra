import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from './firebaseConfig';

const { width } = Dimensions.get('window');
const db = getFirestore(app);

const JobSearchScreen = () => {
  const navigation = useNavigation();
  const [selectedArea, setSelectedArea] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [localJobs, setLocalJobs] = useState([]);

  const areas = [
    { id: "1174", text: "Якутия", icon: "location-city" },
    { id: "1179", text: "Мирный", icon: "location-on" },
    { id: "1183", text: "Покровск", icon: "location-on" },
    { id: "7372", text: "Ленский", icon: "location-on" },
    { id: "6916", text: "Солнечный", icon: "wb-sunny" },
    { id: "6012", text: "Чернышевский", icon: "location-on" }
  ];

  // Загрузка локальных вакансий из Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'jobs'), (snapshot) => {
      const localJobList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isLocal: true,
        published_at: doc.data().createdAt?.toDate()?.toISOString()
      }));
      setLocalJobs(localJobList);
    });

    return () => unsubscribe();
  }, []);

  const fetchJobs = async (isRefresh = false) => {
    if (!selectedArea) return;

    const currentPage = isRefresh ? 0 : page;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.hh.ru/vacancies?area=${selectedArea.id}&text=${encodeURIComponent(searchQuery)}&page=${currentPage}&per_page=20`
      );

      if (!response.ok) throw new Error('Ошибка загрузки данных');

      const data = await response.json();

      if (isRefresh) {
        setJobs(data.items || []);
        setPage(0);
      } else {
        setJobs(prev => [...prev, ...(data.items || [])]);
      }

      setHasMore(data.pages > currentPage + 1);
    } catch (err) {
      setError('Не удалось загрузить вакансии. Пожалуйста, проверьте соединение и попробуйте снова.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedArea) {
      setJobs([]);
      fetchJobs(true);
    }
  }, [selectedArea, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs(true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchJobs();
    }
  };

  const handleSearch = () => {
    setJobs([]);
    fetchJobs(true);
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Зарплата не указана';

    let result = '';
    if (salary.from) result += `от ${salary.from.toLocaleString('ru-RU')}`;
    if (salary.to) result += `${salary.from ? ' до ' : 'до '}${salary.to.toLocaleString('ru-RU')}`;

    if (salary.currency) {
      const currencySymbol = {
        'RUR': '₽',
        'USD': '$',
        'EUR': '€'
      }[salary.currency] || salary.currency;
      result += ` ${currencySymbol}`;
    }

    return result || 'Зарплата не указана';
  };

  const renderJobItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.jobItem}
      activeOpacity={0.7}
      key={`${item.id}_${index}_${Date.now()}`}
      onPress={() => navigation.navigate('JobDetail', { job: item })}
    >
      <View style={styles.jobHeader}>
        <View style={styles.companyLogoContainer}>
          {item.employer?.logo_urls?.['90'] ? (
            <Image
              source={{ uri: item.employer.logo_urls['90'] }}
              style={styles.companyLogo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.companyLogoPlaceholder}>
              <Ionicons name="business" size={24} color="#7c3aed" />
            </View>
          )}
        </View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle} numberOfLines={2}>{item.name || item.title}</Text>
          <Text style={styles.jobEmployer}>{item.employer?.name || 'окальная вакансия'}</Text>
        </View>
      </View>

      <View style={styles.salaryContainer}>
        <MaterialIcons name="attach-money" size={20} color="#10b981" />
        <Text style={styles.jobSalary}>
          {item.salary ? formatSalary(item.salary) : (item.salaryText || 'Зарплата не указана')}
        </Text>
      </View>

      {(item.snippet?.requirement || item.description) && (
        <View style={styles.requirementContainer}>
          <MaterialIcons name="check-circle" size={16} color="#94a3b8" />
          <Text style={styles.jobSnippet} numberOfLines={3}>
            {item.snippet?.requirement?.replace(/<\/?[^>]+(>|$)/g, "") ||
             item.description?.substring(0, 150) + (item.description?.length > 150 ? '...' : '')}
          </Text>
        </View>
      )}

      <View style={styles.jobFooter}>
        <View style={styles.jobMeta}>
          <MaterialIcons name="access-time" size={14} color="#64748b" />
          <Text style={styles.jobDate}>
            {item.published_at ?
              new Date(item.published_at).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }) :
              'Дата не указана'}
          </Text>
        </View>
        <View style={styles.jobType}>
          <Text style={styles.jobTypeText}>{item.schedule?.name || 'Полная занятость'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading || !jobs.length) return null;
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color="#7c3aed" />
        <Text style={styles.footerText}>Загрузка...</Text>
      </View>
    );
  };

  // Объединение локальных и API вакансий
  const allJobs = [...localJobs, ...jobs];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#e2e8f0" />
            </TouchableOpacity>
            <Text style={styles.header}>Раота в Республике Саха</Text>
          </View>
          <Text style={styles.subtitle}>Найдите лучшие вакансии в Якутии</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7c3aed']}
            tintColor="#7c3aed"
            progressBackgroundColor="#1e293b"
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="#94a3b8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Должность, компания или ключевые слова"
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  handleSearch();
                }}
                style={styles.clearButton}
              >
                <MaterialIcons name="close" size={20} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionTitle}>Выберите район</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.areasContainer}
          >
            {areas.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.areaButton,
                  selectedArea?.id === item.id && styles.selectedAreaButton
                ]}
                onPress={() => setSelectedArea(item)}
              >
                <MaterialIcons
                  name={item.icon}
                  size={20}
                  color={selectedArea?.id === item.id ? "#fff" : "#7c3aed"}
                  style={styles.areaIcon}
                />
                <Text style={[
                  styles.areaButtonText,
                  selectedArea?.id === item.id && styles.selectedAreaButtonText
                ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Секция локальных вакансий */}
          {localJobs.length > 0 && (
            <View style={styles.localJobsSection}>
              <Text style={styles.sectionTitle}>Локальные вакансии</Text>
              <FlatList
                data={localJobs}
                keyExtractor={(item) => item.id}
                renderItem={renderJobItem}
                scrollEnabled={false}
                contentContainerStyle={styles.jobsContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          )}

          {loading && !refreshing && !jobs.length ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7c3aed" />
              <Text style={styles.loadingText}>Загружаем вакансии...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => fetchJobs(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.retryButtonText}>Попробовать снова</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.jobsListContainer}>
              <View style={styles.jobsHeader}>
                <Text style={styles.jobsCountText}>
                  {allJobs.length > 0 ? `${allJobs.length} ${allJobs.length % 10 === 1 && allJobs.length % 100 !== 11 ? 'вакансия' :
                   [2,3,4].includes(allJobs.length % 10) && ![12,13,14].includes(allJobs.length % 100) ? 'вакансии' : 'вакансий'}` : 'Нет вакансий'}
                </Text>
                <TouchableOpacity style={styles.filterButton}>
                  <Feather name="filter" size={20} color="#7c3aed" />
                  <Text style={styles.filterButtonText}>Фильтры</Text>
                </TouchableOpacity>
              </View>

              {allJobs.length > 0 ? (
                <FlatList
                  data={allJobs}
                  keyExtractor={(item, index) => `${item.id}_${index}_${Date.now()}`}
                  renderItem={renderJobItem}
                  scrollEnabled={false}
                  contentContainerStyle={styles.jobsContainer}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  ListFooterComponent={renderFooter}
                  onEndReached={loadMore}
                  onEndReachedThreshold={0.5}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={64} color="#334155" />
                  <Text style={styles.emptyTitle}>
                    {selectedArea ? 'Вакансии не найдены' : 'Выберите район для поиска'}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {selectedArea
                      ? 'Попробуйте изменить параметры поиска или выбрать другой район'
                      : 'Выберите город или район из списка выше'}
                  </Text>
                  {selectedArea && (
                    <TouchableOpacity
                      style={styles.searchAgainButton}
                      onPress={() => fetchJobs(true)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.searchAgainButtonText}>Обновить результаты</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#0f172a',
  },
  headerContainer: {
    marginBottom: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e2e8f0',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(226, 232, 240, 0.8)',
    marginTop: 8,
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: -10,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#e2e8f0',
    fontFamily: 'System',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  localJobsSection: {
    marginBottom: 24,
  },
  areasContainer: {
    paddingBottom: 8,
  },
  areaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedAreaButton: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  areaIcon: {
    marginRight: 8,
  },
  areaButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedAreaButtonText: {
    color: '#fff',
  },
  jobsListContainer: {
    marginTop: 16,
  },
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  jobsCountText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '500',
    marginLeft: 6,
  },
  jobsContainer: {
    paddingBottom: 20,
  },
  jobItem: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#334155',
  },
  separator: {
    height: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#475569',
    overflow: 'hidden',
  },
  companyLogo: {
    width: '100%',
    height: '100%',
  },
  companyLogoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#334155',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
    lineHeight: 24,
  },
  jobEmployer: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobSalary: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '500',
    marginLeft: 8,
    lineHeight: 24,
  },
  requirementContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  jobSnippet: {
    fontSize: 14,
    color: '#cbd5e1',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDate: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 6,
  },
  jobType: {
    backgroundColor: '#334155',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  jobTypeText: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 20,
  },
  emptyTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
    maxWidth: 280,
  },
  searchAgainButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchAgainButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  footerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 8,
  },
});

export default JobSearchScreen;
