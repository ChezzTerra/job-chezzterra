// RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        if (username && password) {
            navigation.navigate('HomeScreen', { userName: username });
        } else {
            alert('Пожалуйста, заполните все поля');
        }
    };

    const handleGoBack = () => {
        navigation.navigate('HomeScreen');
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Регистрация</Text>

            <TextInput
                placeholder='Введите имя'
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />

            <TextInput
                placeholder='Введите пароль'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <TouchableOpacity
                onPress={handleRegister}
                style={[styles.button, styles.registerButton]}
            >
                <Text style={styles.buttonText}>Зарегистрироваться</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleGoBack}
                style={[styles.button, styles.backButton]}
            >
                <Text style={[styles.buttonText, { color: '#000' }]}>Назад</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        padding: 12,
    },
    button: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    registerButton: {
        backgroundColor: '#3F6CDF',
    },
    backButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
        color: '#FFF',
    },
});

export default Register;
