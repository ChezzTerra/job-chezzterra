// SettingsScreen.js

import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  // Состояния для хранения настроек
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Функции для переключения настроек
  const toggleDarkTheme = () => setIsDarkTheme(previousState => !previousState);
  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Настройки</Text>

      {/* Переключатель для темной темы */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Темная тема</Text>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleDarkTheme}
        />
      </View>

      {/* Переключатель для уведомлений */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Уведомления</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      {/* Кнопка для возврата на предыдущий экран */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Назад</Text>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  settingText: {
    fontSize: 18,
  },
  backButton: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SettingsScreen;
