// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import JobScreen from './src/screens/JobScreen';
import ApplicationScreen from './src/screens/ApplicationScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import MapScreen from './src/screens/MapScreen';
import JobDetailScreen from './src/screens/JobDetailScreen';
import EmployerPage from './src/screens/EmployerPage';
import EmployerDetailsScreen from './src/screens/EmployerDetailsScreen';
import ApplicantPage from './src/screens/ApplicantPage';
import TopEmployersScreen from './src/screens/TopEmployersScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import CreateJobScreen from './src/screens/CreateJobScreen';
import JobListScreen from './src/screens/JobListScreen';
import JobSeekerScreen from './src/screens/JobSeekerScreen';
import AllVacanciesScreen from './src/screens/AllVacanciesScreen'; // Убедитесь, что импорт правильный
import JobSearch from './src/screens/JobSearch';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar backgroundColor='#356CDF' style='light' />
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name='Home' component={HomeScreen} />

                    <Stack.Screen name='Job' component={JobScreen} />
                    <Stack.Screen name='Application' component={ApplicationScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Регистрация' }} />
                    <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: 'Сообщения' }} />
                    <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Настройки' }} />
                    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Редактировать профиль' }} />
                    <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Карта вакансий' }} />
                    <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Детали вакансии' }} />
                    <Stack.Screen name="CreateJobScreen" component={CreateJobScreen} />
                    <Stack.Screen name="EmployerDetailsScreen" component={EmployerDetailsScreen} options={{ title: 'Детали вакансии' }} />
                    <Stack.Screen name="ApplicantPage" component={ApplicantPage} options={{ title: 'Соискатель' }} />
                    <Stack.Screen name="TopEmployers" component={TopEmployersScreen} options={{ title: 'Лучшие работодатели' }} />
                    <Stack.Screen name="EmployerPage" component={EmployerPage} options={{ title: 'Работодатель' }} />
                    <Stack.Screen name="JobListScreen" component={JobListScreen} />
                    <Stack.Screen name="JobSeekerScreen" component={JobSeekerScreen} />
                    <Stack.Screen
    name="JobSearch"
    component={JobSearch}
    options={{ title: 'Поиск работы в Якутии' }}
  />
                    {/* Добавьте этот компонент для экрана всех вакансий */}
                    <Stack.Screen
                        name="AllVacancies"
                        component={AllVacanciesScreen}
                        options={{
                            title: 'Все вакансии',
                            headerShown: true, // Показать заголовок
                            headerStyle: {
                                backgroundColor: '#3F6CDF',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
