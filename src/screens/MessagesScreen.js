import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Animated,
  Easing,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const MessagesScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMoreVacancies, setHasMoreVacancies] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRegionModalVisible, setIsRegionModalVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionVacanciesTitle, setRegionVacanciesTitle] = useState('');
  const [typingIndicator, setTypingIndicator] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(height))[0];
  const flatListRef = useRef(null);

  // Регионы Якутии
  const yakutiaRegions = [
    {"id":"1174","text":"Республика Саха (Якутия)","url":"https://api.hh.ru/areas/1174"},
    {"id":"1179","text":"Мирный (Республика Саха (Якутия))","url":"https://api.hh.ru/areas/1179"},
    {"id":"1183","text":"Покровск (Якутия)","url":"https://api.hh.ru/areas/1183"},
    {"id":"7372","text":"Ленинский (Республика Саха (Якутия))","url":"https://api.hh.ru/areas/7372"},
    {"id":"6916","text":"Солнечный (Якутия)","url":"https://api.hh.ru/areas/6916"},
    {"id":"6012","text":"Чернышевский (Республика Саха (Якутия))","url":"https://api.hh.ru/areas/6012"}
  ];

  useEffect(() => {
    const initialMessage = {
      text: 'Привет! Я помогу найти вакансии в Якутии. Введите /vacancy для поиска или выберите регион выше.',
      sender: 'bot',
      id: Date.now(),
      timestamp: new Date()
    };
    setMessages([initialMessage]);

    // Устанавливаем регион по умолчанию
    setSelectedRegion(yakutiaRegions[0]);
    setRegionVacanciesTitle(`Вакансии в ${yakutiaRegions[0].text}`);

    // Анимация при загрузке
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, []);

  useEffect(() => {
    // Прокрутка к новым сообщениям
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const animateModalIn = () => {
    setIsRegionModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.back(1)),
      useNativeDriver: true
    }).start();
  };

  const animateModalOut = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true
    }).start(() => setIsRegionModalVisible(false));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    Animated.spring(fadeAnim, {
      toValue: 1,
      speed: 20,
      bounciness: 10,
      useNativeDriver: true
    }).start();
  };

  const simulateTyping = () => {
    setTypingIndicator(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setTypingIndicator(false);
        resolve();
      }, 1500);
    });
  };

  const fetchVacancies = async (page = 1, isRefresh = false) => {
    if (!selectedRegion) return;

    setIsLoading(true);
    if (isRefresh) {
      setIsRefreshing(true);
    }

    const url = `https://api.hh.ru/vacancies?area=${selectedRegion.id}&text=developer&page=${page}&per_page=10`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.items.length > 0) {
        const fetchedVacancies = data.items.map(vacancy => ({
          id: vacancy.id,
          name: vacancy.name,
          employer: { name: vacancy.employer.name },
          salary: vacancy.salary
            ? {
                from: vacancy.salary.from,
                to: vacancy.salary.to,
                currency: vacancy.salary.currency || 'RUB',
              }
            : null,
          area: { name: vacancy.area.name || 'Не указано' },
          experience: vacancy.experience?.name || 'Не указан',
          employment: vacancy.employment?.name || 'Не указана',
          alternate_url: vacancy.alternate_url,
          published_at: new Date(vacancy.published_at)
        }));

        setVacancies(prevVacancies =>
          page === 1 || isRefresh ? fetchedVacancies : [...prevVacancies, ...fetchedVacancies]
        );
        setCurrentPage(page);
        setHasMoreVacancies(data.pages > page);

        await simulateTyping();
        addBotMessage(`Найдено ${data.found} вакансий в ${selectedRegion.text}`);
      } else {
        setHasMoreVacancies(false);
        await simulateTyping();
        addBotMessage('Вакансии не найдены. Попробуйте другой регион или параметры поиска.');
      }
    } catch (error) {
      console.error('Error fetching vacancies:', error);
      await simulateTyping();
      addBotMessage('Произошла ошибка при загрузке вакансий. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchRandomVacancies = async () => {
    if (!selectedRegion) return;

    setIsLoading(true);
    const url = `https://api.hh.ru/vacancies?area=${selectedRegion.id}&text=developer&per_page=50`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.items.length > 0) {
        const randomVacancies = getRandomItems(data.items, 5);
        const fetchedVacancies = randomVacancies.map(vacancy => ({
          id: vacancy.id,
          name: vacancy.name,
          employer: { name: vacancy.employer.name },
          salary: vacancy.salary
            ? {
                from: vacancy.salary.from,
                to: vacancy.salary.to,
                currency: vacancy.salary.currency || 'RUB',
              }
            : null,
          area: { name: vacancy.area.name || 'Не указано' },
          experience: vacancy.experience?.name || 'Не указан',
          employment: vacancy.employment?.name || 'Не указана',
          alternate_url: vacancy.alternate_url,
          published_at: new Date(vacancy.published_at)
        }));

        setVacancies(fetchedVacancies);
        setHasMoreVacancies(false);

        await simulateTyping();
        addBotMessage(`Показаны случайные вакансии из ${selectedRegion.text}`);
      }
    } catch (error) {
      console.error('Error fetching random vacancies:', error);
      await simulateTyping();
      addBotMessage('Ошибка при загрузке вакансий. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomItems = (arr, numItems) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numItems);
  };

  const addBotMessage = (text) => {
    const newMessage = {
      text,
      sender: 'bot',
      id: Date.now(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (message.trim()) {
      const userMessage = {
        text: message,
        sender: 'user',
        id: Date.now(),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setMessage('');

      if (message.trim() === '/vacancy') {
        setVacancies([]);
        await fetchVacancies(1, true);
      } else if (message.trim() === '/help') {
        await simulateTyping();
        addBotMessage('Доступные команды:\n/vacancy - поиск вакансий\n/random - случайные вакансии\n/region - изменить регион\n/clear - очистить чат');
      } else if (message.trim() === '/random') {
        setVacancies([]);
        await fetchRandomVacancies();
      } else if (message.trim() === '/region') {
        animateModalIn();
      } else if (message.trim() === '/clear') {
        setMessages([]);
        setVacancies([]);
        const initialMessage = {
          text: 'Чат очищен. Введите /vacancy для поиска вакансий.',
          sender: 'bot',
          id: Date.now(),
          timestamp: new Date()
        };
        setMessages([initialMessage]);
      } else {
        await simulateTyping();
        addBotMessage('Неизвестная команда. Введите /help для списка команд.');
      }
    }
  };

  const handleLoadMore = () => {
    if (hasMoreVacancies && !isLoading) {
      fetchVacancies(currentPage + 1);
    }
  };

  const handleRefresh = () => {
    if (!isLoading && !isRefreshing) {
      fetchVacancies(1, true);
    }
  };

  const handleRegionSelect = async (region) => {
    setSelectedRegion(region);
    setRegionVacanciesTitle(`Вакансии в ${region.text}`);
    animateModalOut();
    setVacancies([]);
    await simulateTyping();
    addBotMessage(`Регион изменен на ${region.text}. Введите /vacancy для поиска.`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Зарплата не указана';

    let result = '';
    if (salary.from) result += `от ${salary.from.toLocaleString()} `;
    if (salary.to) result += `до ${salary.to.toLocaleString()} `;
    result += salary.currency === 'RUR' ? 'руб.' : salary.currency.toLowerCase();

    return result || 'Зарплата не указана';
  };

  const renderRegionItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.regionItem,
        isDarkMode ? styles.darkRegionItem : styles.lightRegionItem,
        selectedRegion?.id === item.id && styles.selectedRegionItem
      ]}
      onPress={() => handleRegionSelect(item)}
    >
      <Text style={[
        styles.regionText,
        isDarkMode ? styles.darkRegionText : styles.lightRegionText,
        selectedRegion?.id === item.id && styles.selectedRegionText
      ]}>
        {item.text}
      </Text>
      {selectedRegion?.id === item.id && (
        <Icon name="check-circle" size={20} color={isDarkMode ? '#4CAF50' : '#2E7D32'} style={styles.regionIcon} />
      )}
    </TouchableOpacity>
  );

  const renderVacancyItem = ({ item }) => (
    <Animated.View
      style={[
        styles.vacancyContainer,
        isDarkMode ? styles.darkVacancyContainer : styles.lightVacancyContainer,
        { opacity: fadeAnim, marginVertical: 8 }
      ]}
    >
      <Text style={[styles.vacancyTitle, isDarkMode ? styles.darkVacancyTitle : styles.lightVacancyTitle]}>
        {item.name}
      </Text>

      <View style={styles.vacancyMeta}>
        <View style={styles.metaItem}>
          <Icon name="business" size={16} color={isDarkMode ? '#90CAF9' : '#1976D2'} />
          <Text style={[styles.vacancyEmployer, isDarkMode ? styles.darkVacancyText : styles.lightVacancyText]}>
            {item.employer.name}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <Icon name="location-on" size={16} color={isDarkMode ? '#90CAF9' : '#1976D2'} />
          <Text style={[styles.vacancyArea, isDarkMode ? styles.darkVacancyText : styles.lightVacancyText]}>
            {item.area.name}
          </Text>
        </View>
      </View>

      <View style={styles.vacancyDetails}>
        <View style={styles.detailItem}>
          <Icon name="work" size={16} color={isDarkMode ? '#90CAF9' : '#1976D2'} />
          <Text style={[styles.vacancyText, isDarkMode ? styles.darkVacancyText : styles.lightVacancyText]}>
            {item.employment}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="timelapse" size={16} color={isDarkMode ? '#90CAF9' : '#1976D2'} />
          <Text style={[styles.vacancyText, isDarkMode ? styles.darkVacancyText : styles.lightVacancyText]}>
            {item.experience}
          </Text>
        </View>
      </View>

      {item.salary && (
        <View style={styles.salaryContainer}>
          <Icon name="attach-money" size={16} color={isDarkMode ? '#FFD600' : '#FFAB00'} />
          <Text style={[styles.vacancySalary, isDarkMode ? styles.darkVacancyText : styles.lightVacancyText]}>
            {formatSalary(item.salary)}
          </Text>
        </View>
      )}

      <View style={styles.footerContainer}>
        <Text style={[styles.vacancyDate, isDarkMode ? styles.darkVacancyDate : styles.lightVacancyDate]}>
          {formatDate(item.published_at)}
        </Text>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => Linking.openURL(item.alternate_url)}
        >
          <Text style={styles.applyButtonText}>Откликнуться</Text>
          <Icon name="open-in-new" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderMessageItem = ({ item }) => (
    <Animated.View
      style={[
        item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
        { opacity: fadeAnim, marginVertical: 4 }
      ]}
    >
      <LinearGradient
        colors={item.sender === 'user'
          ? isDarkMode
            ? ['#1565C0', '#0D47A1']
            : ['#2196F3', '#1976D2']
          : isDarkMode
            ? ['#424242', '#303030']
            : ['#EEEEEE', '#E0E0E0']}
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.botBubble
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={item.sender === 'user' ? styles.userText : styles.botText}>
          {item.text}
        </Text>
        <Text style={item.sender === 'user' ? styles.userTime : styles.botTime}>
          {formatDate(item.timestamp)}
        </Text>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkSafeArea]}>
      <LinearGradient
        colors={isDarkMode ? ['#121212', '#000000'] : ['#f5f5f5', '#e0e0e0']}
        style={styles.container}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon
              name="arrow-back"
              size={24}
              color={isDarkMode ? '#90CAF9' : '#1976D2'}
            />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, isDarkMode ? styles.darkHeaderTitle : styles.lightHeaderTitle]}>
            Вакансии Якутии
          </Text>

          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.regionButton}
              onPress={animateModalIn}
            >
              <Icon name="location-on" size={20} color={isDarkMode ? '#90CAF9' : '#1976D2'} />
              <Text
                style={[
                  styles.regionButtonText,
                  isDarkMode ? styles.darkRegionButtonText : styles.lightRegionButtonText
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {selectedRegion ? selectedRegion.text.split('(')[0].trim() : 'Регион'}
              </Text>
              <Icon name="arrow-drop-down" size={20} color={isDarkMode ? '#90CAF9' : '#1976D2'} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleDarkMode} style={styles.themeButton}>
              <Icon
                name={isDarkMode ? 'wb-sunny' : 'nights-stay'}
                size={24}
                color={isDarkMode ? '#FFC107' : '#673AB7'}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.messagesContainer}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                {typingIndicator && (
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDots}>
                      <View style={[styles.dot, isDarkMode ? styles.darkDot : styles.lightDot]} />
                      <View style={[styles.dot, isDarkMode ? styles.darkDot : styles.lightDot]} />
                      <View style={[styles.dot, isDarkMode ? styles.darkDot : styles.lightDot]} />
                    </View>
                    <Text style={[styles.typingText, isDarkMode ? styles.darkTypingText : styles.lightTypingText]}>
                      Бот печатает...
                    </Text>
                  </View>
                )}

                {vacancies.length > 0 && (
                  <View style={styles.regionInfo}>
                    <Text style={[
                      styles.regionInfoText,
                      isDarkMode ? styles.darkRegionInfoText : styles.lightRegionInfoText
                    ]}>
                      {regionVacanciesTitle}
                    </Text>
                  </View>
                )}
              </View>
            }
            ListFooterComponent={
              <>
                <FlatList
                  data={vacancies}
                  renderItem={renderVacancyItem}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={handleRefresh}
                      colors={[isDarkMode ? '#90CAF9' : '#1976D2']}
                      tintColor={isDarkMode ? '#90CAF9' : '#1976D2'}
                    />
                  }
                />

                {hasMoreVacancies && vacancies.length > 0 && (
                  <TouchableOpacity
                    style={[
                      styles.loadMoreButton,
                      isDarkMode ? styles.darkLoadMoreButton : styles.lightLoadMoreButton
                    ]}
                    onPress={handleLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={isDarkMode ? '#90CAF9' : '#1976D2'} />
                    ) : (
                      <Text style={[
                        styles.loadMoreButtonText,
                        isDarkMode ? styles.darkLoadMoreText : styles.lightLoadMoreText
                      ]}>
                        Загрузить еще
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            }
          />

          <View style={[
            styles.inputContainer,
            isDarkMode ? styles.darkInputContainer : styles.lightInputContainer
          ]}>
            <TextInput
              style={[
                styles.input,
                isDarkMode ? styles.darkInput : styles.lightInput
              ]}
              placeholder="Введите сообщение..."
              placeholderTextColor={isDarkMode ? '#757575' : '#9E9E9E'}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSend}
              multiline
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <LinearGradient
                colors={message.trim()
                  ? isDarkMode
                    ? ['#4CAF50', '#2E7D32']
                    : ['#8BC34A', '#689F38']
                  : isDarkMode
                    ? ['#424242', '#303030']
                    : ['#BDBDBD', '#9E9E9E']}
                style={styles.sendButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="send" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Модальное окно выбора региона */}
        <Modal
          visible={isRegionModalVisible}
          animationType="none"
          transparent={true}
          onRequestClose={animateModalOut}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={animateModalOut}
          >
            <Animated.View
              style={[
                styles.modalContent,
                isDarkMode ? styles.darkModalContent : styles.lightModalContent,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              <View style={[
                styles.modalHeader,
                isDarkMode ? styles.darkModalHeader : styles.lightModalHeader
              ]}>
                <Text style={[
                  styles.modalTitle,
                  isDarkMode ? styles.darkModalText : styles.lightModalText
                ]}>
                  Выберите регион
                </Text>
                <TouchableOpacity onPress={animateModalOut}>
                  <Icon name="close" size={24} color={isDarkMode ? '#F5F5F5' : '#424242'} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={yakutiaRegions}
                renderItem={renderRegionItem}
                keyExtractor={(item) => item.id}
                style={styles.regionList}
                contentContainerStyle={styles.regionListContent}
              />
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  darkSafeArea: {
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 5,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginLeft: -24, // Компенсируем кнопку назад
  },
  darkHeaderTitle: {
    color: '#FFFFFF',
  },
  lightHeaderTitle: {
    color: '#212121',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  regionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    maxWidth: width * 0.4,
  },
  regionButtonText: {
    marginHorizontal: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  darkRegionButtonText: {
    color: '#90CAF9',
  },
  lightRegionButtonText: {
    color: '#1976D2',
  },
  themeButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  messagesContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 10,
  },
  listHeader: {
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    marginLeft: '20%',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    marginRight: '20%',
  },
  userBubble: {
    borderBottomRightRadius: 2,
  },
  botBubble: {
    borderBottomLeftRadius: 2,
  },
  userText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: '#212121',
    fontSize: 16,
    lineHeight: 22,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  botTime: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10,
  },
  typingText: {
    fontSize: 14,
    marginLeft: 8,
  },
  darkTypingText: {
    color: '#BDBDBD',
  },
  lightTypingText: {
    color: '#757575',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  darkDot: {
    backgroundColor: '#BDBDBD',
  },
  lightDot: {
    backgroundColor: '#757575',
  },
  regionInfo: {
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  regionInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  darkRegionInfoText: {
    color: '#FFFFFF',
  },
  lightRegionInfoText: {
    color: '#212121',
  },
  vacancyContainer: {
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkVacancyContainer: {
    backgroundColor: '#424242',
  },
  lightVacancyContainer: {
    backgroundColor: '#FFFFFF',
  },
  vacancyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 22,
  },
  darkVacancyTitle: {
    color: '#FFFFFF',
  },
  lightVacancyTitle: {
    color: '#212121',
  },
  vacancyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vacancyEmployer: {
    fontSize: 14,
    marginLeft: 5,
    flexShrink: 1,
  },
  vacancyArea: {
    fontSize: 14,
    marginLeft: 5,
    flexShrink: 1,
  },
  vacancyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vacancyText: {
    fontSize: 13,
    marginLeft: 5,
  },
  darkVacancyText: {
    color: '#E0E0E0',
  },
  lightVacancyText: {
    color: '#616161',
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  vacancySalary: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 5,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  vacancyDate: {
    fontSize: 12,
  },
  darkVacancyDate: {
    color: '#9E9E9E',
  },
  lightVacancyDate: {
    color: '#757575',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
    marginRight: 5,
  },
  loadMoreButton: {
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
  },
  darkLoadMoreButton: {
    borderColor: '#90CAF9',
    backgroundColor: 'rgba(144, 202, 249, 0.1)',
  },
  lightLoadMoreButton: {
    borderColor: '#1976D2',
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  },
  loadMoreButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  darkLoadMoreText: {
    color: '#90CAF9',
  },
  lightLoadMoreText: {
    color: '#1976D2',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  darkInputContainer: {
    backgroundColor: '#212121',
    borderTopColor: '#424242',
  },
  lightInputContainer: {
    backgroundColor: '#FAFAFA',
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderRadius: 20,
    fontSize: 16,
    marginRight: 10,
    textAlignVertical: 'center',
  },
  darkInput: {
    backgroundColor: '#424242',
    color: '#F5F5F5',
  },
  lightInput: {
    backgroundColor: '#FFFFFF',
    color: '#212121',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    maxHeight: height * 0.7,
  },
  darkModalContent: {
    backgroundColor: '#424242',
  },
  lightModalContent: {
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  darkModalHeader: {
    borderBottomColor: '#616161',
  },
  lightModalHeader: {
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkModalText: {
    color: '#F5F5F5',
  },
  lightModalText: {
    color: '#212121',
  },
  regionList: {
    flex: 1,
  },
  regionListContent: {
    paddingBottom: 20,
  },
  regionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  darkRegionItem: {
    borderBottomColor: '#616161',
  },
  lightRegionItem: {
    borderBottomColor: '#EEEEEE',
  },
  selectedRegionItem: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  },
  regionText: {
    flex: 1,
    fontSize: 16,
  },
  darkRegionText: {
    color: '#F5F5F5',
  },
  lightRegionText: {
    color: '#212121',
  },
  selectedRegionText: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  regionIcon: {
    marginLeft: 10,
  },
});

export default MessagesScreen;
