import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const WelcomeScreen = ({ navigation }) => {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            navigation.replace('Home');
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (

        <LinearGradient
            colors={['#3F6CDF', '#56CCF2']}
            style={styles.container}
        >
            <Image
                source={require('../../assets/office.png')}
                style={styles.logo}
            />
            <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
                Добро пожаловать!
            </Animated.Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    text: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
    },
});

export default WelcomeScreen;
