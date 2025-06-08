import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ route, navigation }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [allVacancies, setAllVacancies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.9))[0];

    const yakutiaRegions = [
        {"id":"1174","text":"Республика Саха (Якутия)","url":"https://api.hh.ru/areas/1174"},
        {"id":"1179","text":"Мирный (Республика Саха (Якутия))","url":"https://api.hh.ru/areas/1179"},
        {"id":"1183","text":"Покровск (Якутия)","url":"https://api.hh.ru/areas/1183"},
        {"id":"7372","text":"Ленинский (Республика Саха (Якутия))","url":"https://api.hh.ru/areas/7372"},
        {"id":"6916","text":"Солнечный (Якутия)","url":"https://api.hh.ru/areas/6916"},
        {"id":"6012","text":"Чернышевский (Республика Саха (Якутия))","url":"https://api.hh.ru/areas/6012"}
    ];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true
            })
        ]).start();

        fetchVacancies();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const formatSalary = (salary) => {
        if (!salary) return 'З/п не указана';
        let result = '';
        if (salary.from) result += `от ${salary.from.toLocaleString()}`;
        if (salary.to) result += result ? ` до ${salary.to.toLocaleString()}` : `до ${salary.to.toLocaleString()}`;
        return `${result} ${salary.currency === 'RUR' ? '₽' : salary.currency}`;
    };

    const fetchVacancies = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const randomRegion = yakutiaRegions[Math.floor(Math.random() * yakutiaRegions.length)];

            const response = await fetch(`https://api.hh.ru/vacancies?area=${randomRegion.id}&per_page=10`, {
                headers: {
                    'User-Agent': 'JobMapApp/1.0 (support@jobmapapp.com)',
                    'HH-User-Agent': 'JobMapApp/1.0 (support@jobmapapp.com)'
                }
            });

            if (!response.ok) {
                throw new Error(`Ошибка API: ${response.status}`);
            }

            const data = await response.json();

            if (!data.items || data.items.length === 0) {
                throw new Error('Вакансии не найдены');
            }

            const vacancies = data.items.map(item => ({
                id: item.id,
                title: item.name,
                employer: item.employer?.name || 'Компания не указана',
                salary: item.salary ? formatSalary(item.salary) : 'З/п не указана',
                area: item.area?.name || 'Не указано',
                experience: item.experience?.name || 'Опыт не указан',
                url: item.alternate_url,
                published_at: item.published_at,
                employer_logo: item.employer?.logo_urls?.original || null
            }));

            setAllVacancies(vacancies);

        } catch (error) {
            console.error('Ошибка загрузки вакансий:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            })
        ]).start();

        fetchVacancies();
        setSearchQuery('');
    };

    const filterVacancies = () => {
        if (!searchQuery.trim()) {
            return allVacancies;
        }

        const query = searchQuery.toLowerCase();
        return allVacancies.filter(vacancy =>
            vacancy.title.toLowerCase().includes(query) ||
            vacancy.employer.toLowerCase().includes(query)
        );
    };

    const filteredVacancies = filterVacancies();
    const recommendedVacancies = filteredVacancies.slice(0, 3);
    const actualVacancies = filteredVacancies.slice(3);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                        <Ionicons name="menu" size={29} color="#fff" />
                    </TouchableOpacity>
                    
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.greeting}>Добро пожаловать,</Text>
                    <Text style={styles.userName}>Артем</Text>
                </View>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Ionicons name='search' size={22} color='#7A7A7A' />
                <TextInput
                    placeholder='Поиск вакансий'
                    placeholderTextColor={'#7A7A7A'}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setSearchQuery('')}
                        style={styles.clearButton}
                    >
                        <Ionicons name="close-circle" size={22} color="#7A7A7A" />
                    </TouchableOpacity>
                )}
                <View style={styles.searchIcons}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('EmployerPage')}
                        style={styles.searchIcon}
                    >
                        <Ionicons name='business-outline' size={26} color='#4A6CF7' />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ApplicantPage')}
                        style={styles.searchIcon}
                    >
                        <Ionicons name='person-outline' size={26} color='#4A6CF7' />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal visible={isMenuOpen} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
          {/* Заголовок с градиентом */}
          <LinearGradient
              colors={['#4A6CF7', '#6B48F7']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.modalHeader}
          >
              <Text style={styles.modalTitle}>Меню</Text>
              <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                  <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
          </LinearGradient>

          {/* Контент с современными тенями и отступами */}
          <ScrollView
              style={styles.menuItems}
              contentContainerStyle={styles.menuItemsContent}
              showsVerticalScrollIndicator={false}
          >
              {[
                  {name: 'Главная', screen: 'Home', icon: 'home-outline'},
                  {name: 'Профиль', screen: 'Profile', icon: 'person-outline'},
                  {name: 'Настройки', screen: 'Settings', icon: 'settings-outline'},
                  {name: 'Помощь', screen: 'Help', icon: 'help-circle-outline'},
                  {name: 'Карта вакансий', screen: 'Map', params: {location: 'Якутск'}, icon: 'map-outline'},
                  {name: 'Лучшие работодатели', screen: 'TopEmployers', icon: 'trophy-outline'}
              ].map((item, index) => (
                  <TouchableOpacity
                      key={index}
                      onPress={() => {
                          toggleMenu();
                          navigation.navigate(item.screen, item.params);
                      }}
                      style={styles.menuItem}
                  >
                      <View style={styles.menuItemContent}>
                          <Ionicons name={item.icon} size={22} color="#4A6CF7" style={styles.menuIcon} />
                          <Text style={styles.menuItemText}>{item.name}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                  </TouchableOpacity>
              ))}
          </ScrollView>
      </View>
  </Modal>

            {/* Content */}
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                {/* Recommended Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Рекомендации для вас</Text>
                    <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                        <Ionicons name="refresh" size={24} color="#4A6CF7" />
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4A6CF7" />
                        <Text style={styles.loadingText}>Загрузка вакансий...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="warning-outline" size={40} color="#FF6B6B" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={handleRefresh}
                        >
                            <Text style={styles.retryButtonText}>Повторить попытку</Text>
                        </TouchableOpacity>
                    </View>
                ) : recommendedVacancies.length === 0 ? (
                    <View style={styles.noResultsContainer}>
                        <Ionicons name="briefcase-outline" size={40} color="#C4C4C4" />
                        <Text style={styles.noResultsText}>Нет рекомендаций</Text>
                    </View>
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.recommendedContainer}
                    >
                        {recommendedVacancies.map(vacancy => (
                            <View
                                key={vacancy.id}
                                style={styles.vacancyCard}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={styles.companyInfo}>
                                        {vacancy.employer_logo ? (
                                            <Image
                                                source={{ uri: vacancy.employer_logo }}
                                                style={styles.companyLogo}
                                                onError={(e) => console.log("Ошибка загрузки логотипа:", e.nativeEvent.error)}
                                            />
                                        ) : (
                                            <View style={styles.logoPlaceholder}>
                                                <Ionicons name="business-outline" size={24} color="#7A7A7A" />
                                            </View>
                                        )}
                                        <View style={styles.companyDetails}>
                                            <Text style={styles.companyName} numberOfLines={1}>
                                                {vacancy.employer}
                                            </Text>
                                            <Text style={styles.companyLocation} numberOfLines={1}>
                                                {vacancy.area}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity>
                                        <Ionicons name='bookmark-outline' size={24} color='#C4C4C4' />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.jobTitle} numberOfLines={2}>
                                    {vacancy.title}
                                </Text>
                                <View style={styles.experienceContainer}>
                                    <Ionicons name="time-outline" size={16} color="#7A7A7A" />
                                    <Text style={styles.jobExperience}>
                                        {vacancy.experience}
                                    </Text>
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.salaryText}>
                                        {vacancy.salary}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.applyButton}
                                        onPress={() => navigation.navigate('Application', { vacancy })}
                                    >
                                        <Text style={styles.applyButtonText}>Откликнуться</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                )}

                {/* Actual Vacancies Section */}
                <View style={[styles.sectionHeader, { marginTop: 32 }]}>
                    <Text style={styles.sectionTitleLarge}>Актуальные вакансии</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AllVacancies', { vacancies: filteredVacancies })}>
                        <Text style={styles.seeAll}>Все вакансии →</Text>
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4A6CF7" />
                        <Text style={styles.loadingText}>Загрузка вакансий...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="warning-outline" size={40} color="#FF6B6B" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={handleRefresh}
                        >
                            <Text style={styles.retryButtonText}>Повторить попытку</Text>
                        </TouchableOpacity>
                    </View>
                ) : actualVacancies.length === 0 ? (
                    <View style={styles.noResultsContainer}>
                        <Ionicons name="briefcase-outline" size={40} color="#C4C4C4" />
                        <Text style={styles.noResultsText}>Нет актуальных вакансий</Text>
                    </View>
                ) : (
                    <View style={styles.actualVacancies}>
                        {actualVacancies.map((vacancy, index) => (
                            <TouchableOpacity
                                key={`${vacancy.id}-${index}`}
                                style={styles.actualVacancyCard}
                                onPress={() => navigation.navigate('Application', { vacancy })}
                                activeOpacity={0.8}
                            >
                                <View style={styles.actualCardHeader}>
                                    <View style={styles.actualCompanyInfo}>
                                        {vacancy.employer_logo ? (
                                            <Image
                                                source={{ uri: vacancy.employer_logo }}
                                                style={styles.actualCompanyLogo}
                                                onError={(e) => console.log("Ошибка загрузки логотипа:", e.nativeEvent.error)}
                                            />
                                        ) : (
                                            <View style={styles.actualLogoPlaceholder}>
                                                <Ionicons name="business-outline" size={24} color="#7A7A7A" />
                                            </View>
                                        )}
                                        <View style={styles.actualJobInfo}>
                                            <Text
                                                style={styles.actualJobTitle}
                                                numberOfLines={1}
                                            >
                                                {vacancy.title}
                                            </Text>
                                            <Text
                                                style={styles.actualCompanyName}
                                                numberOfLines={1}
                                            >
                                                {vacancy.employer}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity>
                                        <Ionicons name='bookmark-outline' size={24} color='#C4C4C4' />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.actualCardFooter}>
                                    <View style={styles.actualExperience}>
                                        <Ionicons name="time-outline" size={14} color="#7A7A7A" />
                                        <Text style={styles.actualExperienceText}>
                                            {vacancy.experience}
                                        </Text>
                                    </View>
                                    <View style={styles.actualLocationContainer}>
                                        <Ionicons name="location-outline" size={14} color="#7A7A7A" />
                                        <Text style={styles.actualLocation}>
                                            {vacancy.area}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.actualSalaryContainer}>
                                    <Text style={styles.actualSalary}>
                                        {vacancy.salary}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.navigation}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={styles.navItem}
                >
                    <View style={styles.navIconContainer}>
                        <Ionicons name="home" size={24} color="#4A6CF7" />
                    </View>
                    <Text style={styles.activeNavText}>Главная</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    style={styles.navItem}
                >
                    <View style={styles.navIconContainer}>
                        <Ionicons name="person-outline" size={24} color="#7A7A7A" />
                    </View>
                    <Text style={styles.navText}>Профиль</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Messages')}
                    style={styles.navItem}
                >
                    <View style={styles.navIconContainer}>
                        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#7A7A7A" />
                    </View>
                    <Text style={styles.navText}>Сообщения</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    style={styles.navItem}
                >
                    <View style={styles.navIconContainer}>
                        <Ionicons name="person-add-outline" size={24} color="#7A7A7A" />
                    </View>
                    <Text style={styles.navText}>Регистрация</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FF',
    },
    header: {
        backgroundColor: '#5B6DF1',
        paddingHorizontal: 24,
        paddingTop: 50,
        paddingBottom: 30,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        shadowColor: '#5B6DF1',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 12,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
    },
    headerContent: {
        marginTop: 10,
    },
    greeting: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    userName: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: '700',
        marginTop: 4,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
    },
    searchContainer: {
        backgroundColor: '#FFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -24,
        marginHorizontal: 24,
        shadowColor: '#4A6CF7',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        zIndex: 10,
        borderWidth: 1,
        borderColor: 'rgba(74,108,247,0.1)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#1A1A1A',
        paddingVertical: 0,
        fontFamily: 'System',
        fontWeight: '500',
    },
    clearButton: {
        marginLeft: 8,
        padding: 4,
    },
    searchIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
        gap: 12,
    },
    searchIcon: {
        padding: 6,
        backgroundColor: 'rgba(74,108,247,0.1)',
        borderRadius: 12,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#F8F9FF',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 24,
        paddingTop: 50,
        backgroundColor: '#5B6DF1',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
        letterSpacing: 0.5,
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    menuItems: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#F8F9FF',
    },
    menuItemsContent: {
        paddingBottom: 30,
        paddingTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginVertical: 6,
        backgroundColor: '#FFF',
        borderRadius: 16,
        shadowColor: '#5B6DF1',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(91,109,241,0.1)',
    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIcon: {
        marginRight: 16,
        color: '#5B6DF1',
    },
    menuItemText: {
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '600',
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 30,
        backgroundColor: '#F8F9FF',
        marginBottom: 80,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: 0.3,
    },
    sectionTitleLarge: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    seeAll: {
        color: '#5B6DF1',
        fontSize: 14,
        fontWeight: '600',
    },
    refreshButton: {
        padding: 8,
        backgroundColor: 'rgba(91,109,241,0.1)',
        borderRadius: 12,
    },
    loadingContainer: {
        height: 240,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#5B6DF1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(91,109,241,0.1)',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#7A7A7A',
        fontWeight: '500',
    },
    errorContainer: {
        height: 240,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#5B6DF1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(91,109,241,0.1)',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
        fontWeight: '600',
        maxWidth: '80%',
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: '#5B6DF1',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 14,
        marginTop: 20,
        shadowColor: '#5B6DF1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    noResultsContainer: {
        height: 240,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#5B6DF1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(91,109,241,0.1)',
    },
    noResultsText: {
        fontSize: 16,
        color: '#7A7A7A',
        marginTop: 16,
        fontWeight: '500',
    },
    recommendedContainer: {
        paddingBottom: 16,
        paddingRight: 24,
    },
    vacancyCard: {
        backgroundColor: '#FFF',
        padding: 24,
        borderRadius: 24,
        width: 300,
        marginRight: 16,
        shadowColor: '#5B6DF1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(91,109,241,0.1)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    companyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    companyLogo: {
        width: 52,
        height: 52,
        borderRadius: 14,
    },
    logoPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#F5F6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    companyDetails: {
        marginLeft: 14,
        flex: 1,
    },
    companyName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    companyLocation: {
        fontSize: 14,
        color: '#7A7A7A',
        marginTop: 4,
    },
    jobTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 14,
        lineHeight: 26,
    },
    experienceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 22,
    },
    jobExperience: {
        fontSize: 14,
        color: '#7A7A7A',
        marginLeft: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    salaryText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
    },
    applyButton: {
        backgroundColor: '#5B6DF1',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 14,
        shadowColor: '#5B6DF1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    applyButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    actualVacancies: {
        marginBottom: 40,
        gap: 12,
    },
    actualVacancyCard: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 18,
        shadowColor: '#5B6DF1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(91,109,241,0.1)',
    },
    actualCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    actualCompanyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    actualCompanyLogo: {
        width: 44,
        height: 44,
        borderRadius: 12,
    },
    actualLogoPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F5F6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actualJobInfo: {
        flex: 1,
    },
    actualJobTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    actualCompanyName: {
        fontSize: 14,
        color: '#7A7A7A',
        marginTop: 4,
    },
    actualCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
    },
    actualExperience: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actualExperienceText: {
        fontSize: 13,
        color: '#7A7A7A',
        marginLeft: 8,
    },
    actualLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actualLocation: {
        fontSize: 13,
        color: '#7A7A7A',
        marginLeft: 8,
    },
    actualSalaryContainer: {
        marginTop: 16,
    },
    actualSalary: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: 'rgba(91,109,241,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    navIconContainer: {
        padding: 10,
        marginBottom: 4,
        backgroundColor: 'rgba(91,109,241,0.1)',
        borderRadius: 16,
    },
    navText: {
        color: '#7A7A7A',
        fontSize: 12,
        fontWeight: '500',
    },
    activeNavText: {
        color: '#5B6DF1',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default HomeScreen;
