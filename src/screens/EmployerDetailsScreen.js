import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const EmployerDetailsScreen = ({ route }) => {
    const { jobTitle, jobSalary } = route.params;

    return (
        <ScrollView style={styles.container}>
            {/* Логотип компании */}
            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/150' }} // Замените URL на реальный логотип компании
                    style={styles.logo}
                />
            </View>

            {/* Название компании */}
            <Text style={styles.companyName}>ООО «Название Компании»</Text>

            {/* Описание компании */}
            <Text style={styles.description}>
                Наша компания — лидер в области разработки инновационных решений для IT-сферы. Мы гордимся тем, что создаем благоприятные условия для профессионального роста и самореализации сотрудников.
            </Text>

            {/* Информация о вакансии */}
            <View style={styles.jobDetailsContainer}>
                <Text style={styles.jobTitle}>{jobTitle}</Text>
                <Text style={styles.jobSalary}>Зарплата: {jobSalary}</Text>
                <Text style={styles.jobDescription}>
                    В этой роли вы будете участвовать в разработке и поддержке масштабных проектов, применяя передовые технологии и методологии.
                </Text>
            </View>

            {/* Требования */}
            <Text style={styles.sectionTitle}>Требования:</Text>
            <Text style={styles.textItem}>- Опыт работы от 3 лет в соответствующей области.</Text>
            <Text style={styles.textItem}>- Глубокие знания React/React Native.</Text>
            <Text style={styles.textItem}>- Умение работать в команде и ответственность.</Text>

            {/* Условия работы */}
            <Text style={styles.sectionTitle}>Мы предлагаем:</Text>
            <Text style={styles.textItem}>- Конкурентоспособную заработную плату и бонусы.</Text>
            <Text style={styles.textItem}>- Дружелюбную атмосферу и гибкий график работы.</Text>
            <Text style={styles.textItem}>- Современный офис в центре города.</Text>
            <Text style={styles.textItem}>- Возможность удаленной работы.</Text>

            {/* Контакты */}
            <Text style={styles.sectionTitle}>Контакты для связи:</Text>
            <Text style={styles.contactDetails}>Email: hr@company.ru</Text>
            <Text style={styles.contactDetails}>Телефон: +7 (123) 456-78-90</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 16,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: '#1E90FF',
    },
    companyName: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#333',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
    jobDetailsContainer: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        marginBottom: 20,
    },
    jobTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    jobSalary: {
        fontSize: 18,
        color: '#1E90FF',
        marginBottom: 12,
    },
    jobDescription: {
        fontSize: 16,
        color: '#777',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1E90FF',
    },
    textItem: {
        fontSize: 16,
        color: '#555',
        marginBottom: 6,
    },
    contactDetails: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
});

export default EmployerDetailsScreen;
