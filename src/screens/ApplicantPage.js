import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';

const ApplicantPage = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Профиль соискателя</Text>
            <View style={styles.profileContainer}>
                <Image
                    source={require('../../assets/almaze1.png')}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>Иван Иванов</Text>
                <Text style={styles.details}>UI/UX Дизайнер с опытом работы 3 года</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Навыки</Text>
                <Text style={styles.text}>- Проектирование пользовательских интерфейсов</Text>
                <Text style={styles.text}>- Создание прототипов</Text>
                <Text style={styles.text}>- Работа с инструментами Figma, Sketch</Text>
                <Text style={styles.text}>- Владение Adobe Creative Suite</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Опыт работы</Text>
                <Text style={styles.text}>- Компания XYZ, UI/UX Дизайнер (2021-2023)</Text>
                <Text style={styles.text}>- Startup ABC, Junior Designer (2018-2021)</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#FFF'
    },
    header: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 16
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 24
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8
    },
    name: {
        fontSize: 20,
        fontWeight: '600'
    },
    details: {
        fontSize: 14,
        color: '#555'
    },
    section: {
        marginBottom: 16
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8
    },
    text: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4
    }
});

export default ApplicantPage;
