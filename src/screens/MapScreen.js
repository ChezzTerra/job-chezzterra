import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MapScreen = ({ navigation }) => {
  const [jobVacancies, setJobVacancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [isRegionModalVisible, setIsRegionModalVisible] = useState(false);

  // Регионы Якутии с корректными кодами и координатами
  const yakutiaRegions = [
    {
      id: "1174",
      text: "Республика Саха (Якутия)",
      coordinates: {
        latitude: 62.0281,
        longitude: 129.7326,
        latitudeDelta: 10.0,
        longitudeDelta: 10.0
      }
    },
    {
      id: "1179",
      text: "Мирный",
      coordinates: {
        latitude: 62.5353,
        longitude: 113.961,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      }
    },
    {
      id: "1183",
      text: "Покровск",
      coordinates: {
        latitude: 61.478,
        longitude: 129.127,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      }
    },
    {
      id: "7372",
      text: "Ленинский",
      coordinates: {
        latitude: 62.0281,
        longitude: 129.7326,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2
      }
    },
    {
      id: "6916",
      text: "Солнечный",
      coordinates: {
        latitude: 60.3028,
        longitude: 137.5556,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      }
    },
    {
      id: "6012",
      text: "Чернышевский",
      coordinates: {
        latitude: 63.0128,
        longitude: 112.4714,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      }
    }
  ];

  useEffect(() => {
    const defaultRegion = yakutiaRegions[0];
    setSelectedRegion(defaultRegion);
    setMapRegion(defaultRegion.coordinates);
    fetchJobVacancies(defaultRegion.id, defaultRegion.coordinates);
  }, []);

  const fetchJobVacancies = async (regionId, regionCoords) => {
    try {
      setIsLoading(true);
      setError(null);
      setJobVacancies([]);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const dateFrom = sevenDaysAgo.toISOString().split('T')[0];

      const params = new URLSearchParams({
        area: regionId,
        text: "IT",
        per_page: 15,
        only_with_address: true,
        date_from: dateFrom
      });

      const url = `https://api.hh.ru/vacancies?${params}`;
      console.log("Fetching vacancies from:", url);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'JobMapApp/1.0 (support@jobmapapp.com)',
          'HH-User-Agent': 'JobMapApp/1.0 (https://jobmapapp.com)'
        }
      });

      if (!response.ok) {
        const status = response.status;
        let errorMessage = `Ошибка API: ${status}`;

        if (status === 403) {
          errorMessage = 'Превышен лимит запросов к API';
        } else if (status === 500) {
          errorMessage = 'Ошибка сервера HH.ru';
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("API Response:", JSON.stringify(responseData, null, 2));

      if (!responseData.items || responseData.items.length === 0) {
        throw new Error('Вакансии не найдены для выбранного региона');
      }

      const vacanciesWithCoords = [];

      for (const item of responseData.items) {
        try {
          let lat, lng;

          if (item.address?.point?.lat && item.address?.point?.lng) {
            lat = parseFloat(item.address.point.lat);
            lng = parseFloat(item.address.point.lng);
          } else if (item.address?.lat && item.address?.lng) {
            lat = parseFloat(item.address.lat);
            lng = parseFloat(item.address.lng);
          }

          if (lat && lng) {
            let salaryText = 'З/п не указана';
            if (item.salary) {
              const { from, to, currency } = item.salary;
              if (from && to) {
                salaryText = `${from} - ${to} ${currency}`;
              } else if (from) {
                salaryText = `от ${from} ${currency}`;
              } else if (to) {
                salaryText = `до ${to} ${currency}`;
              }
            }

            vacanciesWithCoords.push({
              id: item.id,
              title: item.name,
              latitude: lat,
              longitude: lng,
              salary: salaryText,
              employer: item.employer?.name || 'Компания не указана',
              snippet: item.snippet?.requirement || 'Описание отсутствует',
              url: item.alternate_url,
              address: item.address?.raw || 'Адрес не указан',
              region: regionCoords
            });
          } else {
            console.log(`Вакансия ${item.id} без координат:`, item.address);
          }
        } catch (e) {
          console.warn('Ошибка обработки вакансии:', item.id, e.message);
        }
      }

      if (vacanciesWithCoords.length === 0) {
        throw new Error('Нет вакансий с координатами в выбранном регионе');
      }

      setJobVacancies(vacanciesWithCoords);
      console.log(`Найдено вакансий с координатами: ${vacanciesWithCoords.length}`);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setError(error.message || 'Неизвестная ошибка при загрузке данных');
      Alert.alert(
        'Ошибка загрузки',
        error.message || 'Произошла неизвестная ошибка',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setIsRegionModalVisible(false);
    setIsLoading(true);
    fetchJobVacancies(region.id, region.coordinates);
  };

  const handleRefresh = () => {
    if (selectedRegion) {
      setIsLoading(true);
      fetchJobVacancies(selectedRegion.id, selectedRegion.coordinates);
    }
  };

  const renderRegionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.regionItem}
      onPress={() => handleRegionSelect(item)}
    >
      <Text style={styles.regionText}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Добавленный заголовок с кнопкой назад */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Карта вакансий</Text>
      </View>

      <TouchableOpacity
        style={styles.regionButton}
        onPress={() => setIsRegionModalVisible(true)}
      >
        <Text style={styles.regionButtonText}>
          {selectedRegion ? selectedRegion.text : 'Выбрать регион'}
        </Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2c3e50" />
          <Text style={styles.messageText}>
            Поиск актуальных вакансий в {selectedRegion?.text || 'Якутии'}...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Обновить данные</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <MapView
          style={styles.map}
          region={mapRegion}
          provider="google"
          onRegionChangeComplete={setMapRegion}
        >
          {jobVacancies.map(job => (
            <Marker
              key={job.id}
              coordinate={{
                latitude: job.latitude,
                longitude: job.longitude
              }}
              title={job.title}
              description={`${job.salary} | ${job.employer}`}
              onPress={() => navigation.navigate('JobDetail', { job })}
              pinColor="#27ae60"
            />
          ))}

          {selectedRegion && (
            <Marker
              coordinate={selectedRegion.coordinates}
              title={`Центр ${selectedRegion.text}`}
              pinColor="#e74c3c"
            />
          )}
        </MapView>
      )}

      <Modal
        visible={isRegionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsRegionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Выберите регион Якутии</Text>

            <FlatList
              data={yakutiaRegions}
              renderItem={renderRegionItem}
              keyExtractor={(item) => item.id}
              style={styles.regionList}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsRegionModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginLeft: -24,
  },
  map: {
    flex: 1
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  messageText: {
    marginTop: 15,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center'
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20
  },
  regionButton: {
    position: 'absolute',
    top: 100,
    left: 20,
    zIndex: 10,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  regionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2c3e50',
  },
  regionList: {
    maxHeight: '70%',
    marginBottom: 15,
  },
  regionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  regionText: {
    fontSize: 16,
    color: '#34495e',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MapScreen;
